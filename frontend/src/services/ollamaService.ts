
import type { ChatMessage } from '../types';

const API_URL = 'http://localhost:8000/generate';

export const generateTestCases = async (userInput: string, history: ChatMessage[] = []): Promise<string> => {
    // We don't need to pass history/system prompt here because the backend tool handles it (it's stateless in the tool currently)
    // Or if the tool supported it, we would pass it. 
    // The current tool `generate_test_cases.py` only accepts a prompt CLI arg.
    // So we just pass the user input.

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: userInput
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error("Failed to generate test cases:", error);
        throw error;
    }
};
