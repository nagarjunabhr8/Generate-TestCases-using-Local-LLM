import os
import subprocess
import shutil
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys

# Add parent directory to path to find tools if needed, 
# but we will use subprocess to match main.py pattern.

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In prod, lock this down.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str

@app.post("/generate")
async def generate_test_cases(request: GenerateRequest):
    # Determine absolute paths
    current_dir = os.path.dirname(os.path.abspath(__file__)) # e:\AI Testing\CreateTestCases-AI\backend
    root_dir = os.path.dirname(current_dir) # e:\AI Testing\CreateTestCases-AI
    tool_path = os.path.join(root_dir, "tools", "generate_test_cases.py")
    
    print(f"Calling tool at: {tool_path}")

    try:
        # Check python command
        python_cmd = "python3" if shutil.which("python3") else "python"
        
        result = subprocess.run(
            [python_cmd, tool_path, request.prompt],
            capture_output=True,
            text=True,
            cwd=root_dir # Run from root so tool can find .env and .tmp
        )

        if result.returncode != 0:
            print(f"Tool Error: {result.stderr}")
            raise HTTPException(status_code=500, detail=f"Tool execution failed: {result.stderr}")

        # The tool prints the JSON to stdout
        return {"result": result.stdout}

    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
