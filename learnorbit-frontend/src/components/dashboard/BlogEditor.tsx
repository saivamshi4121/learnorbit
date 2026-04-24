"use client";

import { useState, useRef } from "react";
import { 
    Bold, Italic, Heading1, Heading2, Code, 
    Link as LinkIcon, Image as ImageIcon, Eye, 
    Edit3, Sparkles, HelpCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BlogEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export function BlogEditor({ content, onChange }: BlogEditorProps) {
    const [view, setView] = useState<"edit" | "preview">("edit");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const insertText = (before: string, after: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const newText = 
            content.substring(0, start) + 
            before + selectedText + after + 
            content.substring(end);
        
        onChange(newText);
        
        // Focus back and set selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + before.length,
                end + before.length
            );
        }, 0);
    };

    const tools = [
        { icon: Heading1, label: "H1", action: () => insertText("# ", "") },
        { icon: Heading2, label: "H2", action: () => insertText("## ", "") },
        { icon: Bold, label: "Bold", action: () => insertText("**", "**") },
        { icon: Italic, label: "Italic", action: () => insertText("_", "_") },
        { icon: LinkIcon, label: "Link", action: () => insertText("[", "](url)") },
        { icon: ImageIcon, label: "Image", action: () => insertText("![alt text](", ")") },
        { icon: Code, label: "Code", action: () => insertText("```\n", "\n```") },
    ];

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const charCount = content.length;

    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
            {/* Editor Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-slate-200 bg-white">
                <div className="flex items-center gap-1">
                    <div className="flex items-center bg-slate-100 p-1 rounded-xl mr-2">
                        <button
                            type="button"
                            onClick={() => setView("edit")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                view === "edit" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                            type="button"
                            onClick={() => setView("preview")}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                view === "preview" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                    </div>

                    <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

                    <div className="flex items-center gap-0.5">
                        {tools.map((tool, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={tool.action}
                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title={tool.label}
                            >
                                <tool.icon className="w-4 h-4" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
                    >
                        <Sparkles className="w-3.5 h-3.5" /> AI Assist
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    {view === "edit" ? (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full"
                        >
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => onChange(e.target.value)}
                                className="w-full h-full min-h-[400px] p-6 bg-white outline-none font-mono text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 resize-y"
                                placeholder="Start writing your masterpiece in Markdown..."
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-8 bg-white min-h-[400px] prose prose-slate max-w-none prose-headings:font-black prose-a:text-blue-600"
                        >
                            {content ? (
                                <div className="whitespace-pre-wrap font-serif leading-relaxed text-slate-800">
                                    {content}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[300px] text-slate-400 italic">
                                    <HelpCircle className="w-8 h-8 mb-2 opacity-20" />
                                    Nothing to preview yet...
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer / Stats */}
            <div className="flex items-center justify-between px-6 py-2 bg-white border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span>{wordCount} Words</span>
                    <span>{charCount} Characters</span>
                </div>
                <div className="flex items-center gap-1 text-blue-500">
                    <Sparkles className="w-3 h-3" />
                    Markdown Supported
                </div>
            </div>
        </div>
    );
}
