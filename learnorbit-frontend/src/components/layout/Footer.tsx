"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    Youtube,
    Mail,
    MapPin,
    Phone,
    ArrowRight,
    GraduationCap
} from "lucide-react";

export function Footer() {
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();

    // Hide footer in dashboards and student areas
    const isDashboard = pathname?.startsWith('/dashboard') || 
                        pathname?.includes('/student') || 
                        pathname?.includes('/instructor') || 
                        pathname?.includes('/admin');

    if (isDashboard) return null;

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
            { name: "Blog", href: "/blogs" },
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
        <footer className="bg-[#020a1a] text-gray-300 relative overflow-hidden border-t border-white/5">
            {/* Professional Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px]" />
                <div 
                    className="absolute inset-0 opacity-[0.015]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                {/* Newsletter Section */}
                <div className="py-12 border-b border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="max-w-md text-center lg:text-left">
                        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Stay in the Orbit</h3>
                        <p className="text-gray-400 text-sm">Get the latest course updates, tech insights, and career tips delivered to your inbox.</p>
                    </div>
                    <div className="w-full max-w-md">
                        <form className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm focus-within:border-blue-500/50 transition-all">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2.5 text-white placeholder:text-gray-500"
                            />
                            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Main Content */}
                <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="inline-block mb-8 group">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                                <div className="relative bg-[#020a1a] rounded-xl p-3 border border-white/10">
                                    <Image
                                        src="/learnorbit.png"
                                        alt="LearnOrbit"
                                        width={160}
                                        height={45}
                                        className="w-auto h-10 transition-all"
                                    />
                                </div>
                            </div>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-sm">
                            LearnOrbit is a next-generation LMS designed for the modern developer. We combine AI-driven intelligence with production-ready curricula to accelerate your career.
                        </p>
                        <div className="flex gap-4">
                            {footerLinks.social.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={social.name}
                                        href={social.href}
                                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Product</h4>
                            <ul className="space-y-4">
                                {footerLinks.product.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-400 hover:text-blue-400 text-sm transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Company</h4>
                            <ul className="space-y-4">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-gray-400 hover:text-blue-400 text-sm transition-colors">{link.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Contact</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    <span>devcontact09@gmail.com</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <MapPin className="w-4 h-4 text-purple-500" />
                                    <span>Hyderabad, Telangana</span>
                                </li>
                                <li className="flex items-center gap-3 mt-6">
                                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div className="font-medium text-white">Join 50k+ Learners</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Meet the Developers Section */}
                <div className="py-12 border-t border-white/5">
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8 text-center lg:text-left">Meet the Developers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Saivamshi */}
                        <div className="flex items-center gap-4 bg-white/5 p-5 rounded-[2rem] border border-white/10 hover:bg-white/[0.07] hover:border-blue-500/30 transition-all group">
                             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-600/20">
                                S
                             </div>
                             <div className="flex-1">
                                 <div className="flex items-center justify-between mb-0.5">
                                    <h5 className="text-white font-bold text-base">Saivamshi</h5>
                                    <Link 
                                        href="https://www.linkedin.com/in/saivamshi-webdev/" 
                                        target="_blank" 
                                        className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </Link>
                                 </div>
                                 <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Product Builder & System Architecture</p>
                             </div>
                        </div>

                        {/* Ashritha */}
                        <div className="flex items-center gap-4 bg-white/5 p-5 rounded-[2rem] border border-white/10 hover:bg-white/[0.07] hover:border-purple-500/30 transition-all group">
                             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-purple-600/20">
                                A
                             </div>
                             <div className="flex-1">
                                 <div className="flex items-center justify-between mb-0.5">
                                    <h5 className="text-white font-bold text-base">Ashritha</h5>
                                    <Link 
                                        href="https://www.linkedin.com/in/ashritha-kattamuri-4768ba281/" 
                                        target="_blank" 
                                        className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 transition-all"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                    </Link>
                                 </div>
                                 <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Lead AI Engineer & Backend Contributor</p>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs text-gray-500">
                        © {currentYear} LearnOrbit. Built for the future of education.
                    </p>
                    <div className="flex gap-8">
                        {footerLinks.resources.slice(1, 3).map((link) => (
                            <Link key={link.name} href={link.href} className="text-xs text-gray-500 hover:text-white transition-colors">
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
