
// No imports needed for Node 18+ (fetch is global)
// If on older node, we might fail, but let's assume recent environment.

async function checkOllama() {
    const url = 'http://localhost:11434/api/chat';
    const payload = {
        model: 'llama3.2',
        messages: [{ role: 'user', content: 'Hello, verify connection.' }],
        stream: false
    };

    try {
        console.log(`Connecting to Ollama at ${url}...`);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Connection Successful!');
        console.log('Response:', data.message.content);
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
        // process.exit(1); 
        // Don't exit with error code yet, just log it. 
        // If it fails, we might need to verify if Ollama is actually running or if model is pulled.
    }
}

checkOllama();
