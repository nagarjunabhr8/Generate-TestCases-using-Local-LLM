
export interface TestCase {
    id: string;
    title: string;
    preconditions: string[];
    steps: string[];
    expected_result: string;
    priority: "High" | "Medium" | "Low";
    type: "Positive" | "Negative" | "Edge Case";
}

export interface TestCasesResponse {
    testCases: TestCase[];
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
}
