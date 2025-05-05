from pydantic import BaseModel #type: ignore
from typing import List

class AIConfig(BaseModel):
    name: str 
    allowed_topics:List[str]
    fallback_email: str
