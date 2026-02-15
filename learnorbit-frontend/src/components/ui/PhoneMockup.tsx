"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Phone, Wifi, Battery, Signal } from "lucide-react";

export function PhoneMockup() {
    return (
        <div className="relative">
            {/* Floating Animation Container */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="relative"
            >
                {/* Phone Device */}
                <div className="relative mx-auto w-[280px] h-[560px]">
                    {/* Phone Frame */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] shadow-2xl shadow-black/50 p-3">
                        {/* Screen Bezel */}
                        <div className="relative h-full bg-white rounded-[2.5rem] overflow-hidden">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-900 rounded-b-3xl z-20" />

                            {/* Status Bar */}
                            <div className="absolute top-0 left-0 right-0 h-12 px-6 flex items-center justify-between text-slate-900 z-10 pt-2">
                                <span className="text-xs font-semibold">9:41</span>
                                <div className="flex items-center gap-1">
                                    <Signal className="w-3 h-3" />
                                    <Wifi className="w-3 h-3" />
                                    <Battery className="w-4 h-3" />
                                </div>
                            </div>

                            {/* Screen Content */}
                            <div className="relative h-full bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-12 pb-8 px-6 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {/* App Header with Logo */}
                                <div className="text-center mb-6 mt-4">
                                    <motion.div
                                        className="inline-block"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Image
                                            src="/learnorbit.png"
                                            alt="LearnOrbit"
                                            width={160}
                                            height={45}
                                            className="w-auto h-8 mx-auto"
                                        />
                                    </motion.div>
                                    <p className="text-xs text-slate-500 mt-2">Get in Touch</p>
                                </div>

                                {/* Contact Form Inside Phone */}
                                <div className="space-y-3">
                                    {/* Name Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                                            Your Name
                                        </label>
                                        <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                            <p className="text-xs text-slate-400">John Doe</p>
                                        </div>
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                                            Email Address
                                        </label>
                                        <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                            <p className="text-xs text-slate-400">john@example.com</p>
                                        </div>
                                    </div>

                                    {/* Subject Select */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                                            Subject
                                        </label>
                                        <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm">
                                            <p className="text-xs text-slate-600">General Inquiry</p>
                                        </div>
                                    </div>

                                    {/* Message Textarea */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-medium text-slate-600 uppercase tracking-wide">
                                            Message
                                        </label>
                                        <div className="bg-white rounded-lg p-2.5 border border-slate-200 shadow-sm h-16">
                                            <p className="text-xs text-slate-400">How can we help you?</p>
                                        </div>
                                    </div>

                                    {/* Send Button */}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg py-3 text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                                    >
                                        <span>Send Message</span>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </motion.button>

                                    {/* Privacy Text */}
                                    <p className="text-[9px] text-center text-slate-400 leading-relaxed">
                                        By submitting, you agree to our Privacy Policy
                                    </p>
                                </div>

                                {/* Bottom Navigation Preview */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5">
                                    <div className="flex items-center justify-around">
                                        {['🏠', '📚', '💬', '👤'].map((icon, i) => (
                                            <motion.div
                                                key={i}
                                                whileTap={{ scale: 0.9 }}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center ${i === 2 ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <span className="text-base">{icon}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Volume Buttons */}
                        <div className="absolute left-0 top-28 w-1 h-8 bg-slate-800 rounded-r" />
                        <div className="absolute left-0 top-40 w-1 h-8 bg-slate-800 rounded-r" />

                        {/* Power Button */}
                        <div className="absolute right-0 top-32 w-1 h-12 bg-slate-800 rounded-l" />
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-[3rem] blur-2xl -z-10" />
                </div>
            </motion.div>

            {/* Floating Icons */}
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center text-2xl"
            >
                📱
            </motion.div>

            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-8 -left-8 w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center text-xl"
            >
                💬
            </motion.div>
        </div>
    );
}
