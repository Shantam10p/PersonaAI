def parse_persona_template(file_text: str) -> dict:
    sections = [
        "Name", "Profession or Role", "Preferred Communication Style",
        "Signature Phrases", "Topics I Talk About", "Topics to Avoid",
        "Response Length Preference", "Intro About Me",
        "Voice Personality Keywords", "Extra Instructions"
    ]

    result = {}
    for section in sections:
        try:
            part = file_text.split(f"[{section}]")[1].split("[")[0].strip()
            result[section] = part
        except IndexError:
            result[section] = ""
    return result
