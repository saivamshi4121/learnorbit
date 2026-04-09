"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
    ArrowLeft, Plus, Trash2, GripVertical, ExternalLink,
    Globe, Lock, UserCheck, Loader2, Save, Link2,
    FileText, Video, FileImage, Frame, UserPlus, X, Mail
} from "lucide-react";
import {
    listContent, addContent, deleteContent,
    listCourseAccess, grantAccess, revokeAccess,
    updateCourse,
} from "@/lib/services/institute.service";
import type { CourseContent, CourseAccess } from "@/lib/services/institute.service";
import { get } from "@/lib/api";

const CONTENT_TYPE_ICONS: Record<string, React.ElementType> = {
    video: Video,
    pdf: FileText,
    document: FileImage,
    link: Link2,
    iframe: Frame,
};

const VISIBILITY_OPTIONS = [
    { value: "private", icon: Lock, label: "Private", cls: "text-slate-600", activeBg: "bg-slate-100 border-slate-400" },
    { value: "public", icon: Globe, label: "Public", cls: "text-emerald-600", activeBg: "bg-emerald-50 border-emerald-500" },
    { value: "selected", icon: UserCheck, label: "Selected Only", cls: "text-blue-600", activeBg: "bg-blue-50 border-blue-500" },
];

export default function EditCoursePage() {
    const { courseId } = useParams() as { courseId: string };
    const router = useRouter();

    // Course state
    const [course, setCourse] = useState<any | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDesc] = useState("");
    const [visibility, setVisibility] = useState("private");
    const [saving, setSaving] = useState(false);

    // Content state
    const [contents, setContents] = useState<CourseContent[]>([]);
    const [showAddContent, setShowAdd] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState("video");
    const [newUrl, setNewUrl] = useState("");
    const [addingContent, setAddingContent] = useState(false);

    // Access state
    const [accessList, setAccessList] = useState<CourseAccess[]>([]);
    const [inviteInput, setInviteInput] = useState("");
    const [inviting, setInviting] = useState(false);
    const [tab, setTab] = useState<"content" | "access">("content");

    useEffect(() => {
        if (!courseId) return;
        Promise.all([
            get<any>(`/institute/courses/${courseId}/content`),
            get<any>(`/institute/courses/${courseId}/access`),
            get<any>(`/institute/courses`),
        ]).then(([cRes, aRes, coursesRes]) => {
            if (cRes.success) setContents(cRes.data);
            if (aRes.success) setAccessList(aRes.data);
            if (coursesRes.success) {
                const c = coursesRes.data.find((x: any) => x.id === courseId);
                if (c) { setCourse(c); setTitle(c.title); setDesc(c.description || ""); setVisibility(c.visibility_type); }
            }
        }).catch(() => toast.error("Failed to load course"));
    }, [courseId]);

    // ── Save course details ──────────────────────────────────────
    const handleSave = async () => {
        setSaving(true);
        try {
            await updateCourse(courseId, { title, description: description || undefined, visibility_type: visibility as any });
            toast.success("Course updated");
        } catch { toast.error("Failed to update"); }
        finally { setSaving(false); }
    };

    // ── Add content ──────────────────────────────────────────────
    const handleAddContent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newUrl.trim()) return;
        setAddingContent(true);
        try {
            const res = await addContent(courseId, {
                title: newTitle.trim(),
                content_type: newType,
                content_url: newUrl.trim(),
                order_index: contents.length,
            });
            if (res.success) {
                setContents(prev => [...prev, res.data]);
                setNewTitle(""); setNewUrl(""); setNewType("video"); setShowAdd(false);
                toast.success("Content added");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Invalid URL or input");
        } finally { setAddingContent(false); }
    };

    const handleDeleteContent = async (id: string) => {
        if (!confirm("Remove this content item?")) return;
        try {
            await deleteContent(courseId, id);
            setContents(prev => prev.filter(c => c.id !== id));
            toast.success("Content removed");
        } catch { toast.error("Failed to remove"); }
    };

    // ── Access / Invitations ─────────────────────────────────────
    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteInput.trim()) return;
        setInviting(true);
        try {
            // Detect if it's an email or user ID
            const isEmail = inviteInput.includes("@");
            const payload = isEmail ? { email: inviteInput.trim() } : { student_id: Number(inviteInput.trim()) };
            const res = await grantAccess(courseId, payload);
            if (res.success) {
                setAccessList(prev => [...prev, res.data]);
                setInviteInput("");
                toast.success(isEmail ? "Invitation sent" : "Access granted");
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Failed to grant access");
        } finally { setInviting(false); }
    };

    const handleRevoke = async (studentId: number, name: string) => {
        if (!confirm(`Revoke access for ${name}?`)) return;
        try {
            await revokeAccess(courseId, studentId);
            setAccessList(prev => prev.map(a => a.student_id === studentId ? { ...a, access_status: "revoked" } : a));
            toast.success("Access revoked");
        } catch { toast.error("Failed to revoke"); }
    };

    if (!course) return (
        <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/institute/courses" className="p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-slate-900 truncate">{course.title}</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Manage content & student access</p>
                    </div>
                </div>

                {/* Course Settings */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-5">
                    <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Course Settings</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Title</label>
                            <input
                                value={title} onChange={e => setTitle(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50 focus:bg-white transition-all"
                            />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Description</label>
                            <textarea
                                value={description} onChange={e => setDesc(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50 focus:bg-white transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Visibility selector */}
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-2">Visibility</label>
                        <div className="flex flex-wrap gap-2">
                            {VISIBILITY_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setVisibility(opt.value)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${visibility === opt.value ? `${opt.activeBg} ${opt.cls}` : "border-slate-200 text-slate-500 hover:border-slate-300"
                                        }`}
                                >
                                    <opt.icon className="w-4 h-4" />
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSave} disabled={saving}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/25 transition-all"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                    {(["content", "access"] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            {t === "content" ? `Content (${contents.length})` : `Access (${accessList.filter(a => a.access_status === "active").length})`}
                        </button>
                    ))}
                </div>

                {/* ── CONTENT TAB ─────────────────────────────────────── */}
                {tab === "content" && (
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <span className="font-semibold text-slate-900 text-sm">Course Content</span>
                            <button
                                onClick={() => setShowAdd(!showAddContent)}
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Content
                            </button>
                        </div>

                        {/* Add Content Form */}
                        {showAddContent && (
                            <form onSubmit={handleAddContent} className="px-6 py-4 bg-slate-50 border-b border-slate-100 space-y-3">
                                <div className="grid sm:grid-cols-3 gap-3">
                                    <input
                                        value={newTitle} onChange={e => setNewTitle(e.target.value)}
                                        placeholder="Content title"
                                        required
                                        className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                    />
                                    <select
                                        value={newType} onChange={e => setNewType(e.target.value)}
                                        className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
                                    >
                                        <option value="video">Video</option>
                                        <option value="pdf">PDF</option>
                                        <option value="document">Document</option>
                                        <option value="link">External Link</option>
                                        <option value="iframe">Embed (iframe)</option>
                                    </select>
                                    <input
                                        value={newUrl} onChange={e => setNewUrl(e.target.value)}
                                        placeholder="https://..."
                                        required type="url"
                                        className="px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                    />
                                </div>
                                <p className="text-xs text-slate-400">Any http/https URL is accepted — YouTube, Vimeo, Google Drive, Loom, PDFs, etc.</p>
                                <div className="flex gap-2">
                                    <button
                                        type="submit" disabled={addingContent}
                                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
                                    >
                                        {addingContent && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                        Add
                                    </button>
                                    <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Content List */}
                        {contents.length === 0 ? (
                            <div className="px-6 py-12 text-center text-slate-400 text-sm">
                                No content yet. Add your first content item above.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {contents.map((item, idx) => {
                                    const Icon = CONTENT_TYPE_ICONS[item.content_type] || Link2;
                                    return (
                                        <div key={item.id} className="flex items-center gap-4 px-6 py-3.5 group hover:bg-slate-50 transition-colors">
                                            <span className="text-slate-300 cursor-grab"><GripVertical className="w-4 h-4" /></span>
                                            <span className="text-xs text-slate-400 w-5 text-center font-mono">{idx + 1}</span>
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                                                <p className="text-xs text-slate-400 truncate">{item.content_url}</p>
                                            </div>
                                            <span className="text-xs text-slate-400 uppercase tracking-wide font-medium hidden sm:block">{item.content_type}</span>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <a href={item.content_url} target="_blank" rel="noopener noreferrer"
                                                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors">
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                                <button onClick={() => handleDeleteContent(item.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── ACCESS TAB ──────────────────────────────────────── */}
                {tab === "access" && (
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <p className="font-semibold text-slate-900 text-sm">Student Access</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                {visibility === "public" ? "All institute students can access – no individual grants needed."
                                    : "Grant access by student ID or invite via email. Pending invites activate on registration."}
                            </p>
                        </div>

                        {/* Invite form */}
                        {visibility === "selected" && (
                            <form onSubmit={handleInvite} className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                                <div className="flex gap-3">
                                    <div className="flex-1 relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                        <input
                                            value={inviteInput}
                                            onChange={e => setInviteInput(e.target.value)}
                                            placeholder="Email address or Student ID"
                                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                                        />
                                    </div>
                                    <button type="submit" disabled={inviting || !inviteInput}
                                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors whitespace-nowrap"
                                    >
                                        {inviting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                                        Grant Access
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">
                                    If the email isn't registered yet, an invite is stored and auto-activates when they sign up.
                                </p>
                            </form>
                        )}

                        {/* Access list */}
                        {accessList.length === 0 ? (
                            <div className="px-6 py-12 text-center text-slate-400 text-sm">No access records yet.</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {accessList.map(a => (
                                    <div key={a.id} className="flex items-center gap-4 px-6 py-3.5 group hover:bg-slate-50 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                            {(a.student_name || a.invited_email || "?")[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                {a.student_name || <span className="text-slate-400 italic">Pending Registration</span>}
                                            </p>
                                            <p className="text-xs text-slate-400 truncate">{a.student_email || a.invited_email}</p>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.access_status === "active" ? "bg-emerald-50 text-emerald-600" :
                                                a.access_status === "pending" ? "bg-amber-50 text-amber-600" :
                                                    "bg-red-50 text-red-500"
                                            }`}>
                                            {a.access_status}
                                        </span>
                                        {a.student_id && a.access_status !== "revoked" && (
                                            <button
                                                onClick={() => handleRevoke(a.student_id!, a.student_name || "student")}
                                                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                                                title="Revoke access"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
