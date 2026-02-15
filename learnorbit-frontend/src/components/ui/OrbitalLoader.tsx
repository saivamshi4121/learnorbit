"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface OrbitalLoaderProps {
    size?: "sm" | "md" | "lg";
    showText?: boolean;
}

export function OrbitalLoader({ size = "md", showText = true }: OrbitalLoaderProps) {
    const sizes = {
        sm: { logo: 80, orbit: 120 },
        md: { logo: 120, orbit: 180 },
        lg: { logo: 160, orbit: 240 },
    };

    const { logo, orbit } = sizes[size];

    return (
        <div className="flex flex-col items-center justify-center gap-6">
            {/* Orbital Animation Container */}
            <div className="relative" style={{ width: orbit, height: orbit }}>
                {/* Center Logo */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src="/learnorbit.png"
                        alt="LearnOrbit"
                        width={logo}
                        height={logo * 0.28}
                        className="w-auto"
                        style={{ height: logo * 0.28 }}
                    />
                </motion.div>

                {/* Outer Orbit Ring */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    {/* Orbiting Dot 1 */}
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg shadow-primary/50"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.div>

                {/* Middle Orbit Ring */}
                <motion.div
                    className="absolute inset-4 rounded-full border-2 border-blue-400/30 border-dashed"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                    {/* Orbiting Dot 2 */}
                    <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    />
                </motion.div>

                {/* Inner Orbit Ring */}
                <motion.div
                    className="absolute inset-8 rounded-full border border-cyan-300/40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                    {/* Orbiting Dot 3 */}
                    <motion.div
                        className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 1 }}
                    />
                </motion.div>
            </div>

            {/* Loading Text */}
            {showText && (
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.p
                        className="text-sm font-medium text-gray-600"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Loading your learning orbit...
                    </motion.p>
                </motion.div>
            )}
        </div>
    );
}

// Full Page Loading Screen
export function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 0)`,
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Animated Background Orbs */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            />

            {/* Orbital Loader */}
            <OrbitalLoader size="lg" />
        </div>
    );
}
