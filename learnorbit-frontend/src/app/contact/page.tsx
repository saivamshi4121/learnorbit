"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Mail,
    MapPin,
    Phone,
    Send,
    MessageSquare,
    Twitter,
    Linkedin,
    Github,
    Clock,
    CheckCircle2,
    HelpCircle,
    ArrowRight,
    Loader2,
    ChevronDown,
    ChevronUp,
    Globe
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MarqueeBanner } from "@/components/ui/MarqueeBanner";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    const faqs = [
        {
            question: "Do you offer enterprise solutions?",
            answer: "Yes, we provide custom enterprise plans with dedicated support, SSO integration, and bulk licensing. Contact our sales team for details."
        },
        {
            question: "Can I get a refund if I'm not satisfied?",
            answer: "Absolutely. We offer a 30-day money-back guarantee on all our courses. No questions asked."
        },
        {
            question: "Do you provide mentorship?",
            answer: "Yes, our Pro subscription includes direct access to mentor office hours and code reviews."
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Banner & Nav (Simplified version for Contact Page) */}
            {/* Banner & Nav - utilizing the global component */}
            <div className="fixed top-0 left-0 right-0 z-[60]">
                {/* Note: Navbar component includes logic for positioning, but since we want Marquee + Navbar here too, 
                    we can just use the Navbar component which we might need to adjust or just replicate the layout structure if Navbar includes Marquee? 
                    Actually, the new Navbar component in src/components/layout/Navbar.tsx does NOT include the Marquee. 
                    The PageNavbar wrapper in page.tsx included it.
                    Let's replicate that wrapper structure here or update Navbar to optionally include it?
                    The user asked for "professional navbar". 
                    Let's use the MarqueeBanner + Navbar combo pattern.
                */}
                <MarqueeBanner />
            </div>
            <Navbar />

            {/* Main Content */}
            <main className="pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                        <MessageSquare className="w-4 h-4" />
                        Let's chat
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                        Get in touch with our team
                    </h1>
                    <p className="text-lg text-slate-600">
                        We'd love to hear from you. Whether you have a question about features, pricing, or need a demo, our team is ready to answer all your questions.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Contact Info & FAQ */}
                    <div className="space-y-8">
                        {/* Status Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                                </div>
                                <span className="font-medium text-slate-900">Support is currently online</span>
                            </div>
                            <p className="text-sm text-slate-500 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                Wait time: Usually &lt; 5 minutes
                            </p>
                        </div>

                        {/* Contact Methods */}
                        <div className="grid sm:grid-cols-2 gap-4">
                            <a href="mailto:support@learnorbit.com" className="group p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-1">Email Support</h3>
                                <p className="text-sm text-slate-500">support@learnorbit.com</p>
                            </a>

                            <a href="#" className="group p-4 bg-white rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-1">Live Chat</h3>
                                <p className="text-sm text-slate-500">Available 9am - 5pm EST</p>
                            </a>

                            <a href="#" className="group p-4 bg-white rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-md transition-all">
                                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    <Twitter className="w-5 h-5 text-sky-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-1">Twitter</h3>
                                <p className="text-sm text-slate-500">@LearnOrbitSupport</p>
                            </a>

                            <div className="p-4 bg-white rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mb-3">
                                    <MapPin className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-1">Headquarters</h3>
                                <p className="text-sm text-slate-500">San Francisco, CA</p>
                            </div>
                        </div>

                        {/* FAQ Accordion */}
                        <div className="space-y-4 pt-8">
                            <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
                            <div className="space-y-2">
                                {faqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-slate-100 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-300"
                                    >
                                        <button
                                            onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                            className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-700 hover:bg-slate-50/50 transition-colors"
                                        >
                                            {faq.question}
                                            {activeFaq === index ? (
                                                <ChevronUp className="w-5 h-5 text-slate-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-slate-400" />
                                            )}
                                        </button>
                                        {activeFaq === index && (
                                            <div className="px-4 pb-4 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-50 bg-slate-50/30">
                                                <div className="pt-2">{faq.answer}</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="relative">
                        {/* Design Element */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -z-10" />

                        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-10 text-white">
                                <h2 className="text-2xl font-bold mb-2">Send us a message</h2>
                                <p className="text-blue-100">Fill out the form below and we'll get back to you as soon as possible.</p>
                            </div>

                            <div className="p-6 sm:p-10">
                                {isSuccess ? (
                                    <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in duration-500">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900">Message Sent!</h3>
                                        <p className="text-slate-600 max-w-xs mx-auto">
                                            Thanks for reaching out. Our team will review your message and get back to you shortly.
                                        </p>
                                        <button
                                            onClick={() => setIsSuccess(false)}
                                            className="mt-6 text-blue-600 font-medium hover:text-blue-700"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="firstName" className="text-sm font-medium text-slate-700">First Name</label>
                                                <input
                                                    type="text"
                                                    id="firstName"
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400"
                                                    placeholder="John"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last Name</label>
                                                <input
                                                    type="text"
                                                    id="lastName"
                                                    required
                                                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
                                            <select
                                                id="subject"
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-700 bg-white"
                                            >
                                                <option>General Inquiry</option>
                                                <option>Technical Support</option>
                                                <option>Billing Question</option>
                                                <option>Partnership Opportunity</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                                            <textarea
                                                id="message"
                                                required
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 resize-none"
                                                placeholder="How can we help you today?"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="w-5 h-5" />
                                                </>
                                            )}
                                        </button>

                                        <p className="text-xs text-center text-slate-400">
                                            By submitting this form, you agree to our <a href="#" className="underline hover:text-blue-600">Privacy Policy</a>.
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer (Simplified) */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center sm:text-left grid sm:grid-cols-4 gap-8">
                    <div className="sm:col-span-2">
                        <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2 justify-center sm:justify-start">
                            <Globe className="w-5 h-5" />
                            LearnOrbit
                        </h3>
                        <p className="text-sm max-w-xs mx-auto sm:mx-0">
                            Structured learning for developers who want to build real products and advance their careers.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-3">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-3">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
}
