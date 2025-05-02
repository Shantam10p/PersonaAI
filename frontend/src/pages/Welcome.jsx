// src/pages/Welcome.jsx
import React from "react";
import "./Welcome.css";
// Import the logo
import pLogo from "../assets/P-logo.png"; // Adjust file extension if needed (.svg, .jpg, etc.)

const Welcome = () => {
  return (
    <div className="welcome-container">
      {/* Decorative background elements */}
      <div className="decoration-circle circle-1"></div>
      <div className="decoration-circle circle-2"></div>
      <div className="decoration-circle circle-3"></div>

      <header className="welcome-header">
        <div className="header-logo">
          <div className="logo-container">
            <img src={pLogo} alt="Persona.AI" className="p-logo" />
          </div>
          <h1>Persona.AI</h1>
          <span className="beta-badge">BETA</span>
        </div>
        {/* Sign In button removed for MVP */}
      </header>

      <main className="welcome-main">
        <div className="welcome-content">
          <h2>
            Create Your Perfect <br />
            <span className="highlight-text">Digital Persona</span>
          </h2>
          <p>
            Design, customize, and deploy AI personas that represent you
            professionally. Perfect for professionals, creators, and businesses
            looking to scale their digital presence.
          </p>

          <div className="button-container">
            <button className="create-button">Create Your Persona</button>
            <button className="existing-button">Use Existing Persona</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Welcome;
