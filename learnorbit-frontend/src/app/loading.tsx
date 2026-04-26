"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center">
            <div className="relative">
                {/* Orbital Rings */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-20px] rounded-full border-2 border-primary/20 border-t-primary"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-40px] rounded-full border border-dashed border-slate-200"
                />
                
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-white p-4 rounded-2xl"
                >
                    <Image
                        src="/learnorbit.png"
                        alt="Loading LearnOrbit"
                        width={180}
                        height={50}
                        className="w-32 h-auto"
                        priority
                    />
                </motion.div>
            </div>
            
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12 flex flex-col items-center gap-2"
            >
                <p className="text-slate-500 font-medium tracking-widest uppercase text-[10px]">Entering Orbit</p>
                <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1 h-1 bg-primary rounded-full"
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
