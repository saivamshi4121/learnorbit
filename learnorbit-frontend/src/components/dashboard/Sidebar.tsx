"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    BookOpen, 
    MessageSquare, 
    User, 
    Settings, 
    LogOut,
    ChevronLeft,
    Sparkles,
    GraduationCap,
    Clock,
    Heart
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { logout } from "@/lib/auth";

const menuItems = [
    { name: "Dashboard", href: "/student/my-courses", icon: LayoutDashboard },
    { name: "All Courses", href: "/courses", icon: BookOpen },
    { name: "My Blogs", href: "/dashboard/blogs", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside 
            className={`fixed left-0 top-0 h-screen bg-[#020a1a] text-gray-400 transition-all duration-300 z-50 border-r border-white/5 ${
                isCollapsed ? "w-20" : "w-64"
            }`}
        >
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="p-6 flex items-center justify-between">
                    {!isCollapsed && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 text-white font-bold text-xl"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <span>LearnOrbit</span>
                        </motion.div>
                    )}
                    {isCollapsed && (
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center mx-auto text-white">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 mt-6 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                                    isActive 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                                    : "hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "" : "group-hover:scale-110 transition-transform"}`} />
                                {!isCollapsed && (
                                    <span className="font-medium text-sm">{item.name}</span>
                                )}
                                {isActive && !isCollapsed && (
                                    <motion.div 
                                        layoutId="active-pill"
                                        className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 mt-auto">
                    {!isCollapsed && (
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/5 mb-4">
                            <div className="flex items-center gap-2 text-blue-400 mb-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold uppercase tracking-wider">Pro Tip</span>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-relaxed">
                                Complete your daily goals to maintain your streak!
                            </p>
                        </div>
                    )}
                    
                    <button 
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-all text-gray-400"
                    >
                        <LogOut className="w-5 h-5" />
                        {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
                    </button>
                </div>

                {/* Collapse Toggle */}
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 w-6 h-6 bg-[#020a1a] border border-white/5 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all shadow-xl"
                >
                    <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
                </button>
            </div>
        </aside>
    );
}
