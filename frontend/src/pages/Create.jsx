import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Create.css";

const API_BASE_URL = "http://localhost:8000";

const Create = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    introduction: "",
    communicationStyle: "",
    signaturePhrases: "",
    topicsIDiscuss: "",
    topicsToAvoid: "",
    extraInstructions: "",
  });

  // State to track which fields are expanded
  const [expandedFields, setExpandedFields] = useState({});

  const toggleField = (fieldName) => {
    setExpandedFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");

    // Create FormData for API request
    const apiFormData = new FormData();
    apiFormData.append("name", formData.name);

    // Create text content in the required format
    const templateContent = `Name: ${formData.name}
Intro About Me: ${formData.introduction}
Preferred Communication Style: ${formData.communicationStyle}
Signature Phrases: ${formData.signaturePhrases}
Topics I Talk About: ${formData.topicsIDiscuss}
Topics to Avoid: ${formData.topicsToAvoid}
Extra Instructions: ${formData.extraInstructions}`;

    // Create a file from the template content
    const templateFile = new File([templateContent], "persona_template.txt", {
      type: "text/plain",
    });

    apiFormData.append("file", templateFile);

    try {
      // Call the API
      const response = await fetch(`${API_BASE_URL}/ai/build`, {
        method: "POST",
        body: apiFormData,
      });

      const data = await response.json();
      console.log("API Response:", data); // Log the full response

      if (response.ok && data.agent_id) {
        console.log("Successfully created persona with ID:", data.agent_id);

        // Force navigation with a direct window location change
        // This is more reliable than using the navigate function
        window.location.href = `/use/${data.agent_id}`;
      } else {
        console.error("API error:", data);
        alert(`Error: ${data.detail || "Failed to create persona"}`);
      }
    } catch (error) {
      console.error("Error creating persona:", error);
      alert("Failed to create persona. Please try again.");
    }
  };

  // Field configuration for dropdown fields
  const fields = [
    {
      id: "name",
      label: "Persona Name",
      type: "input",
      placeholder: "My AI Assistant",
      required: true,
    },
    {
      id: "introduction",
      label: "Introduction About the Persona",
      type: "textarea",
      placeholder:
        "I am an AI assistant designed to provide helpful information and support.",
      helper:
        'Example: "I am a professional marketing consultant with 10+ years of experience..."',
      rows: 4,
    },
    {
      id: "communicationStyle",
      label: "Preferred Communication Style",
      type: "textarea",
      placeholder: "Professional, friendly, and concise.",
      helper:
        'Example: "Friendly but professional, uses simple language to explain complex topics"',
      rows: 3,
    },
    {
      id: "signaturePhrases",
      label: "Signature Phrases",
      type: "textarea",
      placeholder:
        "Let me help you with that! Is there anything else you'd like to know?",
      helper: "Phrases that this persona commonly uses",
      rows: 3,
    },
    {
      id: "topicsIDiscuss",
      label: "Topics I Discuss",
      type: "textarea",
      placeholder:
        "Technology, business strategies, customer support, productivity tips",
      helper:
        "Comma-separated list of topics this persona is knowledgeable about",
      rows: 3,
    },
    {
      id: "topicsToAvoid",
      label: "Topics to Avoid",
      type: "textarea",
      placeholder: "Political opinions, medical advice, legal advice",
      helper: "Topics this persona should not discuss or provide advice on",
      rows: 3,
    },
    {
      id: "extraInstructions",
      label: "Extra Instructions",
      type: "textarea",
      placeholder:
        "Always provide real-world examples. Keep answers brief but informative.",
      helper: "Additional instructions for how your persona should behave",
      rows: 4,
    },
  ];

  return (
    <div className="create-container">
      <header className="create-header">
        <h1>Create Your AI Persona</h1>
      </header>

      <main className="create-main">
        <form onSubmit={handleSubmit} className="create-form">
          <div className="persona-fields">
            <h2>Persona Details</h2>

            {fields.map((field) => (
              <div key={field.id} className="dropdown-field">
                <div
                  className="dropdown-header"
                  onClick={() => toggleField(field.id)}
                >
                  <span className="field-label">{field.label}</span>
                  <span
                    className={`dropdown-arrow ${
                      expandedFields[field.id] ? "open" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>

                <div
                  className={`dropdown-content ${
                    expandedFields[field.id] ? "open" : ""
                  }`}
                >
                  {field.type === "input" ? (
                    <input
                      type="text"
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  ) : (
                    <textarea
                      id={field.id}
                      name={field.id}
                      value={formData[field.id]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      rows={field.rows}
                    />
                  )}

                  {field.helper && (
                    <small className="field-helper">{field.helper}</small>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              Create Persona
            </button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Create;
