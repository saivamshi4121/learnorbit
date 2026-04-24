"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

interface StaticPageProps {
    title: string;
    description: string;
    content?: React.ReactNode;
}

export default function StaticPage({ title, description, content }: StaticPageProps) {
    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                <Link 
                    href="/" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                        {title}
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed mb-12">
                        {description}
                    </p>

                    <div className="h-px bg-slate-100 mb-12" />

                    {content ? (
                        <div className="prose prose-slate max-w-none">
                            {content}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                <Clock className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h2>
                            <p className="text-slate-500 text-center max-w-sm px-6">
                                We're currently crafting this page to provide you with the best experience. Check back shortly!
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
