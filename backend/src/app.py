from fastapi import FastAPI  # type: ignore 
from fastapi.middleware.cors import CORSMiddleware  # Add this import
from src.routers import ai 

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL (Vite default port)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

@app.get("/")
async def home_page():
    return {"message": "Welcome to Persona AI."}

app.include_router(ai.router, prefix="/ai")


