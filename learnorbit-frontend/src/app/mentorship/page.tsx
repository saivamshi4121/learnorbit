"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { MarqueeBanner } from "@/components/ui/MarqueeBanner";
import {
    ArrowRight,
    CheckCircle2,
    Code2,
    Rocket,
    Target,
    Users,
    Zap,
    Loader2,
    Calendar,
    Clock,
    Briefcase,
    GraduationCap
} from "lucide-react";

export default function MentorshipPage() {
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        linkedin: "",
        github: "",
        currentRole: "",
        targetRole: "",
        experience: "beginner", // beginner, intermediate, advanced
        focusAreas: [] as string[],
        availability: "",
        motivation: ""
    });

    const focusOptions = [
        "Frontend Development",
        "Backend Development",
        "Full Stack",
        "System Design",
        "DevOps / Cloud",
        "Career Guidance",
        "Code Reviews",
        "Job Interview Prep"
    ];

    const handleFocusChange = (area: string) => {
        setFormData(prev => {
            const newFocus = prev.focusAreas.includes(area)
                ? prev.focusAreas.filter(a => a !== area)
                : [...prev.focusAreas, area];
            return { ...prev, focusAreas: newFocus };
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-xl shadow-slate-200/50 border border-slate-100 animate-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Received!</h2>
                        <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                            Thank you for applying to the mentorship program. Our team will review your profile and get back to you within 48 hours to schedule an introductory call.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center px-8 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100">
            <div className="fixed top-0 left-0 right-0 z-[60]">
                <MarqueeBanner />
            </div>
            <Navbar />

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Rocket className="w-4 h-4" />
                        <span>Accepting New Mentees for Batch 2026</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Fast-track your career with <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            Expert Mentorship
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Get personalized guidance, code reviews, and career advice from senior engineers at top tech companies. Don't learn alone.
                    </p>
                </div>
            </section>

            {/* --- MAIN CONTENT GRID --- */}
            <section className="pb-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                        {/* LEFT COLUMN: BENEFITS & INFO */}
                        <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-left-8 duration-700 delay-300">

                            {/* Feature 1 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center text-blue-600">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Personalized Roadmap</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        We'll create a custom learning path tailored to your specific goals, whether it's landing your first job or getting promoted to Senior.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center text-indigo-600">
                                    <Code2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Deep Code Reviews</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Get detailed feedback on your projects. Learn best practices, design patterns, and how to write clean, maintainable code.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl shadow-md border border-slate-100 flex items-center justify-center text-purple-600">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">Career Strategy</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        Mock interviews, resume optimization, and negotiation tactics to help you land high-paying roles at top companies.
                                    </p>
                                </div>
                            </div>

                            {/* Testimonial / Social Proof */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
                                <div className="flex items-center gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Zap key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                    ))}
                                </div>
                                <p className="text-slate-700 italic mb-4">
                                    "The mentorship program completely changed my trajectory. I went from struggling with tutorials to landing a Senior React role in 3 months."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                                    <div>
                                        <p className="font-bold text-sm text-slate-900">Sarah Jenkins</p>
                                        <p className="text-xs text-slate-500">Frontend Engineer @ Vercel</p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: APPLICATION FORM */}
                        <div className="lg:col-span-7">
                            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <Users className="w-6 h-6 text-blue-600" />
                                    Mentorship Application
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-8">

                                    {/* Section 1: Personal Info */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">About You</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label htmlFor="fullName" className="text-sm font-semibold text-slate-700">Full Name</label>
                                                <input
                                                    id="fullName"
                                                    type="text"
                                                    required
                                                    value={formData.fullName}
                                                    onChange={handleChange}
                                                    placeholder="Jane Doe"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="jane@example.com"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label htmlFor="linkedin" className="text-sm font-semibold text-slate-700">LinkedIn Profile</label>
                                                <input
                                                    id="linkedin"
                                                    type="url"
                                                    value={formData.linkedin}
                                                    onChange={handleChange}
                                                    placeholder="linkedin.com/in/jane"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="github" className="text-sm font-semibold text-slate-700">GitHub Profile</label>
                                                <input
                                                    id="github"
                                                    type="url"
                                                    value={formData.github}
                                                    onChange={handleChange}
                                                    placeholder="github.com/jane"
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Experience & Focus */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Experience & Goals</h3>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label htmlFor="currentRole" className="text-sm font-semibold text-slate-700">Current Role</label>
                                                <input
                                                    id="currentRole"
                                                    type="text"
                                                    value={formData.currentRole}
                                                    onChange={handleChange}
                                                    placeholder="Student, Junior Dev, etc."
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="experience" className="text-sm font-semibold text-slate-700">Experience Level</label>
                                                <select
                                                    id="experience"
                                                    value={formData.experience}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="student">Student / Bootcamper</option>
                                                    <option value="junior">Junior (0-2 years)</option>
                                                    <option value="mid">Mid-Level (2-5 years)</option>
                                                    <option value="senior">Senior (5+ years)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">What areas do you want to focus on?</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                                                {focusOptions.map(option => (
                                                    <button
                                                        key={option}
                                                        type="button"
                                                        onClick={() => handleFocusChange(option)}
                                                        className={`
                                text-left px-3 py-2 rounded-lg text-sm font-medium transition-all border
                                ${formData.focusAreas.includes(option)
                                                                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                                                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                                                            }
                              `}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.focusAreas.includes(option) ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
                                                                {formData.focusAreas.includes(option) && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                            </div>
                                                            {option}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Motivation */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Why Mentorship?</h3>
                                        <div className="space-y-1.5">
                                            <label htmlFor="motivation" className="text-sm font-semibold text-slate-700">Tell us about your goals and what you hope to achieve</label>
                                            <textarea
                                                id="motivation"
                                                required
                                                value={formData.motivation}
                                                onChange={handleChange}
                                                rows={4}
                                                placeholder="I want to transition from frontend to fullstack..."
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin h-6 w-6" />
                                        ) : (
                                            <>
                                                Submit Application
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-xs text-center text-slate-400">
                                        By submitting, you agree to our mentorship program guidelines. <br />
                                        Limited spots available for the 2026 cohort.
                                    </p>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
