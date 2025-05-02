import os
import json
import uuid
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query # type: ignore
from backend.utils.template_parser import parse_persona_template
from backend.utils.id_utils import generate_unique_id
from backend.utils.scope_checker import is_in_scope
from backend.services.llm import generate_response_from_llm

router = APIRouter()
DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/agents")
os.makedirs(DATA_PATH, exist_ok=True)

@router.post("/build")
async def build_ai(
    name: str = Form(...),
    file: UploadFile = File(...)
):
    if not file.filename.endswith(".txt"):
        raise HTTPException(status_code=400, detail="Only .txt files are supported.")

    content = await file.read()
    text = content.decode("utf-8")
    persona = parse_persona_template(text)

    user_id = generate_unique_id(name)
    agent_name_raw = persona.get("Name", "").lower().replace(" ", "_")
    if not agent_name_raw:
        raise HTTPException(status_code=400, detail="Agent name missing from template.")

    agent_id = f"{agent_name_raw}_{user_id}_{str(uuid.uuid4())[:8]}"
    persona["agent_id"] = agent_id
    persona["user_id"] = user_id

    save_path = os.path.join(DATA_PATH, f"{agent_id}.json")
    with open(save_path, "w") as f:
        json.dump(persona, f, indent=4)

    return {
        "message": f"Agent '{persona['Name']}' created successfully.",
        "agent_id": agent_id,
        "user_id": user_id
    }


@router.get("/use/{agent_id}")
async def use_agent(agent_id: str, question: str = Query(...)):
    # Locate the agent file
    agents_dir = os.path.join(os.path.dirname(__file__), "../data/agents")
    filepath = os.path.join(agents_dir, f"{agent_id}.json")

    # Check if the file exists
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Agent not found.")

    # Load agent persona
    with open(filepath, "r") as f:
        persona = json.load(f)

    # Parse fields from persona template
    name = persona.get("Name", "This Agent")
    style = persona.get("Preferred Communication Style", "")
    signature = persona.get("Signature Phrases", "")
    bio = persona.get("Intro About Me", "")
    allowed_topics = persona.get("Topics I Talk About", "")
    avoid = persona.get("Topics to Avoid", "")
    extra_instructions = persona.get("Extra Instructions", "")

    # Prepare topics
    topics = [topic.strip() for topic in allowed_topics.split(",")]

    # Generate system prompt
    system_prompt = (
        f"You are {name}, {bio}\n"
        f"Your tone is: {style}\n"
        f"You often say things like: {signature}\n"
        f"You ONLY discuss: {allowed_topics}\n"
        f"You NEVER answer questions about: {avoid}\n"
        f"If a question is off-topic, kindly say you're not able to answer and suggest staying on topic.\n"
        f"If it's a greeting or small talk, always respond warmly and politely.\n"
        f"Here is the user's message. Respond accordingly."
    )

    # Use OpenAI to generate the answer
    answer = generate_response_from_llm(system_prompt, question)

    return {
        "agent": name,
        "response": answer
    }