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
    Save,
    Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, User as UserType } from "@/lib/auth";
import { toast } from "sonner";

export default function ProfilePage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [activeTab, setActiveTab] = useState<"profile" | "settings" | "events">("profile");
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setUser(getCurrentUser());
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        try {
            setLoadingEvents(true);
            const { get } = await import("@/lib/api");
            const res = await get<any>('/events/registrations/my');
            if (res.success) {
                setRegistrations(res.registrations || []);
            }
        } catch (err) {
            console.error("Failed to fetch my events:", err);
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("Changes saved successfully!");
        }, 1000);
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Header / Banner */}
            <div className="relative h-32 md:h-48 rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 overflow-hidden mb-12 md:mb-20 shadow-2xl shadow-blue-500/20">
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
                />
                
                {/* Profile Picture Overlay */}
                <div className="absolute -bottom-12 md:-bottom-16 left-6 md:left-10">
                    <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-1.5 shadow-xl">
                            <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                                <User className="w-12 h-12 md:w-16 md:h-16" />
                            </div>
                        </div>
                        <button className="absolute bottom-1 right-1 md:bottom-2 md:right-2 p-1.5 md:p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-500 transition-all active:scale-95">
                            <Camera className="w-3.5 h-3.5 md:w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-4 right-8 text-white/80 text-sm font-medium">
                    Member since January 2024
                </div>
            </div>

            {/* Name and Role */}
            <div className="mb-10 pl-32 md:pl-44">
                <h1 className="text-xl md:text-3xl font-black text-slate-900 mb-1">{user.name}</h1>
                <p className="text-[10px] md:text-sm text-slate-500 font-medium flex flex-wrap items-center gap-1.5 md:gap-2">
                    <span className="capitalize">{user.role}</span>
                    <span className="hidden md:block w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="break-all">{user.email}</span>
                </p>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 md:gap-4 mb-8 bg-slate-100/50 p-1 rounded-2xl w-full sm:w-fit overflow-x-auto scrollbar-hide">
                <button 
                    onClick={() => setActiveTab("profile")}
                    className={`flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                        activeTab === "profile" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Profile Details
                </button>
                <button 
                    onClick={() => setActiveTab("settings")}
                    className={`flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                        activeTab === "settings" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    General Settings
                </button>
                <button 
                    onClick={() => setActiveTab("events")}
                    className={`flex-1 sm:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all ${
                        activeTab === "events" 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                >
                    Event Participations
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
                            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-6">Personal Information</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                                    <div className="sm:col-span-2 space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                                        <textarea 
                                            placeholder="Tell us about yourself..."
                                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all h-32 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                                <h3 className="text-base md:text-lg font-bold text-slate-900 mb-6">Social Profiles</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Github className="w-5 h-5 text-slate-600 shrink-0" />
                                        <input type="text" placeholder="GitHub Username" className="flex-1 bg-transparent text-sm outline-none min-w-0" />
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <Linkedin className="w-5 h-5 text-slate-600 shrink-0" />
                                        <input type="text" placeholder="LinkedIn Profile" className="flex-1 bg-transparent text-sm outline-none min-w-0" />
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
                ) : activeTab === "events" ? (
                    <motion.div 
                        key="events"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-6"
                    >
                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-indigo-500" />
                                My Event Certifications
                            </h3>
                            
                            {loadingEvents ? (
                                <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                            ) : registrations.length === 0 ? (
                                <div className="text-center py-10">
                                    <p className="text-slate-500">You haven't participated in any events yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {registrations.map((reg) => (
                                        <div key={reg.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                                            <div>
                                                <h4 className="font-bold text-slate-900">{reg.event_title}</h4>
                                                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                                    <span>{new Date(reg.created_at).toLocaleDateString()}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span className={`capitalize font-bold ${
                                                        reg.status === 'approved' ? 'text-green-600' : 
                                                        reg.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                                                    }`}>{reg.status}</span>
                                                </p>
                                            </div>
                                            {reg.status === 'approved' && reg.certificate_settings?.enabled && (
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shared via Email</span>
                                                    <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-100 flex items-center gap-1.5">
                                                        <Award className="w-3.5 h-3.5" /> Issued
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
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

                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <h3 className="text-base md:text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
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
                                    <div key={idx} className="flex items-center justify-between gap-4">
                                        <span className="text-sm text-slate-600 leading-tight">{item}</span>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 shrink-0" />
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
