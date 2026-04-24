"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { post } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, Image as ImageIcon } from "lucide-react";
import { BlogEditor } from "@/components/dashboard/BlogEditor";

export default function NewBlogPage() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [published, setPublished] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const generateSlug = (text: string) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!slug || slug === generateSlug(title)) {
            setSlug(generateSlug(newTitle));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSaving(true);
        try {
            const data = await post<any>('/blogs', {
                title,
                slug,
                content,
                coverImage,
                published
            });
            if (data.success) {
                router.push('/dashboard/blogs');
            } else {
                setError(data.message || "Failed to create blog");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <Link href="/dashboard/blogs" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to blogs
            </Link>

            <h1 className="text-3xl font-black text-slate-900 mb-8">Create New Blog</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">General Information</span>
                    </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={handleTitleChange}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            placeholder="Enter blog title"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Slug (SEO URL)</label>
                        <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. how-to-learn-react"
                        />
                    </div>
                </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <ImageIcon className="w-3.5 h-3.5" />
                            Cover Image URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                            placeholder="https://images.unsplash.com/photo-..."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                        Article Content
                    </label>
                    <BlogEditor content={content} onChange={setContent} />
                </div>

                <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-3 cursor-pointer group bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm transition-all hover:bg-slate-50">
                        <input
                            type="checkbox"
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded-lg border-slate-200 focus:ring-blue-500 transition-all cursor-pointer"
                        />
                        <span className="text-sm font-bold text-slate-700">Publish immediately</span>
                    </label>

                    <div className="flex-1"></div>

                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/blogs')}
                        className="px-6 py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors"
                    >
                        Cancel
                    </button>
                    
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-xl hover:shadow-blue-500/20 text-white px-8 py-3 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? "Saving..." : "Save Blog"}
                    </button>
                </div>
            </form>
        </div>
    );
}
