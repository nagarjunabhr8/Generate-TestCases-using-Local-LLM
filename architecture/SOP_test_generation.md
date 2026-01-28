# SOP: Test Case Generation

## Goal
Generate structured, deterministic test cases from a user prompt using a local LLM.

## Inputs
- `prompt` (string): The user's description of the feature to test.

## Output
- JSON object containing a list of test cases.
- Save the JSON to `.tmp/` for audit.

## Steps
1. **Validate Input:** Ensure prompt is not empty.
2. **Format Prompt:** Combine System Prompt + User Prompt.
3. **Call Tool:** Execute `tools/generate_test_cases.py` with the formatted prompt.
4. **Validate Output:** Check if the output is valid JSON.
5. **Return Result:** Display or save the final output.

## Error Handling
- If Ollama is down -> Retry once, then Fail.
- If JSON is invalid -> Log error, attempt repair (optional), or Fail.
