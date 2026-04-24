"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Building2, CheckCircle2, XCircle, Loader2, ChevronDown, Search } from "lucide-react";
import { listAllInstitutes, createInstitute, updateInstituteStatus } from "@/lib/services/institute.service";
import type { Institute } from "@/lib/services/institute.service";
import { getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SuperAdminInstitutesPage() {
    const [institutes, setInstitutes] = useState<Institute[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    // Create form
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [creating, setCreating] = useState(false);

    const load = () => {
        listAllInstitutes()
            .then(r => { if (r.success) setInstitutes(r.data); })
            .catch(() => toast.error("Failed to load institutes"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const user = getCurrentUser();
        if (!user || user.role !== 'super_admin') {
            router.push('/login');
            return;
        }
        load();
    }, [router]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) return;
        setCreating(true);
        try {
            const res = await createInstitute({ name, email, password });
            toast.success(`Institute "${name}" created`);
            setInstitutes(prev => [res.data.institute, ...prev]);
            setName(""); setEmail(""); setPassword(""); setShowForm(false);
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Failed to create institute");
        } finally { setCreating(false); }
    };

    const handleStatusToggle = async (inst: Institute) => {
        const newStatus = inst.status === "active" ? "suspended" : "active";
        if (!confirm(`${newStatus === "suspended" ? "Suspend" : "Reactivate"} "${inst.name}"?`)) return;
        try {
            await updateInstituteStatus(inst.id, newStatus);
            setInstitutes(prev => prev.map(i => i.id === inst.id ? { ...i, status: newStatus } : i));
            toast.success(`Institute ${newStatus}`);
        } catch { toast.error("Failed to update status"); }
    };

    const filtered = institutes.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Institute Management</h1>
                        <p className="text-sm text-slate-400 mt-1">{institutes.length} institute{institutes.length !== 1 ? "s" : ""} registered</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 self-start"
                    >
                        <Plus className="w-4 h-4" />
                        Add Institute
                        <ChevronDown className={`w-4 h-4 transition-transform ${showForm ? "rotate-180" : ""}`} />
                    </button>
                </div>

                {/* Create Form */}
                {showForm && (
                    <form onSubmit={handleCreate} className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-6 mb-6 space-y-4">
                        <h2 className="text-sm font-semibold text-white uppercase tracking-wider">New Institute</h2>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 font-medium block mb-1.5">Institute Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Apex Academy"
                                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-medium block mb-1.5">Admin Email</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} required type="email" placeholder="admin@institute.com"
                                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 font-medium block mb-1.5">Temp Password</label>
                                <input value={password} onChange={e => setPassword(e.target.value)} required type="password" placeholder="Min 8 characters"
                                    className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" disabled={creating}
                                className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors"
                            >
                                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                                Create Institute
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="px-5 py-2.5 rounded-xl border border-white/20 text-slate-400 hover:text-white text-sm font-semibold transition-colors">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search institutes..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400/50"
                    />
                </div>

                {/* Institutes Grid */}
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
                                <div className="h-5 bg-white/10 rounded mb-3 w-2/3" />
                                <div className="h-3 bg-white/10 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center py-20 text-center">
                        <Building2 className="w-10 h-10 text-slate-600 mb-3" />
                        <p className="text-slate-400 font-medium">No institutes found</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(inst => (
                            <div key={inst.id} className="bg-white/5 border border-white/10 hover:border-white/25 backdrop-blur rounded-2xl p-5 transition-all group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {inst.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${inst.status === "active"
                                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                        : "bg-red-500/15 text-red-400 border border-red-500/30"
                                        }`}>
                                        {inst.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {inst.status}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-white mb-1 truncate">{inst.name}</h3>
                                <p className="text-xs text-slate-400 truncate mb-4">{inst.email}</p>

                                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                                    <span>📚 {inst.course_count} courses</span>
                                    <span>👥 {inst.student_count} students</span>
                                </div>

                                <button
                                    onClick={() => handleStatusToggle(inst)}
                                    className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${inst.status === "active"
                                        ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                                        : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                        }`}
                                >
                                    {inst.status === "active" ? "Suspend Institute" : "Reactivate Institute"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
