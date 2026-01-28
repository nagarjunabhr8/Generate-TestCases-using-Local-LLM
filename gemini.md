# Project Constitution

## Data Schemas

### 1. Test Case Template (Internal)
```json
{
  "id": "TC_{number}",
  "title": "{action} should {expected_result} when {condition}",
  "preconditions": ["List of preconditions"],
  "steps": ["Step 1", "Step 2", "Step 3"],
  "expected_result": "Description of the expected outcome",
  "priority": "High|Medium|Low",
  "type": "Positive|Negative|Edge Case"
}
```

### 2. Application State
```typescript
interface AppState {
  chatHistory: Message[];
  isLoading: boolean;
  selectedModel: string; // Default: llama3.2
  template: string; // The system prompt/template used for generation
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string; // Markdown or JSON string
  timestamp: number;
}
```

### 3. Ollama Payload
```json
{
  "model": "llama3.2",
  "messages": [
    {
      "role": "system",
      "content": "You are a QA Specialist. Generate test cases in the following JSON format: ..."
    },
    {
      "role": "user",
      "content": "{user_input}"
    }
  ],
  "stream": false,
  "format": "json" // Valid for new Ollama versions
}
```

## Behavioral Rules
1. **Reliability First**: Prioritize deterministic and self-healing automation.
2. **Local Execution**: Rely on local Ollama instance.

## Architectural Invariants
*(To be defined)*
