/**
 * Generate a sample persona template that users can download
 * @param {Object} options - Configuration options for the template
 * @returns {string} The template content
 */
export const generateTemplate = (options = {}) => {
  const {
    name = "Expert Educator",
    style = "Friendly, clear, and encouraging. Uses simple language to explain complex topics.",
    phrases = "Let me explain..., Think of it this way..., You're doing great!, That's an excellent question!",
    intro = "I'm an experienced educator specializing in making difficult concepts easy to understand.",
    topics = "Science, Mathematics, History, Literature, Learning techniques, Study skills",
    avoid = "Personal advice, Medical advice, Legal advice, Political opinions",
    extra = "Keep explanations concise but thorough. Use analogies when helpful. Encourage critical thinking.",
  } = options;

  return `Name: ${name}
Preferred Communication Style: ${style}
Signature Phrases: ${phrases}
Intro About Me: ${intro}
Topics I Talk About: ${topics}
Topics to Avoid: ${avoid}
Extra Instructions: ${extra}`;
};

/**
 * Create and download a template file
 */
export const downloadTemplateFile = (options = {}) => {
  const content = generateTemplate(options);
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "persona_template.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
