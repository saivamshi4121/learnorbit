"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Sparkles,
    ChevronDown,
    Loader2,
} from "lucide-react";
import { api } from "@/lib/api";

// ─── Types ─────────────────────────────────────────

interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
    suggestions?: string[];
    sources?: { id: number; title: string }[];
}

// ─── Markdown-like rendering ───────────────────────

function renderMarkdown(text: string) {
    // Split into lines and process
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
        let processed: React.ReactNode = line;

        // Bold: **text**
        if (line.includes("**")) {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            processed = (
                <span key={`line-${i}`}>
                    {parts.map((part, j) =>
                        j % 2 === 1 ? (
                            <strong key={j} className="font-semibold text-slate-900">
                                {part}
                            </strong>
                        ) : (
                            <span key={j}>{part}</span>
                        )
                    )}
                </span>
            );
        }

        // Italic: _text_
        if (typeof processed === "string" && processed.includes("_")) {
            const parts = processed.split(/_(.*?)_/g);
            processed = (
                <span key={`line-i-${i}`}>
                    {parts.map((part, j) =>
                        j % 2 === 1 ? (
                            <em key={j} className="italic text-slate-500">
                                {part}
                            </em>
                        ) : (
                            <span key={j}>{part}</span>
                        )
                    )}
                </span>
            );
        }

        if (line.trim() === "") {
            elements.push(<br key={`br-${i}`} />);
        } else {
            elements.push(
                <div key={`p-${i}`} className="leading-relaxed">
                    {processed}
                </div>
            );
        }
    });

    return elements;
}

// ─── Main Component ─────────────────────────────────

export default function CourseAgent() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollBtn, setShowScrollBtn] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Welcome message on first open
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: "welcome",
                    role: "assistant",
                    content:
                        "👋 **Hi there!** I'm your LearnOrbit Assistant.\n\nI can help you explore courses, check lessons, view your enrollments, and more.\n\nWhat would you like to know?",
                    timestamp: new Date(),
                    suggestions: [
                        "Show all courses",
                        "How to enroll",
                        "My enrollments",
                    ],
                },
            ]);
        }
    }, [isOpen, messages.length]);

    // Auto-scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    // Detect scroll position
    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } =
            messagesContainerRef.current;
        setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
    };

    // ─── Send Message ────────────────────────────────

    const sendMessage = async (text?: string) => {
        const question = (text || input).trim();
        if (!question || isLoading) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            content: question,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await api.post("/agent/chat", { question });
            const data = res.data?.data || res.data;

            const assistantMsg: ChatMessage = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: data.answer || "I couldn't process that. Try asking differently!",
                timestamp: new Date(),
                suggestions: data.suggestions || [],
                sources: data.sources || [],
            };

            setMessages((prev) => [...prev, assistantMsg]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `error-${Date.now()}`,
                    role: "assistant",
                    content:
                        "⚠️ Sorry, I couldn't reach the server. Please make sure the backend is running and try again.",
                    timestamp: new Date(),
                    suggestions: ["Help"],
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // ─── Render ──────────────────────────────────────

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        id="agent-toggle-btn"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
                        aria-label="Open course assistant"
                    >
                        <MessageCircle className="w-6 h-6" />
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] max-h-[85vh] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl shadow-black/15 border border-slate-200/80 flex flex-col overflow-hidden"
                    >
                        {/* ──── Header ──── */}
                        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold leading-tight">
                                        LearnOrbit Assistant
                                    </h3>
                                    <p className="text-[11px] text-blue-200/90 leading-tight mt-0.5">
                                        Ask about courses, lessons & more
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ──── Messages ──── */}
                        <div
                            ref={messagesContainerRef}
                            onScroll={handleScroll}
                            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50 scrollbar-hide"
                        >
                            {messages.map((msg) => (
                                <div key={msg.id}>
                                    {/* Message bubble */}
                                    <div
                                        className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                            }`}
                                    >
                                        {/* Avatar */}
                                        <div
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === "assistant"
                                                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                                                    : "bg-slate-200 text-slate-600"
                                                }`}
                                        >
                                            {msg.role === "assistant" ? (
                                                <Bot className="w-4 h-4" />
                                            ) : (
                                                <User className="w-4 h-4" />
                                            )}
                                        </div>

                                        {/* Bubble */}
                                        <div
                                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${msg.role === "user"
                                                    ? "bg-blue-600 text-white rounded-br-md"
                                                    : "bg-white text-slate-700 border border-slate-200/80 shadow-sm rounded-bl-md"
                                                }`}
                                        >
                                            {msg.role === "assistant"
                                                ? renderMarkdown(msg.content)
                                                : msg.content}
                                        </div>
                                    </div>

                                    {/* Suggestions */}
                                    {msg.role === "assistant" &&
                                        msg.suggestions &&
                                        msg.suggestions.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2.5 ml-9">
                                                {msg.suggestions.map((s, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => sendMessage(s)}
                                                        disabled={isLoading}
                                                        className="text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 hover:bg-blue-100 hover:border-blue-300 transition-all font-medium disabled:opacity-50"
                                                    >
                                                        {s}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span className="text-xs">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Scroll to bottom button */}
                        <AnimatePresence>
                            {showScrollBtn && (
                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    onClick={scrollToBottom}
                                    className="absolute bottom-20 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors z-10"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* ──── Input ──── */}
                        <div className="border-t border-slate-200/80 bg-white px-4 py-3 flex-shrink-0">
                            <div className="flex items-center gap-2 bg-slate-100/80 rounded-xl px-3 py-1 border border-slate-200/50 focus-within:border-blue-400 focus-within:bg-white transition-all">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about courses..."
                                    disabled={isLoading}
                                    className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none py-2 disabled:opacity-60"
                                />
                                <button
                                    onClick={() => sendMessage()}
                                    disabled={!input.trim() || isLoading}
                                    className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 transition-all flex-shrink-0"
                                    aria-label="Send message"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-400 text-center mt-2">
                                LearnOrbit AI Assistant · Course information may vary
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
