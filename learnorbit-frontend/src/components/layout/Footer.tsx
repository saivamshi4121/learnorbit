"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    Mail,
    MapPin,
    Phone,
    ArrowRight
} from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: "Features", href: "#features" },
            { name: "Courses", href: "/courses" },
            { name: "Pricing", href: "/pricing" },
            { name: "Testimonials", href: "#testimonials" },
        ],
        company: [
            { name: "About Us", href: "/about" },
            { name: "Careers", href: "/careers" },
            { name: "Blog", href: "/blog" },
            { name: "Contact", href: "/contact" },
        ],
        resources: [
            { name: "Help Center", href: "/help" },
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Terms of Service", href: "/terms" },
            { name: "Cookie Policy", href: "/cookies" },
        ],
        social: [
            { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-600" },
            { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-500" },
            { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-700" },
            { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-600" },
            { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-600" },
        ],
    };

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 relative overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Column with Interactive Logo */}
                    <div className="lg:col-span-2">
                        <motion.div
                            className="group mb-6"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Link href="/" className="inline-block relative">
                                {/* Orbital Ring Animation on Hover */}
                                <motion.div
                                    className="absolute -inset-4 rounded-full border border-blue-400/0 group-hover:border-blue-400/30"
                                    initial={{ rotate: 0, scale: 1 }}
                                    whileHover={{ rotate: 180, scale: 1.1 }}
                                    transition={{ duration: 2 }}
                                />
                                <motion.div
                                    className="absolute -inset-6 rounded-full border border-purple-400/0 group-hover:border-purple-400/20 border-dashed"
                                    initial={{ rotate: 0, scale: 1 }}
                                    whileHover={{ rotate: -180, scale: 1.15 }}
                                    transition={{ duration: 3 }}
                                />

                                {/* Logo with Glow Effect */}
                                <div className="relative bg-white/5 group-hover:bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 group-hover:border-white/20 transition-all">
                                    <Image
                                        src="/learnorbit.png"
                                        alt="LearnOrbit"
                                        width={200}
                                        height={56}
                                        className="w-auto h-12 group-hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
                                    />
                                </div>
                            </Link>
                        </motion.div>

                        <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                            Empowering learners worldwide with production-ready skills and career-changing education.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                <Mail className="w-4 h-4" />
                                <span>support@learnorbit.com</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                <Phone className="w-4 h-4" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span>San Francisco, CA</span>
                            </div>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 group"
                                    >
                                        <span>{link.name}</span>
                                        <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700/50 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Copyright */}
                        <p className="text-sm text-gray-400">
                            © {currentYear} LearnOrbit. All rights reserved.
                        </p>

                        {/* Social Links with Hover Effects */}
                        <div className="flex items-center gap-4">
                            {footerLinks.social.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={social.name}
                                        href={social.href}
                                        className={`w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 ${social.color} transition-all`}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
