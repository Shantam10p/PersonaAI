import os
import json
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query # type: ignore
from typing import Optional
from src.utils.template_parser import parse_persona_template
from src.utils.id_utils import generate_unique_id
from src.utils.scope_checker import is_in_scope
from src.services.llm import generate_response_from_llm

router = APIRouter()
DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/agents")
IMAGES_PATH = os.path.join(os.path.dirname(__file__), "../data/agent_images")
os.makedirs(DATA_PATH, exist_ok=True)
os.makedirs(IMAGES_PATH, exist_ok=True)

@router.post("/build")
async def build_ai(
    name: str = Form(...),
    file: UploadFile = File(...),
    image: Optional[UploadFile] = File(None)
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
    
    # Handle image upload if provided
    if image:
        image_ext = os.path.splitext(image.filename)[1] if image.filename else ".jpg"
        image_filename = f"{agent_id}{image_ext}"
        image_path = os.path.join(IMAGES_PATH, image_filename)
        
        # Save the image file
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Add image path to persona data
        persona["image_path"] = image_filename
    else:
        persona["image_path"] = "default.png"
    
    save_path = os.path.join(DATA_PATH, f"{agent_id}.json")
    with open(save_path, "w") as f:
        json.dump(persona, f, indent=4)

    return {
        "message": f"Agent '{persona['Name']}' created successfully.",
        "agent_id": agent_id,
        "user_id": user_id,
        "has_image": image is not None
    }


@router.get("/use/{agent_id}")
async def use_agent(agent_id: str, question: str = Query(...)):
    print("working")
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
    print("working 2 ")
    # Use OpenAI to generate the answer
    answer = generate_response_from_llm(system_prompt, question)
    print("working 3")
    return {
        "agent": name,
        "response": answer,
        "image_path": persona.get("image_path", "default.png")
    }

@router.get("/list")
async def list_agents():
    """
    List all available AI agents/personas
    """
    try:
        agents_dir = os.path.join(os.path.dirname(__file__), "../data/agents")
        personas = []
        
        # Check if directory exists
        if not os.path.exists(agents_dir):
            return {"personas": []}
        
        # Get all JSON files in the agents directory
        for filename in os.listdir(agents_dir):
            if filename.endswith('.json'):
                file_path = os.path.join(agents_dir, filename)
                
                with open(file_path, 'r') as f:
                    persona_data = json.load(f)
                    
                    # Extract key information for the list
                    persona_info = {
                        "agent_id": persona_data.get("agent_id"),
                        "name": persona_data.get("Name", "Unnamed Agent"),
                        "intro": persona_data.get("Intro About Me", "")[:100] + "..." if len(persona_data.get("Intro About Me", "")) > 100 else persona_data.get("Intro About Me", ""),
                        "style": persona_data.get("Preferred Communication Style", "")[:50] + "..." if len(persona_data.get("Preferred Communication Style", "")) > 50 else persona_data.get("Preferred Communication Style", ""),
                        "topics": persona_data.get("Topics I Talk About", "")[:50] + "..." if len(persona_data.get("Topics I Talk About", "")) > 50 else persona_data.get("Topics I Talk About", ""),
                        "user_id": persona_data.get("user_id", ""),
                        "image_path": persona_data.get("image_path", "default.png")
                    }
                    
                    personas.append(persona_info)
        
        return {"personas": personas}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing agents: {str(e)}")

# Add endpoint to serve images
@router.get("/agent-image/{image_filename}")
async def get_agent_image(image_filename: str):
    image_path = os.path.join(IMAGES_PATH, image_filename)
    if not os.path.exists(image_path):
        image_path = os.path.join(IMAGES_PATH, "default.png")
        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Image not found")
    
    return {"image_path": image_path}