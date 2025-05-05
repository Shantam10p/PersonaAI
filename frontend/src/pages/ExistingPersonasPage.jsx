import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import pLogo from "../assets/P-logo.png";
import "./ExistingPersonasPage.css";

const ExistingPersonasPage = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonas = async () => {
      try {
        const data = await apiService.getExistingPersonas();
        setPersonas(data.personas || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load existing personas. Please try again later.");
        setLoading(false);
        console.error("Error fetching personas:", err);
      }
    };

    fetchPersonas();
  }, []);

  const handleUsePersona = (agentId) => {
    navigate(`/use/${agentId}`);
  };

  return (
    <div className="persona-container">
      {/* Decorative elements */}
      <div className="decoration-circle circle-1"></div>
      <div className="decoration-circle circle-2"></div>
      <div className="decoration-circle circle-3"></div>

      <header className="persona-header">
        <Link to="/" className="header-logo">
          <div className="logo-container">
            <img src={pLogo} alt="Persona.AI" className="p-logo" />
          </div>
          <h1>Persona.AI</h1>
          <span className="beta-badge">BETA</span>
        </Link>

        <div className="header-actions">
          <Link to="/create" className="new-persona-button">
            Create New Persona
          </Link>
        </div>
      </header>

      <main className="existing-main">
        <div className="existing-container">
          <h2>
            Your <span className="highlight-text">Personas</span>
          </h2>
          <p className="existing-description">
            Select one of your existing AI personas to start a conversation.
          </p>

          {error && <div className="error-message">{error}</div>}

          <div className="personas-grid">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner large"></div>
                <p>Loading your personas...</p>
              </div>
            ) : personas.length > 0 ? (
              personas.map((persona) => (
                <div className="persona-card" key={persona.agent_id}>
                  <div className="persona-card-content">
                    <h3>{persona.name}</h3>
                    <p className="persona-bio">{persona.intro}</p>
                    <div className="persona-details">
                      <div className="persona-detail">
                        <strong>Style:</strong> {persona.style}
                      </div>
                      <div className="persona-detail">
                        <strong>Topics:</strong> {persona.topics}
                      </div>
                    </div>
                  </div>
                  <div className="persona-card-actions">
                    <button
                      className="use-persona-button"
                      onClick={() => handleUsePersona(persona.agent_id)}
                    >
                      Chat with this Persona
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-personas">
                <h3>No personas found</h3>
                <p>You haven't created any personas yet.</p>
                <Link to="/create" className="create-first-button">
                  Create Your First Persona
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExistingPersonasPage;
