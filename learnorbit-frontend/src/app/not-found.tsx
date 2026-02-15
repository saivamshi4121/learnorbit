"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
            {/* Animated Stars Background */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            opacity: [0.2, 1, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-6 max-w-2xl">
                {/* Floating Logo in Space */}
                <motion.div
                    className="mb-12 relative"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Orbital Rings around Logo */}
                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 rounded-full border border-blue-400/20" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50" />
                    </motion.div>

                    <motion.div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute inset-0 rounded-full border border-purple-400/10 border-dashed" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50" />
                    </motion.div>

                    {/* Floating Logo */}
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotateY: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative z-10"
                    >
                        <div className="inline-block bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                            <Image
                                src="/learnorbit.png"
                                alt="LearnOrbit"
                                width={300}
                                height={84}
                                className="w-auto h-20"
                            />
                        </div>
                    </motion.div>
                </motion.div>

                {/* 404 Text */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        404
                    </h1>
                    <h2 className="text-3xl font-semibold text-white mb-4">
                        Lost in Space
                    </h2>
                    <p className="text-lg text-gray-300 mb-8">
                        Looks like this page drifted out of orbit. Let's get you back on track!
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Link href="/">
                        <button className="group flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/50 hover:scale-105">
                            <Home className="w-5 h-5" />
                            Back to Home
                        </button>
                    </Link>
                    <Link href="/courses">
                        <button className="group flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 rounded-full font-semibold transition-all hover:scale-105">
                            <Search className="w-5 h-5" />
                            Browse Courses
                        </button>
                    </Link>
                </motion.div>

                {/* Fun Animation */}
                <motion.p
                    className="mt-12 text-sm text-gray-400"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    🚀 Every great journey has a few detours...
                </motion.p>
            </div>

            {/* Floating Planets */}
            <motion.div
                className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl"
                animate={{
                    x: [0, 30, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-orange-500/20 rounded-full blur-xl"
                animate={{
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />
        </div>
    );
}
