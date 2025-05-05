import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import apiService from "../services/apiService";
import pLogo from "../assets/P-logo.png";
import "./ChatPage.css";

const ChatPage = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [personaInfo, setPersonaInfo] = useState(null);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial load - get persona info
  useEffect(() => {
    const loadPersonaInfo = async () => {
      try {
        // For the initial message, we'll ask the persona to introduce itself
        const response = await apiService.getPersonaResponse(
          agentId,
          "Please introduce yourself briefly."
        );

        setPersonaInfo({
          name: response.agent,
          // Extract more info if your API returns it
        });

        setChat([
          {
            type: "agent",
            content: response.response,
            agent: response.agent,
          },
        ]);

        setInitialLoading(false);
      } catch (err) {
        console.error("Error loading persona information:", err);
        setError(
          "Could not load persona information. The persona ID may be invalid."
        );
        setInitialLoading(false);
      }
    };

    if (agentId) {
      loadPersonaInfo();
    }
  }, [agentId]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (!loading && chat.length > 0) {
      inputRef.current?.focus();
    }
  }, [chat, loading]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userQuestion = question;
    setChat((prev) => [...prev, { type: "user", content: userQuestion }]);
    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const response = await apiService.getPersonaResponse(
        agentId,
        userQuestion
      );
      setLoading(false);
      setChat((prev) => [
        ...prev,
        {
          type: "agent",
          content: response.response,
          agent: response.agent,
        },
      ]);
    } catch (err) {
      setLoading(false);
      setError(
        "Failed to get response. The server might be down or the persona might have been deleted."
      );
      console.error(err);
    }
  };

  const promptExamples = [
    "Tell me more about yourself",
    "What topics do you know about?",
    "What's your communication style?",
    "How can you help me?",
  ];

  const handleExampleClick = (example) => {
    setQuestion(example);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleQuestionSubmit(e);
    }
  };

  // If we're still loading initially, show a loader
  if (initialLoading) {
    return (
      <div className="persona-container">
        <header className="persona-header">
          <Link to="/" className="header-logo">
            <div className="logo-container">
              <img src={pLogo} alt="Persona.AI" className="p-logo" />
            </div>
            <h1>Persona.AI</h1>
            <span className="beta-badge">BETA</span>
          </Link>
        </header>

        <main className="chat-main loading-state">
          <div className="loading-container">
            <div className="loading-spinner large"></div>
            <p>Loading your persona...</p>
          </div>
        </main>
      </div>
    );
  }

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
          <button
            className="new-persona-button"
            onClick={() => navigate("/create")}
          >
            Create New Persona
          </button>
        </div>
      </header>

      <main className="chat-main">
        <div className="chat-container">
          <div className="chat-header">
            <h2>
              Chat with{" "}
              <span className="highlight-text">
                {personaInfo?.name || "Your Persona"}
              </span>
            </h2>
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="chat-messages">
            {chat.length === 0 ? (
              <div className="welcome-message">
                <h3>Welcome to your Persona Chat!</h3>
                <p>
                  The persona could not be loaded. Try these example prompts:
                </p>
                <div className="example-prompts">
                  {promptExamples.map((prompt, index) => (
                    <button
                      key={index}
                      className="example-prompt"
                      onClick={() => handleExampleClick(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chat.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.type === "user" ? "user-message" : "agent-message"
                  }`}
                >
                  <div className="message-bubble">
                    {message.type === "agent" && (
                      <div className="agent-name">{message.agent}</div>
                    )}
                    <p>{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="message agent-message">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form className="chat-input" onSubmit={handleQuestionSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !question.trim()}>
              Send
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
