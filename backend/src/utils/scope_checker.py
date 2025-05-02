from typing import List

def is_in_scope(question: str, allowed_topics: List[str]) -> bool:
    question_lower = question.lower()

    greetings = [
        "hello", "hi", "hey", "how are you", "good morning", "good evening",
        "what's up", "how's it going"
    ]
    if any(greet in question_lower for greet in greetings):
        return True

    return any(topic.lower() in question_lower for topic in allowed_topics)
