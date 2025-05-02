import uuid

def generate_unique_id(base: str) -> str:
    return f"{base.lower().replace(' ', '_')}_{str(uuid.uuid4())[:8]}"
