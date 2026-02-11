"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthFrame } from "@/components/auth/AuthFrame";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { post } from "@/lib/api";
import { setTokens, setCurrentUser } from "@/lib/auth";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const data = await post<any>('/auth/login', { email, password });

            // Store tokens and user data
            setTokens(data.accessToken, data.refreshToken);
            setCurrentUser(data.user);

            toast.success("Login successful");

            // Redirect based on role
            if (data.user.role === 'instructor') {
                router.push('/instructor');
            } else if (data.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/student');
            }

        } catch (err: any) {
            console.error("Login failed:", err);
            setError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthFrame
            type="login"
            title="Welcome Back"
            subtitle="Enter your credentials to continue"
            footerText="Don't have an account?"
            footerLinkText="Create one"
            footerLink="/register"
        >
            <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                        {error}
                    </div>
                )}
                <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                        Email
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium bg-slate-50/50 focus:bg-white"
                            placeholder="you@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                            Password
                        </label>
                        <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                            Forgot password?
                        </a>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium bg-slate-50/50 focus:bg-white"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="flex items-center">
                    <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer transition-all"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 select-none cursor-pointer">
                        Keep me logged in
                    </label>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin h-6 w-6" />
                        ) : (
                            <>
                                Sign in
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </AuthFrame>
    );
}
