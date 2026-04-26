"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 text-center"
            >
                <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Systems Malfunction</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    We've encountered an unexpected turbulence in the orbit. Our engineers have been notified.
                </p>
                
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Attempt Re-entry
                    </button>
                    
                    <Link href="/">
                        <button className="flex items-center justify-center gap-2 w-full py-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95">
                            <Home className="w-5 h-5" />
                            Abort to Home
                        </button>
                    </Link>
                </div>
                
                <p className="mt-8 text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    Error Digest: {error.digest || "Internal Runtime Error"}
                </p>
            </motion.div>
        </div>
    );
}
