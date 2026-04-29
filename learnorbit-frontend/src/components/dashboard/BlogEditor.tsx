"use client";

import { useRef, useState, useCallback } from "react";
import {
    Bold, Italic, Heading1, Heading2, Heading3, Code,
    Link as LinkIcon, Image as ImageIcon, Eye,
    Edit3, Sparkles, HelpCircle, Quote, List,
    ListOrdered, Minus, Strikethrough
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from "marked";

interface BlogEditorProps {
    content: string;
    onChange: (content: string) => void;
}

// Configure marked for safe rendering
marked.setOptions({ breaks: true, gfm: true });

export function BlogEditor({ content, onChange }: BlogEditorProps) {
    const [view, setView] = useState<"edit" | "preview">("edit");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    /**
     * Core insertion engine.
     * Reads selection DIRECTLY from the DOM (not from React state) so
     * there is no async race — works perfectly on every click.
     */
    const insertMarkdown = useCallback(
        (before: string, after: string = "", defaultText: string = "") => {
            const ta = textareaRef.current;
            if (!ta) return;

            const start = ta.selectionStart;
            const end = ta.selectionEnd;
            const selected = ta.value.substring(start, end) || defaultText;

            const newValue =
                ta.value.substring(0, start) +
                before +
                selected +
                after +
                ta.value.substring(end);

            // Update React state
            onChange(newValue);

            // Restore focus + selection after React re-renders
            requestAnimationFrame(() => {
                ta.focus();
                const cursor = start + before.length;
                ta.setSelectionRange(cursor, cursor + selected.length);
            });
        },
        [onChange]
    );

    /** Insert a line-level prefix (headings, blockquote, list items) */
    const insertLinePrefix = useCallback(
        (prefix: string) => {
            const ta = textareaRef.current;
            if (!ta) return;

            const start = ta.selectionStart;
            const lineStart = ta.value.lastIndexOf("\n", start - 1) + 1;
            const before = ta.value.substring(0, lineStart);
            const after = ta.value.substring(lineStart);

            const newValue = before + prefix + after;
            onChange(newValue);

            requestAnimationFrame(() => {
                ta.focus();
                const newPos = lineStart + prefix.length + (start - lineStart);
                ta.setSelectionRange(newPos, newPos);
            });
        },
        [onChange]
    );

    const tools: {
        icon: React.ElementType;
        label: string;
        action: () => void;
        separator?: boolean;
    }[] = [
        {
            icon: Heading1,
            label: "Heading 1",
            action: () => insertLinePrefix("# "),
        },
        {
            icon: Heading2,
            label: "Heading 2",
            action: () => insertLinePrefix("## "),
        },
        {
            icon: Heading3,
            label: "Heading 3",
            action: () => insertLinePrefix("### "),
            separator: true,
        },
        {
            icon: Bold,
            label: "Bold (Ctrl+B)",
            action: () => insertMarkdown("**", "**", "bold text"),
        },
        {
            icon: Italic,
            label: "Italic (Ctrl+I)",
            action: () => insertMarkdown("_", "_", "italic text"),
        },
        {
            icon: Strikethrough,
            label: "Strikethrough",
            action: () => insertMarkdown("~~", "~~", "strikethrough"),
            separator: true,
        },
        {
            icon: Quote,
            label: "Blockquote",
            action: () => insertLinePrefix("> "),
        },
        {
            icon: List,
            label: "Bullet List",
            action: () => insertLinePrefix("- "),
        },
        {
            icon: ListOrdered,
            label: "Numbered List",
            action: () => insertLinePrefix("1. "),
            separator: true,
        },
        {
            icon: Code,
            label: "Code Block",
            action: () => insertMarkdown("```\n", "\n```", "code here"),
        },
        {
            icon: LinkIcon,
            label: "Link",
            action: () => insertMarkdown("[", "](https://)", "link text"),
        },
        {
            icon: ImageIcon,
            label: "Image",
            action: () =>
                insertMarkdown("![", "](https://)", "alt text"),
        },
        {
            icon: Minus,
            label: "Horizontal Rule",
            action: () => insertMarkdown("\n---\n", "", ""),
        },
    ];

    /** Keyboard shortcuts */
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "b") {
                e.preventDefault();
                insertMarkdown("**", "**", "bold text");
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "i") {
                e.preventDefault();
                insertMarkdown("_", "_", "italic text");
            }
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                insertMarkdown("[", "](https://)", "link text");
            }
            // Auto-indent on Enter inside lists
            if (e.key === "Enter") {
                const ta = textareaRef.current!;
                const pos = ta.selectionStart;
                const lineStart = ta.value.lastIndexOf("\n", pos - 1) + 1;
                const currentLine = ta.value.substring(lineStart, pos);
                const listMatch = currentLine.match(/^(\s*[-*+] |\s*\d+\. )/);
                if (listMatch) {
                    e.preventDefault();
                    insertMarkdown("\n" + listMatch[0], "", "");
                }
            }
        },
        [insertMarkdown]
    );

    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const charCount = content.length;

    const renderedHTML = content
        ? (marked(content) as string)
        : "";

    return (
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            {/* ── Toolbar ── */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50">
                {/* View toggle */}
                <div className="flex items-center bg-white border border-slate-200 p-0.5 rounded-xl mr-1 shadow-sm">
                    <button
                        type="button"
                        onClick={() => setView("edit")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                            view === "edit"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        <Edit3 className="w-3.5 h-3.5" /> Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setView("preview")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all ${
                            view === "preview"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        <Eye className="w-3.5 h-3.5" /> Preview
                    </button>
                </div>

                {/* Format tools */}
                <div className="flex items-center gap-0.5 flex-wrap">
                    {tools.map((tool, idx) => (
                        <span key={idx} className="flex items-center">
                            {tool.separator && (
                                <span className="w-px h-5 bg-slate-200 mx-1" />
                            )}
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    // Prevent textarea losing focus before action fires
                                    e.preventDefault();
                                    tool.action();
                                }}
                                title={tool.label}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90"
                            >
                                <tool.icon className="w-4 h-4" />
                            </button>
                        </span>
                    ))}
                </div>

                {/* AI Assist badge */}
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95 ml-auto"
                >
                    <Sparkles className="w-3.5 h-3.5" /> AI Assist
                </button>
            </div>

            {/* ── Editor / Preview area ── */}
            <div className="relative min-h-[440px]">
                <AnimatePresence mode="wait">
                    {view === "edit" ? (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="h-full"
                        >
                            <textarea
                                ref={textareaRef}
                                value={content}
                                onChange={(e) => onChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full min-h-[440px] p-6 bg-white outline-none font-mono text-sm leading-7 text-slate-800 placeholder:text-slate-400 resize-y"
                                placeholder={`Start writing in Markdown…\n\n# Heading 1\n## Heading 2\n**bold**  _italic_  ~~strikethrough~~\n- bullet list\n1. numbered list\n> blockquote\n\`\`\`code block\`\`\``}
                                spellCheck
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="p-8 bg-white min-h-[440px]"
                        >
                            {renderedHTML ? (
                                <div
                                    className="prose prose-slate prose-lg max-w-none
                                        prose-headings:font-black prose-headings:tracking-tight
                                        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                        prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
                                        prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-xl
                                        prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:rounded-r-xl prose-blockquote:not-italic
                                        prose-img:rounded-xl prose-img:shadow-md"
                                    dangerouslySetInnerHTML={{ __html: renderedHTML }}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[300px] text-slate-400 gap-3">
                                    <HelpCircle className="w-10 h-10 opacity-20" />
                                    <p className="text-sm italic">Nothing to preview yet…</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Footer stats ── */}
            <div className="flex items-center justify-between px-6 py-2 bg-slate-50 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-4">
                    <span>{wordCount} Words</span>
                    <span>{charCount} Characters</span>
                </div>
                <div className="flex items-center gap-1 text-blue-500">
                    <Sparkles className="w-3 h-3" />
                    Markdown · Ctrl+B Bold · Ctrl+I Italic · Ctrl+K Link
                </div>
            </div>
        </div>
    );
}
