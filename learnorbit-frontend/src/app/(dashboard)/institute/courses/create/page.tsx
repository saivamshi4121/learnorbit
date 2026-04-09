"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Globe, Lock, UserCheck } from "lucide-react";
import Link from "next/link";
import { createCourse } from "@/lib/services/institute.service";

const VISIBILITY_OPTIONS = [
    {
        value: "private",
        icon: Lock,
        label: "Private",
        desc: "Only you (admin) can see this course.",
        cls: "border-slate-200 hover:border-slate-400",
        activeCls: "border-slate-600 bg-slate-50 ring-2 ring-slate-300",
    },
    {
        value: "public",
        icon: Globe,
        label: "Public",
        desc: "All institute students can view and access this course.",
        cls: "border-emerald-200 hover:border-emerald-400",
        activeCls: "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-300",
    },
    {
        value: "selected",
        icon: UserCheck,
        label: "Selected Students",
        desc: "Only students you explicitly grant access to can see this.",
        cls: "border-blue-200 hover:border-blue-400",
        activeCls: "border-blue-600 bg-blue-50 ring-2 ring-blue-300",
    },
];

export default function CreateCoursePage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("private");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) { toast.error("Title is required"); return; }
        setLoading(true);
        try {
            await createCourse({ title: title.trim(), description: description.trim() || undefined, visibility_type: visibility });
            toast.success("Course created!");
            router.push("/institute/courses");
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Failed to create course");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/institute/courses" className="p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all text-slate-500">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Create New Course</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Fill in the details to set up your course</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-5">
                        <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Basic Information</h2>

                        <div className="space-y-1.5">
                            <label htmlFor="title" className="block text-sm font-medium text-slate-700">Course Title <span className="text-red-500">*</span></label>
                            <input
                                id="title"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder="e.g. Introduction to Data Science"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50/50 focus:bg-white transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Brief overview of what students will learn..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-slate-50/50 focus:bg-white transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Visibility */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 space-y-4">
                        <h2 className="font-semibold text-slate-900 text-sm uppercase tracking-wider">Access Control</h2>
                        <p className="text-xs text-slate-400">Choose who can see this course</p>
                        <div className="grid sm:grid-cols-3 gap-3">
                            {VISIBILITY_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setVisibility(opt.value)}
                                    className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 transition-all text-left ${visibility === opt.value ? opt.activeCls : opt.cls
                                        }`}
                                >
                                    <opt.icon className="w-5 h-5 text-current opacity-70" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end pt-2">
                        <Link
                            href="/institute/courses"
                            className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-blue-500/25 transition-all"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? "Creating..." : "Create Course"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
