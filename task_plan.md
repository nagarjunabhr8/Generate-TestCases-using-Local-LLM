# Project Plan: Local LLM Testcase Generator

## Phase 1: Foundation & Setup
- [x] Initialize Project Memory
- [x] Use Discovery Questions
- [x] Approve Blueprint
- [x] Define Data Schema

## Phase 2: Core Implementation (B.L.A.S.T. Layer 2: Link)
- [x] Create `index.html` and `src/` structure (Vite + React).
- [x] Implement `OllamaService` to handle API calls.
- [x] Create the "Test Case Template" constant string.
- [x] Validate connection to local Ollama instance.

## Layer 3: Tools (Backend & Utilities)
- [x] Create `.env` for configuration.
- [x] Create `tools/generate_test_cases.js` (Node.js implementation of Layer 3).
- [x] Verify tool execution with sample prompt.

## Phase 3: User Interface (B.L.A.S.T. Layer 4: Stylize)
- [x] Setup Vite + React project.
- [x] Create `ChatComponent`:
    - [x] Input field for user requirements.
    - [x] Message list to display User vs. AI messages.
    - [x] Markdown/JSON renderer for Test Case output.
- [x] Setup Vite + React project.
- [x] Create `ChatComponent`:
    - [x] Input field for user requirements.
    - [x] Message list to display User vs. AI messages.
    - [x] Markdown/JSON renderer for Test Case output.
- [x] Style with CSS variables (Dark Mode, Glassmorphism).
- [x] Implement "Copy to Clipboard" for generated test cases.

## Phase 4: Refinement & Triggers (B.L.A.S.T. Layer 5: Trigger)

## Phase 3: Architect (The 3-Layer Build)
- [x] Layer 1: Create `architecture/SOP_test_generation.md`.
- [x] Layer 2: Create `main.py` (Navigation/Orchestrator) - *CLI Version*.
- [x] Layer 2: Create `backend/server.py` (FastAPI) - *Web Version*.
- [x] Layer 3: Create `tools/generate_test_cases.py` (Python).
- [x] Verify full 3-layer flow.

## Phase 4: Stylize (Refinement & UI)
- [x] Payload Refinement: Ensure JSON output is strictly formatted.
- [x] UI/UX: Refine the `ChatInterface` (Premium Design implemented).
- [x] Feedback: Test the "Copy to Clipboard" and "Markdown Rendering" features.
- [x] Connect Frontend to Backend API.
