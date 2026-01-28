
import { fetch } from 'undici'; // Use global fetch if Node 18+, else undici or node-fetch
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/chat';
const MODEL = process.env.MODEL || 'llama3.2';

const SYSTEM_PROMPT = `You are an expert QA Automation Engineer.
Your task is to generate detailed test cases based on the user's requirement.
Output MUST be a strictly valid JSON object.`;

async function generate(userInput) {
    const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userInput }
    ];

    try {
        console.log(`Sending request to ${OLLAMA_URL} with model ${MODEL}...`);
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL,
                messages: messages,
                stream: false,
                format: 'json'
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.message.content;
    } catch (error) {
        console.error("Failed to generate test cases:", error.message);
        process.exit(1);
    }
}

// CLI Execution
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Usage: node tools/generate_test_cases.js \"<prompt>\"");
    process.exit(0);
}

const prompt = args[0];
generate(prompt).then(output => {
    console.log("\nGenerated Test Cases:");
    console.log(output);

    // Save to .tmp as per Layer 3 protocol
    const tmpDir = path.join(process.cwd(), '.tmp');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const filename = path.join(tmpDir, `test_cases_${Date.now()}.json`);
    fs.writeFileSync(filename, output);
    console.log(`\nSaved to ${filename}`);
});
