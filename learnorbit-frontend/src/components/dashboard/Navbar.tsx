"use client";

import { 
    Search, 
    Bell, 
    MessageSquare, 
    ChevronDown,
    Command,
    Menu
} from "lucide-react";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCurrentUser, User as UserType } from "@/lib/auth";

export function DashboardNavbar({ onMenuClick }: { onMenuClick: () => void }) {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
                {/* Mobile Menu Toggle */}
                <button 
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-600 hover:bg-slate-50 rounded-xl lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Search Bar */}
                <div className="flex-1 max-w-md relative group hidden sm:flex">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search for courses, lessons..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-400">
                        <Command className="w-2.5 h-2.5" />
                        <span>K</span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    
                    <button className="p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-600">
                        <MessageSquare className="w-5 h-5" />
                    </button>

                    <div className="h-6 w-px bg-slate-200 mx-1" />

                    <Link href="/profile" className="flex items-center gap-3 pl-2 cursor-pointer group">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-none mb-1">{user?.name || "User"}</p>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider capitalize">{user?.role || "Student"}</p>
                        </div>
                        <div className="relative">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-all">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
