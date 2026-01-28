
import requests
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/chat")
MODEL = os.getenv("MODEL", "llama3.2")

def check_ollama():
    url = OLLAMA_URL
    
    # Determine if we are using chat or generate endpoint to format payload
    if "/api/chat" in url:
        payload = {
            "model": MODEL,
            "messages": [{"role": "user", "content": "Hello via Python!"}],
            "stream": False
        }
    else:
        payload = {
            "model": MODEL,
            "prompt": "Hello via Python!",
            "stream": False
        }
    
    print(f"Connecting to Ollama at {url} with model {MODEL}...")
    
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        
        data = response.json()
        print("✅ Connection Successful!")
        
        if "/api/chat" in url:
            content = data.get("message", {}).get("content", "No content found")
            print(f"Response: {content}")
        else:
            print(f"Response: {data.get('response', 'No response field')}")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    check_ollama()
