"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Menu,
    X,
    ChevronRight,
    ArrowRight,
    Sparkles,
    Home,
    BookOpen,
    Users,
    DollarSign,
    MessageSquare,
    Calendar,
    Phone,
    LogIn,
    UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [mobileMenuOpen]);

    const navLinks = [
        { name: "Home", href: "/", icon: Home },
        { name: "Courses", href: "/courses", icon: BookOpen },
        { name: "Mentorship", href: "/mentorship", icon: Users },
        { name: "Pricing", href: "/pricing", icon: DollarSign },
        { name: "Blogs", href: "/blogs", icon: MessageSquare },
        { name: "Events", href: "/events", icon: Calendar },
        { name: "Contact", href: "/contact#contact-form", icon: Phone },
    ];

    return (
        <>
            {/* Main Desktop/Mobile Navbar */}
            <nav
                className={`fixed left-0 right-0 z-[100] h-16 lg:h-18 transition-all duration-500 border-b ${scrolled
                    ? "top-0 bg-white/95 backdrop-blur-md border-gray-100 shadow-md"
                    : "top-[40px] bg-white/0 border-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                    <div className="flex items-center justify-between h-full py-2">

                        {/* Logo Area */}
                        <Link href="/" className="flex items-center group h-full">
                            <Image
                                src="/learnorbit.png"
                                alt="LearnOrbit"
                                width={180}
                                height={50}
                                className="max-h-full w-32 sm:w-44 lg:w-52 h-auto object-contain group-hover:opacity-90 transition-opacity"
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
                            className="lg:hidden p-2 -mr-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-colors relative z-[150]"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <AnimatePresence mode="wait">
                                {mobileMenuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Menu className="w-6 h-6" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </nav>

            {/* PREMIUM SIDE DRAWER MENU */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Glass Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[130] lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-[140] lg:hidden overflow-hidden flex flex-col"
                        >
                            {/* Drawer Background Pattern */}
                            <div className="absolute top-0 right-0 -z-10 w-full h-64 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-[0.02] -z-10" />

                            {/* Drawer Header */}
                            <div className="pt-16 pb-6 px-6 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <Image src="/learnorbit.png" alt="Logo" width={32} height={32} className="brightness-0 invert h-6 w-auto" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">LearnOrbit</h3>
                                        <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Educational Platform</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 overflow-y-auto px-4 py-6">
                                <div className="grid gap-1">
                                    {navLinks.map((link, i) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 group transition-all"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                                                    <link.icon className="w-5 h-5 text-slate-500 group-hover:text-blue-600 transition-colors" />
                                                </div>
                                                <span className="text-slate-700 font-semibold group-hover:text-blue-600 transition-colors">
                                                    {link.name}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-gray-100 to-transparent my-8" />

                                {/* Extra Content Card */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="p-5 rounded-3xl bg-slate-900 text-white relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-colors" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles className="w-4 h-4 text-yellow-400" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-blue-300">Join Pro</span>
                                        </div>
                                        <h4 className="text-lg font-bold mb-2 leading-snug">Unlock Your Full Potential Today.</h4>
                                        <p className="text-xs text-slate-400 mb-4 leading-relaxed">Access 100+ premium courses and lifetime mentorship.</p>
                                        <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                            <button className="w-full py-2.5 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                                                Get Started <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-6 bg-gray-50/80 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-3">
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <button className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm transition-all">
                                            <LogIn className="w-4 h-4" /> Log In
                                        </button>
                                    </Link>
                                    <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <button className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                                            <UserPlus className="w-4 h-4" /> Join
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
