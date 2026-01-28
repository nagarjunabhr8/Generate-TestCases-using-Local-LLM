# Findings & Research

## Project Goal
Create a local LLM Testcase generator utilizing Ollama.

## Discovery Answers
1. **North Star:** Local LLM Testcase generator using Ollama (Llama 3.2), accepting user input via a UI Chat and outputting structured test cases based on a stored template.
2. **Integrations:** Ollama (Local API).
3. **Source of Truth:** User Input (Chat Interface).
4. **Delivery Payload:** UI Chat Interface displaying generated test cases.
5. **Behavioral Rules:** User inputs requirements -> System uses Local LLM + Template -> System outputs Test Cases.

## Research & Technical Strategy
- **Ollama API:**
    - Endpoint: `http://localhost:11434/api/chat`
    - Method: `POST`
    - Payload: `{ "model": "llama3.2", "messages": [{"role": "user", "content": "..."}] }`
    - Integration: Direct HTTP calls from the UI (or via a lightweight proxy if CORS is an issue).
- **UI Framework:** Vite + React for a responsive, modern chat interface.
- **Template System:** We will store a "System Prompt" or "Template" in the code to structure the LLM's output.
