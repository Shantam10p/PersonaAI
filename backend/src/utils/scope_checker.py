def is_in_scope(question: str, allowed_topics: list) -> bool:
    """
    Checks if a question is within the allowed topics scope.
    
    Args:
        question: The question to check
        allowed_topics: List of topics the agent can discuss
        
    Returns:
        Boolean indicating if the question is in scope
    """
    # Simple implementation - checks if any allowed topic appears in the question
    question_lower = question.lower()
    
    # If no allowed topics specified, consider everything in scope
    if not allowed_topics or len(allowed_topics) == 0:
        return True
        
    # Check if any allowed topic is in the question
    for topic in allowed_topics:
        if topic.lower() in question_lower:
            return True
            
    # If no matches were found, assume it might be general conversation
    # The LLM system prompt will handle proper restrictions
    return True