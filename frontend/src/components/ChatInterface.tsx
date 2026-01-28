
import React, { useState, useRef, useEffect } from 'react';
import { generateTestCases } from '../services/ollamaService';
import type { ChatMessage } from '../types';
import { TestCaseList } from './TestCaseList';
import ReactMarkdown from 'react-markdown';
import { Send, Copy, Bot, User, Loader2, RefreshCw, Check } from 'lucide-react';

const CopyButton = ({ content }: { content: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1.5"
            title="Copy Content"
        >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied && <span className="text-xs font-medium text-emerald-400">Copied!</span>}
        </button>
    );
};

export const ChatInterface: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const responseContent = await generateTestCases(input, messages);

            const aiMessage: ChatMessage = {
                role: 'assistant',
                content: responseContent,
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: 'system',
                content: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-5xl mx-auto p-4 md:p-6 font-sans">
            <header className="mb-8 text-center relative z-10">
                <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10" />
                <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-tight">
                    TestGen AI
                </h1>
                <p className="text-slate-400 mt-2 text-lg font-medium flex items-center justify-center gap-2">
                    <Bot className="w-5 h-5 text-blue-400" />
                    Powered by Local Llama 3.2
                </p>
            </header>

            <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-4 opacity-50">
                        <RefreshCw className="w-16 h-16 mb-4 animate-spin-slow" />
                        <p className="text-2xl font-semibold">Ready to Generate</p>
                        <p className="text-slate-400 max-w-md">
                            Describe a feature (e.g., "Login Page", "Checkout Flow") and I will generate structured test cases for you.
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                    >
                        <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : msg.role === 'system' ? 'bg-red-500' : 'bg-indigo-600'
                                }`}>
                                {msg.role === 'user' ? <User className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
                            </div>

                            <div
                                className={`relative rounded-3xl p-6 shadow-xl backdrop-blur-md border ${msg.role === 'user'
                                    ? 'bg-blue-600/20 border-blue-500/30 text-blue-50 rounded-tr-none'
                                    : msg.role === 'system'
                                        ? 'bg-red-500/10 border-red-500/30 text-red-200'
                                        : 'bg-slate-800/80 border-slate-700 text-slate-200 rounded-tl-none'
                                    }`}
                            >
                                {msg.role === 'assistant' && (
                                    <CopyButton content={msg.content} />
                                )}

                                <div className="prose prose-invert prose-sm max-w-none w-full">
                                    {msg.role === 'assistant' ? (
                                        (() => {
                                            try {
                                                // Try to parse the content as JSON
                                                // Sometimes regex might be needed if there is leading/trailing text, 
                                                // but our backend tries to output strict JSON.
                                                // Let's attempt to find the first '{' and last '}'
                                                const jsonStart = msg.content.indexOf('{');
                                                const jsonEnd = msg.content.lastIndexOf('}');

                                                if (jsonStart !== -1 && jsonEnd !== -1) {
                                                    const jsonStr = msg.content.substring(jsonStart, jsonEnd + 1);
                                                    const data = JSON.parse(jsonStr);

                                                    // Check if it matches our schema roughly
                                                    if (data.testCases && Array.isArray(data.testCases)) {
                                                        return <TestCaseList data={data} />;
                                                    }
                                                }
                                                throw new Error("Not valid test case JSON");
                                            } catch (e) {
                                                // Fallback to Markdown
                                                return (
                                                    <ReactMarkdown
                                                        components={{
                                                            pre: ({ node, ...props }) => {
                                                                return <pre className="overflow-auto bg-slate-950/50 p-4 rounded-xl border border-slate-800 my-2" {...props as any} />
                                                            },
                                                            code: ({ node, ...props }) => <code className="font-mono text-cyan-300" {...props} />
                                                        }}
                                                    >
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                );
                                            }
                                        })()
                                    ) : (
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    )}
                                </div>

                                <div className="text-[10px] opacity-40 mt-3 font-mono text-right uppercase tracking-widest">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-slate-800/50 rounded-2xl p-4 rounded-tl-none border border-slate-700 flex items-center gap-3">
                            <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                            <span className="text-sm text-slate-400 animate-pulse">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe the feature you want to test..."
                        className="flex-1 bg-transparent py-4 px-6 text-white placeholder-slate-500 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="p-4 bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
                    >
                        <Send className={`w-5 h-5 ${isLoading ? 'opacity-0' : 'opacity-100'}`} />
                        {isLoading && <Loader2 className="w-5 h-5 absolute inset-0 m-auto animate-spin" />}
                    </button>
                </div>
            </form>
        </div>
    );
};
