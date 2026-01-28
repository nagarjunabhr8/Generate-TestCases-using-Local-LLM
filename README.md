# Local LLM Test Case Generator

This project allows you to generate structured test cases using a local Ollama instance (Llama 3.2).

## Architecture
- **Frontend**: React + Vite (Modern UI with TailwindCSS)
- **Backend Service**: Python FastAPI (Acts as the B.L.A.S.T. Layer 2 Orchestrator)
- **Tools**: Python scripts (Layer 3) that communicate with Ollama.
- **AI Engine**: Local Ollama

## Prerequisites
1. **Ollama**: Installed and running (`ollama serve`).
2. **Model**: Llama 3.2 pulled (`ollama pull llama3.2`).
3. **Node.js**: For the frontend.
4. **Python 3.8+**: For the backend.

## Setup & Running

### 1. Backend
Open a terminal:
```bash
cd backend
pip install -r requirements.txt
python server.py
```
The server will start on `http://localhost:8000`.

### 2. Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
The frontend will run at `http://localhost:5173` (or similar).

### 3. Usage
- Open the frontend URL.
- Type a feature description (e.g., "Login page with strict password rules").
- The AI will generate test cases in JSON format, displayed beautifully.
