
import sys
import subprocess
import json
import os

def load_sop(sop_path):
    if not os.path.exists(sop_path):
        print(f"Error: SOP not found at {sop_path}")
        sys.exit(1)
    print(f"✅ Loaded SOP: {sop_path}")

def run_layer_3_tool(tool_path, *args):
    print(f"⚙️ Executing Tool: {tool_path}")
    cmd = ["python", tool_path] + list(args)
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"❌ Tool Failed:\n{result.stderr}")
        return None
    
    return result.stdout

def main():
    print("🚀 Initializing B.L.A.S.T. Layer 2 (Navigation)...")
    
    # Step 1: Read SOP
    load_sop("architecture/SOP_test_generation.md")
    
    # Step 2: Get Input
    try:
        user_input = input("Enter your test requirement: ")
        if not user_input.strip():
            print("Input cannot be empty.")
            return
    except KeyboardInterrupt:
        return

    # Step 3: Route to Tool
    tool_output = run_layer_3_tool("tools/generate_test_cases.py", user_input)
    
    if tool_output:
        print("\n🎉 Result:")
        print(tool_output)

if __name__ == "__main__":
    main()
