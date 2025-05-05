// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Create from "./pages/Create.jsx";
import ExistingPersonasPage from "./pages/ExistingPersonasPage.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/create" element={<Create />} />
          <Route path="/use/:agentId" element={<ChatPage />} />
          <Route path="/existing" element={<ExistingPersonasPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
