import hashlib
import re

def generate_unique_id(input_string: str) -> str:
    """
    Generates a unique identifier based on a string input.
    
    Args:
        input_string: The string to generate an ID from
        
    Returns:
        A short unique identifier string
    """
    # Normalize the input string
    normalized = input_string.lower().strip()
    
    # Create a hash of the string
    hash_obj = hashlib.md5(normalized.encode())
    hash_str = hash_obj.hexdigest()
    
    # Take first 8 characters of hash as the ID
    return hash_str[:8]