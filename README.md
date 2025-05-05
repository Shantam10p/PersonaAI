# 💡 PersonaAI

**PersonaAI** is a platform for creating personalized AI personas that represent you professionally. Whether you're a creator, business, or professional, scale your interactions without losing your unique voice.

---

## 🌟 Overview

PersonaAI enables users to design AI personas with custom communication styles, expertise areas, and personality traits. Interact with these personas in real-time to enhance your digital presence.

---

## ✨ Features

- 🤖 **Create Custom Personas** – Design personas with unique characteristics  
- 🎭 **Avatar Selection** – Choose from a range of professional avatars  
- 💬 **Interactive Chat** – Real-time chat with your created personas  
- 📝 **Detailed Customization** – Define tone, expertise, and signature phrases  
- 📱 **Responsive Design** – Works seamlessly across desktop and mobile  
- 🔄 **Multi-Persona Management** – Manage different personas for various needs  

---

## 📸 Video Demo

![PersonaAI](https://github.com/user-attachments/assets/f4e68723-3b6a-4303-984b-78d664f02eb3)

---

## 🛠️ Tech Stack

### Frontend
- **React** – UI development and state management  
- **React Router** – Navigation between pages  
- **CSS** – Custom styling and responsive layout  

### Backend
- **FastAPI** – High-performance backend framework  
- **Python** – Core backend and AI logic  
- **OpenAI** – GPT-3.5 Turbo for NLP features  

---

## 📋 Prerequisites

- Node.js ≥ 14.x  
- Python ≥ 3.8  
- OpenAI API Key

---

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Shantam10p/PersonaAI.git
cd PersonaAI
```

### 2. Backend Setup

```bash
cd backend
python -m venv Persona_env

# Activate virtual environment
# Windows:
Persona_env\Scripts\activate
# Mac/Linux:
source Persona_env/bin/activate

pip install -r requirements.txt

# Add your OpenAI API key
echo OPENAI_API_KEY=your_openai_api_key > .env

# Run the server
uvicorn src.app:app --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be accessible at:  
- **Frontend:** http://localhost:5173  
- **Backend API:** http://localhost:8000

---

## 📱 Using PersonaAI

### ➕ Creating a New Persona
1. Click **"Create New Persona"**.
2. Fill in:
   - **Name**
   - **Introduction**
   - **Communication Style**
   - **Signature Phrases**
   - **Topics of Expertise / Avoid**
   - **Extra Instructions**
3. Select an avatar.
4. Click **"Create Persona"**.

### 💬 Chatting with Your Personas
- Go to **"Your Personas"**
- Select one and start chatting!
- The persona will respond using your defined parameters.

### 🧠 Managing Personas
- View and manage all personas in **"Your Personas"** section.
- Create, update, or delete based on your need.

---

## 🔄 API Endpoints

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| POST   | `/ai/build`          | Create a new persona               |
| GET    | `/ai/use/{agent_id}` | Interact with a specific persona   |
| GET    | `/ai/list`           | Get a list of all personas         |

---

## 🧩 Project Structure

```
PersonaAI/
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── assets/           # Images and static assets
│   │   ├── components/       # Reusable React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service functions
│   │   ├── styles/           # Global styles
│   │   └── utils/            # Utility functions
│   ├── index.html
│   └── package.json
│
└── backend/                  # FastAPI backend
    ├── src/
    │   ├── data/             # Persona storage
    │   ├── models/           # Data models
    │   ├── routers/          # API routes
    │   ├── services/         # AI services
    │   └── utils/            # Helper functions
    ├── requirements.txt
    └── .env                  # Environment variables (ignored)
```

---

## 🔮 Future Enhancements

- 🧑‍🎨 Upload custom avatars  
- 🔊 Add voice/text-to-speech  
- 📊 Analytics dashboard  
- 🤖 Support for multiple LLMs  
- 🔐 Authentication & persona privacy  
- 🧠 Long-term memory & context retention  

---

## 🤝 Contributing

Contributions are welcome!  

1. Fork the repo  
2. Create your feature branch: `git checkout -b feature/my-feature`  
3. Commit your changes: `git commit -m 'Add feature'`  
4. Push to the branch: `git push origin feature/my-feature`  
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🔗 Project Link

[https://github.com/Shantam10p/PersonaAI](https://github.com/Shantam10p/PersonaAI)
