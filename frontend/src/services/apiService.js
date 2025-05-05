const API_BASE_URL = "http://localhost:8000";

export const apiService = {
  // Create a new persona
  async createPersona(formData) {
    try {
      console.log("Sending request to create persona:", formData.get("name"));

      const response = await fetch(`${API_BASE_URL}/ai/build`, {
        method: "POST",
        body: formData, // Contains name and file
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create persona");
      }

      console.log("Persona created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating persona:", error);
      throw error;
    }
  },

  // Get response from an existing persona
  async getPersonaResponse(agentId, question) {
    try {
      console.log(
        `Getting response for agent ${agentId} with question: ${question}`
      );

      const response = await fetch(
        `${API_BASE_URL}/ai/use/${agentId}?question=${encodeURIComponent(
          question
        )}`,
        { method: "GET" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get response from persona");
      }

      return data;
    } catch (error) {
      console.error("Error getting persona response:", error);
      throw error;
    }
  },

  // Get all existing personas
  async getExistingPersonas() {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/list`, {
        method: "GET",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch existing personas");
      }

      return data;
    } catch (error) {
      console.error("Error fetching existing personas:", error);
      throw error;
    }
  },
};

export default apiService;
