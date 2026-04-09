"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard, BookOpen, Users, LogOut,
    Building2, Menu, X, ChevronRight
} from "lucide-react";
import { getCurrentUser, logout } from "@/lib/auth";
import CourseAgent from "@/components/dashboard/CourseAgent";

const NAV = [
    { label: "Overview", href: "/institute", icon: LayoutDashboard },
    { label: "Courses", href: "/institute/courses", icon: BookOpen },
    { label: "Students", href: "/institute/students", icon: Users },
];

export default function InstituteLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [mobileOpen, setMob] = useState(false);

    useEffect(() => {
        const u = getCurrentUser();
        if (!u || u.role !== "institute_admin") {
            router.push("/login");
            return;
        }
        setUser(u);
    }, [router]);

    if (!user) return null;

    const isActive = (href: string) =>
        href === "/institute" ? pathname === href : pathname.startsWith(href);

    const Sidebar = () => (
        <aside className="flex flex-col h-full bg-white border-r border-slate-200/80 w-64">
            {/* Brand */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-xs text-slate-400">Institute Admin</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV.map(item => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMob(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                            <span className="flex-1">{item.label}</span>
                            {active && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-slate-100">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    Sign out
                </button>
            </div>
        </aside>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMob(false)} />
                    <div className="relative flex flex-col w-64 z-50 shadow-2xl">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile top bar */}
                <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white">
                    <button
                        onClick={() => setMob(true)}
                        className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-900 truncate">{user.name}</span>
                </div>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>

            {/* AI Course Agent */}
            <CourseAgent />
        </div>
    );
}
