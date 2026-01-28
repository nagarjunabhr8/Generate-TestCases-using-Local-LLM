
import requests
import json
import os
import sys
import argparse
from datetime import datetime
from dotenv import load_dotenv

# Load env
load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")
MODEL = os.getenv("MODEL", "llama3.2")

SYSTEM_PROMPT = """You are an expert QA Automation Engineer.
Your task is to generate detailed test cases based on the user's requirement.
Output MUST be a strictly valid JSON object with the following structure:
{
  "testCases": [
    {
      "id": "TC_{number}",
      "title": "{action} should {expected_result} when {condition}",
      "preconditions": ["List of preconditions"],
      "steps": ["Step 1", "Step 2"],
      "expected_result": "Outcome",
      "priority": "High|Medium|Low",
      "type": "Positive|Negative"
    }
  ]
}
Ensure the JSON is valid. Do not include any explanations or text outside the JSON object."""

def generate_test_cases(prompt):
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": prompt}
    ]
    
    payload = {
        "model": MODEL,
        "messages": messages,
        "stream": False,
        "format": "json"
    }
    
    try:
        response = requests.post(OLLAMA_URL, json=payload)
        response.raise_for_status()
        data = response.json()
        content = data.get("message", {}).get("content", "{}")
        
        # Parse to verify JSON
        json_content = json.loads(content)
        
        # Save to .tmp (Self-Healing/Audit)
        tmp_dir = os.path.join(os.getcwd(), '.tmp')
        os.makedirs(tmp_dir, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filepath = os.path.join(tmp_dir, f"test_cases_{timestamp}.json")
        
        with open(filepath, 'w') as f:
            json.dump(json_content, f, indent=2)
            
        print(json.dumps(json_content, indent=2))
        return filepath
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("prompt", help="User prompt for test case generation")
    args = parser.parse_args()
    generate_test_cases(args.prompt)
