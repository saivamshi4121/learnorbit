"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Menu,
    X,
    BookOpen,
    ChevronRight,
    ArrowRight,
    Sparkles,
    GraduationCap,
    Users,
    Layout,
    Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming shadcn button exists or we style manually
// Since I don't know if Button exists, I'll stick to manual styling or check for it.
// Checking file list earlier, I saw 'ui' folder. Let's assume standard UI components might not be fully there or just use consistency.
// I will use raw Tailwind for maximum control as per instructions.

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Courses", href: "/courses" },
        { name: "Mentorship", href: "/mentorship" },
        { name: "Pricing", href: "/pricing" },
        { name: "Blogs", href: "/blogs" },
        { name: "Events", href: "/events" },
        { name: "Contact", href: "/contact#contact-form" },
    ];

    return (
        <nav
            className={`fixed top-[40px] left-0 right-0 z-50 h-18 transition-all duration-300 border-b ${scrolled
                ? "bg-white/80 backdrop-blur-md border-gray-100 shadow-sm"
                : "bg-white/0 border-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full py-2">

                    {/* Logo Area */}
                    <Link href="/" className="flex items-center group h-full">
                        <Image
                            src="/learnorbit.png"
                            alt="LearnOrbit"
                            width={220}
                            height={62}
                            className="max-h-full w-auto object-contain group-hover:opacity-90 transition-opacity"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center bg-gray-50/50 backdrop-blur-sm px-2 py-1.5 rounded-full border border-gray-100/50">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative px-5 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors rounded-full hover:bg-white hover:shadow-sm"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Area: Auth & CTA */}
                    <div className="hidden lg:flex items-center gap-4">
                        <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                            Log in
                        </Link>
                        <Link href="/register">
                            <button className="group relative px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full overflow-hidden transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30">
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </span>
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`lg:hidden fixed inset-x-0 top-[70px] bottom-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 transition-all duration-300 ease-in-out origin-top ${mobileMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 pointer-events-none"
                    }`}
            >
                <div className="px-6 py-8 space-y-6 h-full overflow-y-auto">
                    <div className="grid gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 text-slate-900 font-medium transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                            </Link>
                        ))}
                    </div>

                    <div className="h-px bg-gray-100 my-4" />

                    <div className="grid gap-4">
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full py-4 text-slate-700 font-semibold border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                Log in
                            </button>
                        </Link>
                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                            <button className="w-full py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
                                Get Started Free
                            </button>
                        </Link>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <Layout className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="font-semibold text-slate-900">New Course!</p>
                        </div>
                        <p className="text-sm text-slate-500 mb-3">
                            Master System Design with our latest interactive course.
                        </p>
                        <Link
                            href="/courses/system-design"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            View Course <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
