"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowRight,
    BookOpen,
    Github,
    Loader2,
    Sparkles,
    Zap,
    CheckCircle2,
    Play
} from "lucide-react";
import { MarqueeBanner } from "@/components/ui/MarqueeBanner";

interface AuthFrameProps {
    type: "login" | "register";
    title: string;
    subtitle: string;
    children: React.ReactNode;
    footerText: string;
    footerLinkText: string;
    footerLink: string;
}

export function AuthFrame({
    type,
    title,
    subtitle,
    children,
    footerText,
    footerLinkText,
    footerLink
}: AuthFrameProps) {
    // Dynamic Ad Content - this can be passed as props later for rotation
    const adContent = {
        badge: "Spotlight",
        title: "Master System Design",
        description: "Learn how to architect scalable, distributed systems from senior engineers at FAANG.",
        stats: [
            { label: "Students", value: "12k+" },
            { label: "Rating", value: "4.9/5" },
            { label: "Hours", value: "45h" }
        ],
        bgGradient: "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
    };

    return (
        <div className="h-screen overflow-hidden bg-slate-50 flex">
            {/* 
        LEFT SIDE: ADVERTISING / PROMO AREA 
        Moved to left side for a more standard "Split Screen" SaaS login look 
        which often puts the visual on the left and form on the right.
      */}
            <div className={`hidden lg:flex flex-1 relative overflow-hidden ${adContent.bgGradient} text-white`}>
                {/* Animated Background Elements */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />

                <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
                    {/* Top: Brand Logo (Small) */}
                    <Link href="/" className="flex items-center gap-2 w-fit group">
                        <div className="relative">
                            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                                <BookOpen className="h-4 w-4 text-white" />
                            </div>
                        </div>
                        <span className="font-bold text-lg tracking-tight">LearnOrbit</span>
                    </Link>

                    {/* Middle: Main Promo Content */}
                    <div className="space-y-8 max-w-lg">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/20 text-blue-200 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
                            <Sparkles className="w-3 h-3 text-blue-400" />
                            {adContent.badge}
                        </div>

                        <h2 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                            {adContent.title}
                        </h2>

                        <p className="text-lg text-slate-300 leading-relaxed">
                            {adContent.description}
                        </p>

                        {/* Feature List / Benefits */}
                        <div className="space-y-3">
                            {[
                                "100+ Interview Questions",
                                "Real-world Case Studies",
                                "Mock Interviews included"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                                    </div>
                                    <span className="text-slate-300 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* Ad CTA - Prominent "Get Offer" or similar */}
                        <div className="pt-4">
                            <button className="group flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-all shadow-xl shadow-black/10 hover:shadow-2xl hover:-translate-y-0.5">
                                <Play className="w-4 h-4 fill-current" />
                                Preview Course
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="mt-4 text-xs text-slate-400">
                                Limited time offer: Get 20% off with code <span className="text-white font-mono bg-white/10 px-1 py-0.5 rounded">EARLY2026</span>
                            </p>
                        </div>
                    </div>

                    {/* Bottom: Stats / Social Proof */}
                    <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                        {adContent.stats.map((stat, index) => (
                            <div key={index}>
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-sm text-slate-400">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 
        RIGHT SIDE: FORM AREA 
        Clean, centered, minimal distraction.
      */}
            {/* 
        RIGHT SIDE: FORM AREA 
        Clean, centered, minimal distraction.
      */}
            <div className="flex-1 flex flex-col justify-center h-full overflow-y-auto px-4 sm:px-6 lg:px-20 xl:px-24 bg-white/50 relative scrollbar-hide">
                {/* Subtle Background Pattern for Form Area */}
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

                {/* Mobile Header (only visible on mobile) */}
                <div className="lg:hidden absolute top-6 left-6 z-20">
                    <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        LearnOrbit
                    </Link>
                </div>

                <div className="w-full max-w-sm mx-auto space-y-8 relative z-10">
                    <div className="text-center lg:text-left animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
                        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-600">
                            {subtitle}
                        </p>
                    </div>

                    {/* Social Auth Buttons (Placeholder logic) */}
                    <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md active:scale-[0.98]">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all text-sm font-semibold text-slate-700 shadow-sm hover:shadow-md active:scale-[0.98]">
                            <Github className="w-5 h-5" />
                            GitHub
                        </button>
                    </div>

                    <div className="relative animate-in fade-in duration-700 delay-300">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-50 text-slate-500 uppercase font-medium text-xs tracking-wider">Or continue with</span>
                        </div>
                    </div>

                    {children}

                    <div className="text-center lg:text-left animate-in fade-in duration-1000 delay-500">
                        <p className="text-sm text-slate-600">
                            {footerText}{" "}
                            <Link href={footerLink} className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all">
                                {footerLinkText}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
