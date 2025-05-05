def parse_persona_template(template_text: str) -> dict:
    """
    Parses a persona template text file into a dictionary.
    
    The template should be formatted with sections like:
    Name: John Doe
    Intro About Me: I am a software engineer...
    
    Args:
        template_text: The raw text content of the template file
        
    Returns:
        A dictionary with keys as section names and values as section content
    """
    lines = template_text.splitlines()
    persona = {}
    current_key = None
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        if ':' in line and not line.startswith(' '):
            # This is a new key
            key, value = line.split(':', 1)
            current_key = key.strip()
            persona[current_key] = value.strip()
        elif current_key:
            # This is a continuation of the previous value
            persona[current_key] += " " + line
    
    # Validate required fields
    required_fields = ["Name", "Intro About Me", "Topics I Talk About", "Topics to Avoid"]
    for field in required_fields:
        if field not in persona:
            persona[field] = ""  # Default empty string for missing fields
            
    return persona