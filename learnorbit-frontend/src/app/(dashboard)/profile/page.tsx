"use client";

import { useState, useEffect } from "react";
import { 
    User, 
    Mail, 
    Shield, 
    Bell, 
    Key, 
    Camera, 
    Github, 
    Linkedin, 
    Globe,
    CheckCircle,
    AlertCircle,
    Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, User as UserType } from "@/lib/auth";
import { toast } from "sonner";

export default function ProfilePage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Changes saved successfully!");
        }, 1000);
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header / Banner */}
            <div className="relative h-48 rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden mb-20 shadow-2xl shadow-blue-500/20">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
                />
                
                {/* Profile Picture Overlay */}
                <div className="absolute -bottom-16 left-10">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-xl">
                            <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                <User className="w-16 h-16" />
                            </div>
                        </div>
                        <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-500 transition-all active:scale-95">
                            <Camera className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-4 right-8 text-white/80 text-sm font-medium">
                    Member since January 2024
                </div>
            </div>

            {/* Name and Role */}
            <div className="mb-10 pl-44">
                <h1 className="text-3xl font-black text-slate-900 mb-1">{user.name}</h1>
                <p className="text-slate-500 font-medium flex items-center gap-2">
                    <span className="capitalize">{user.role}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>{user.email}</span>
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-4 mb-8 bg-slate-100/50 p-1.5 rounded-2xl w-fit">
                <button 
                    onClick={() => setActiveTab("profile")}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        activeTab === "profile" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Profile Details
                </button>
                <button 
                    onClick={() => setActiveTab("settings")}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        activeTab === "settings" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    General Settings
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "profile" ? (
                    <motion.div 
                        key="profile"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {/* Left Column: Forms */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                        <input 
                                            type="text" 
                                            defaultValue={user.name}
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                        <input 
                                            type="email" 
                                            defaultValue={user.email}
                                            disabled
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm opacity-60 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                                        <textarea 
                                            placeholder="Tell us about yourself..."
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-900 mb-6">Social Profiles</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Github className="w-5 h-5 text-slate-600" />
                                        <input type="text" placeholder="GitHub Username" className="flex-1 bg-transparent text-sm outline-none" />
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Linkedin className="w-5 h-5 text-slate-600" />
                                        <input type="text" placeholder="LinkedIn Profile" className="flex-1 bg-transparent text-sm outline-none" />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-5 h-5" />}
                                Save Changes
                            </button>
                        </div>

                        {/* Right Column: Info / Badges */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white">
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                    Verification
                                </h3>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 mb-4">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                    <div>
                                        <p className="text-sm font-bold">Email Verified</p>
                                        <p className="text-[10px] text-gray-400">Secured since Jan 2024</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <AlertCircle className="w-5 h-5 text-amber-400" />
                                    <div>
                                        <p className="text-sm font-bold">ID Pending</p>
                                        <p className="text-[10px] text-gray-400">Complete verification</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Learning Pulse</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-2xl">
                                        <p className="text-2xl font-black text-blue-600">12</p>
                                        <p className="text-[10px] font-bold text-blue-400 uppercase">Courses</p>
                                    </div>
                                    <div className="p-4 bg-purple-50 rounded-2xl">
                                        <p className="text-2xl font-black text-purple-600">84%</p>
                                        <p className="text-[10px] font-bold text-purple-400 uppercase">Avg Rank</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="settings"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Key className="w-5 h-5 text-blue-500" />
                                Security Settings
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Two-Factor Authentication</p>
                                        <p className="text-xs text-slate-500">Secure your account with 2FA codes</p>
                                    </div>
                                    <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-all" />
                                    </div>
                                </div>
                                <button className="text-blue-600 text-sm font-bold hover:underline">Change Account Password</button>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-purple-500" />
                                Notification Preferences
                            </h3>
                            <div className="space-y-4">
                                {[
                                    "New course materials available",
                                    "Event reminders and webinars",
                                    "Marketing and promotional emails",
                                    "System updates and maintenance"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">{item}</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
