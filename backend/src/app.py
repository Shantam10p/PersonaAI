from fastapi import FastAPI  # type: ignore 
from backend.routers import ai 

app = FastAPI()

@app.get("/")
async def home_page():
    return {"message": "Welcome to Persona AI."}

app.include_router(ai.router, prefix="/ai") 


