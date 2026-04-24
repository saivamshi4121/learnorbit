"use client";

import { Navbar } from "@/components/layout/Navbar";
import { MarqueeBanner } from "@/components/ui/MarqueeBanner";
import Link from "next/link";
import { ArrowRight, Check, Zap, Rocket, Shield } from "lucide-react";
import { useState } from "react";

export default function PricingPage() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            // API simulation
        }
    };

    return (
        <div className="min-h-screen bg-background text-textPrimary selection:bg-primary/30 font-sans">
            <div className="fixed top-0 left-0 right-0 z-[60]">
                <MarqueeBanner />
            </div>
            <Navbar />

            <main className="relative pt-32 pb-20 min-h-screen flex flex-col justify-center overflow-hidden">

                {/* Abstract Background - Updated to use Brand Colors */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse-slow" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50rem] h-[50rem] bg-indigo-600/20 rounded-full blur-[120px] opacity-20 animate-pulse-slow delay-1000" />
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">

                        {/* Status Indicator */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide uppercase mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Launching Q3 2026
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6 text-textPrimary animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            Enterprise-Grade Learning. <br />
                            <span className="text-primary">Accessible Pricing.</span>
                        </h1>

                        <p className="text-xl text-mutedText max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            We are finalizing our tiered plans to offer you the most value. Whether you're an individual developer or a Fortune 500 team, we have you covered.
                        </p>

                        {/* Waitlist Input */}
                        <div className="max-w-md mx-auto mb-16 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
                            {!subscribed ? (
                                <form onSubmit={handleSubscribe} className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-indigo-600 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                                    <div className="relative flex bg-white rounded-lg p-1.5 ring-1 ring-borderLight shadow-sm">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your work email"
                                            className="flex-1 bg-transparent px-4 py-3 text-textPrimary placeholder:text-mutedText outline-none border-none focus:ring-0"
                                        />
                                        <button type="submit" className="bg-textPrimary text-white px-6 py-2.5 rounded-md font-semibold hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm">
                                            Join Waitlist <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="mt-3 text-xs text-mutedText">
                                        Join 2,400+ developers from Google, Meta, and Amazon.
                                    </p>
                                </form>
                            ) : (
                                <div className="bg-success/10 border border-success/20 text-success px-6 py-4 rounded-lg flex items-center justify-center gap-3 animate-in zoom-in">
                                    <Check className="w-5 h-5" />
                                    <span className="font-medium">You're on the list. Expect a welcome email soon.</span>
                                </div>
                            )}
                        </div>

                        {/* Feature Teasers - Sleek Cards matching Brand System */}
                        <div className="grid md:grid-cols-3 gap-6 text-left animate-in fade-in slide-in-from-bottom-16 duration-700 delay-400">
                            <div className="p-6 rounded-2xl bg-white border border-borderLight shadow-sm hover:shadow-md hover:border-primary/20 transition-all group">
                                <Rocket className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-semibold text-textPrimary mb-2">Individual Pro</h3>
                                <p className="text-mutedText text-sm leading-relaxed">
                                    Full access to all advanced courses, projects, and certification paths. Perfect for upskilling.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white border border-borderLight shadow-sm hover:shadow-md hover:border-indigo-500/20 transition-all group">
                                <Zap className="w-8 h-8 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-semibold text-textPrimary mb-2">Team Plans</h3>
                                <p className="text-mutedText text-sm leading-relaxed">
                                    Centralized billing, progress tracking, and custom learning paths for your engineering team.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-white border border-borderLight shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all group">
                                <Shield className="w-8 h-8 text-emerald-600 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-semibold text-textPrimary mb-2">Enterprise</h3>
                                <p className="text-mutedText text-sm leading-relaxed">
                                    SSO, dedicated support, API access, and on-premise deployment options for large organizations.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
