"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
    ArrowLeft, Loader2, Video, FileText, FileImage,
    Link2, Frame, ExternalLink, Globe, UserCheck, Play,
    BookOpen, List, ChevronDown, X, CheckCircle
} from "lucide-react";
import { getCourseContent } from "@/lib/services/institute.service";
import type { CourseContent, InstituteCourse } from "@/lib/services/institute.service";
import CourseAgent from "@/components/dashboard/CourseAgent";

const CONTENT_ICONS: Record<string, React.ElementType> = {
    video: Video,
    pdf: FileText,
    document: FileImage,
    link: Link2,
    iframe: Frame,
};

// Detect if a URL can be embedded in an iframe
function isEmbeddable(url: string, type: string): boolean {
    if (type === "iframe") return true;
    if (type === "video") {
        return /youtube\.com|youtu\.be|vimeo\.com|loom\.com/i.test(url);
    }
    return false;
}

// Convert YouTube/Vimeo watch URL → embed URL
function toEmbedUrl(url: string): string {
    const yt = url.match(/(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([^&?]+)/);
    if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
    const vim = url.match(/vimeo\.com\/(\d+)/);
    if (vim) return `https://player.vimeo.com/video/${vim[1]}`;
    return url;
}

export default function StudentCourseContentPage() {
    const { courseId } = useParams() as { courseId: string };
    const router = useRouter();

    const [course, setCourse] = useState<InstituteCourse | null>(null);
    const [content, setContent] = useState<CourseContent[]>([]);
    const [active, setActive] = useState<CourseContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        getCourseContent(courseId)
            .then(res => {
                if (res.success) {
                    setCourse(res.data.course);
                    setContent(res.data.content);
                    if (res.data.content.length > 0) setActive(res.data.content[0]);
                } else {
                    toast.error("Course not accessible");
                    router.push("/student/my-courses");
                }
            })
            .catch(err => {
                const msg = err?.response?.data?.error;
                toast.error(msg || "Failed to load course");
                router.push("/student/my-courses");
            })
            .finally(() => setLoading(false));
    }, [courseId]);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
    );

    if (!course || !active) return null;

    const embeddable = isEmbeddable(active.content_url, active.content_type);
    const embedSrc = toEmbedUrl(active.content_url);
    const Icon = CONTENT_ICONS[active.content_type] || Link2;

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col">
            {/* Top bar */}
            <div className="flex items-center gap-4 px-6 py-3 border-b border-white/10 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
                <Link href="/student/my-courses" className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="min-w-0 flex-1">
                    <h1 className="text-sm font-semibold text-white truncate">{course.title}</h1>
                    <p className="text-xs text-slate-400">{content.length} items</p>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 bg-white/10 rounded-lg text-slate-400 hover:text-white"
                >
                    <List className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Player / Viewer */}
                <div className="flex-1 flex flex-col p-4 lg:p-6 gap-4">
                    {/* Content Title */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-white text-sm">{active.title}</h2>
                            <p className="text-xs text-slate-400 capitalize">{active.content_type}</p>
                        </div>
                        <a
                            href={active.content_url}
                            target="_blank" rel="noopener noreferrer"
                            className="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                        >
                            <ExternalLink className="w-3.5 h-3.5" /> Open
                        </a>
                    </div>

                    {/* Main viewer */}
                    <div className="flex-1 min-h-0 bg-black rounded-2xl overflow-hidden border border-white/10">
                        {embeddable ? (
                            <iframe
                                src={embedSrc}
                                className="w-full h-full min-h-[360px]"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                                title={active.title}
                            />
                        ) : (
                            // Fallback: can't embed → show open-in-tab prompt
                            <div className="flex flex-col items-center justify-center h-full min-h-[360px] text-center px-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                                    <Icon className="w-7 h-7 text-blue-400" />
                                </div>
                                <p className="text-white font-semibold mb-2">{active.title}</p>
                                <p className="text-slate-400 text-sm mb-6 max-w-sm">
                                    This content type cannot be previewed here. Click below to open it in a new tab.
                                </p>
                                <a
                                    href={active.content_url}
                                    target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open in New Tab
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar: content list (Desktop) */}
                <div className="w-72 hidden lg:flex flex-col border-l border-white/10 bg-slate-900/60 overflow-y-auto">
                    <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Course Content</p>
                    </div>
                    <div className="flex-1">
                        {content.map((item) => {
                            const ItemIcon = CONTENT_ICONS[item.content_type] || Link2;
                            const isActive = item.id === active.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActive(item)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left border-b border-white/5 transition-colors ${isActive ? "bg-blue-600/20 border-l-2 border-l-blue-500" : "hover:bg-white/5"
                                        }`}
                                >
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-blue-500/30" : "bg-white/10"}`}>
                                        <ItemIcon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-medium truncate ${isActive ? "text-white" : "text-slate-300"}`}>
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-slate-500 capitalize">{item.content_type}</p>
                                    </div>
                                    {isActive && <Play className="w-3 h-3 text-blue-400 flex-shrink-0" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Mobile Content Overlay / Sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-[60] lg:hidden">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
                        <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <h3 className="font-bold text-white">Course Content</h3>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400"><X className="w-5 h-5" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {content.map((item) => {
                                    const ItemIcon = CONTENT_ICONS[item.content_type] || Link2;
                                    const isActive = item.id === active.id;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setActive(item);
                                                setIsSidebarOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-4 px-5 py-4 text-left border-b border-white/5 transition-colors ${isActive ? "bg-blue-600/30" : "active:bg-white/5"}`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? "bg-blue-500/40" : "bg-white/10"}`}>
                                                <ItemIcon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium truncate ${isActive ? "text-white" : "text-slate-200"}`}>{item.title}</p>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">{item.content_type}</p>
                                            </div>
                                            {isActive && <CheckCircle className="w-4 h-4 text-green-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Course Agent */}
            <CourseAgent />
        </div>
    );
}
