"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Users, Trash2, Search, UserPlus, Mail, Calendar } from "lucide-react";
import { listStudents, removeStudent } from "@/lib/services/institute.service";
import type { InstituteStudent } from "@/lib/services/institute.service";

export default function InstituteStudentsPage() {
    const [students, setStudents] = useState<InstituteStudent[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [removing, setRemoving] = useState<number | null>(null);

    const load = () => {
        listStudents()
            .then(r => { if (r.success) setStudents(r.data); })
            .catch(() => toast.error("Failed to load students"))
            .finally(() => setLoading(false));
    };
    useEffect(load, []);

    const handleRemove = async (id: number, name: string) => {
        if (!confirm(`Remove ${name} from this institute?`)) return;
        setRemoving(id);
        try {
            await removeStudent(id);
            setStudents(prev => prev.filter(s => s.id !== id));
            toast.success(`${name} removed`);
        } catch { toast.error("Failed to remove student"); }
        finally { setRemoving(null); }
    };

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/20 to-slate-50 p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Students</h1>
                <p className="text-sm text-slate-500 mt-0.5">{students.length} enrolled student{students.length !== 1 ? "s" : ""}</p>
            </div>

            {/* Search bar */}
            <div className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-400 shadow-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="divide-y divide-slate-100">
                        {Array(5).fill(0).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-slate-100 rounded w-1/3" />
                                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                            <Users className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="font-medium text-slate-600">
                            {search ? "No students match your search" : "No students yet"}
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            {!search && "Students are added automatically when granted course access."}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-slate-100 bg-slate-50/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            <div />
                            <div>Student</div>
                            <div className="hidden sm:block">Email</div>
                            <div>Actions</div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {filtered.map(student => {
                                const initials = student.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                                return (
                                    <div key={student.id} className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors group">
                                        {/* Avatar */}
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                            {initials}
                                        </div>

                                        {/* Name + joined */}
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{student.name}</p>
                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                <Calendar className="w-3 h-3 flex-shrink-0" />
                                                Joined {new Date(student.enrolled_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                                            </p>
                                        </div>

                                        {/* Email */}
                                        <div className="hidden sm:flex items-center gap-1.5 min-w-0">
                                            <Mail className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                                            <span className="text-sm text-slate-500 truncate">{student.email}</span>
                                        </div>

                                        {/* Actions */}
                                        <button
                                            onClick={() => handleRemove(student.id, student.name)}
                                            disabled={removing === student.id}
                                            className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all disabled:opacity-30"
                                            title="Remove from institute"
                                        >
                                            {removing === student.id
                                                ? <div className="w-4 h-4 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                                                : <Trash2 className="w-4 h-4" />
                                            }
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
