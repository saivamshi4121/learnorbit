"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, Rocket, ArrowRight, Zap, Terminal } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";
import { getAllCourses, Course } from "@/lib/services/courses.service";
import { motion } from "framer-motion";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses();
        if (response.success) {
          setCourses(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const hasNoCourses = courses.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Dynamic Header Section */}
      <section className="relative bg-slate-900 py-24 lg:py-32 overflow-hidden">
         {/* Background Decor */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
         <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05] -z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-blue-300 mb-8 border border-white/10"
            >
                <Sparkles className="h-4 w-4" />
                <span>Modern Learning Platform</span>
            </motion.div>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]"
            >
              Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Craft.</span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-400 leading-relaxed max-w-2xl"
            >
              Structured learning paths built for serious developers. Zero fluff, just deep-dives into production-ready technologies.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
        {loading ? (
            /* Loading State */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                    <div key={n} className="h-[400px] rounded-3xl bg-slate-100 animate-pulse" />
                ))}
            </div>
        ) : hasNoCourses ? (
          /* "Coming Soon" Ultra-Premium Empty State */
          <div className="relative">
            <div className="flex flex-col items-center justify-center text-center py-12 lg:py-20 px-4">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-10 shadow-2xl shadow-blue-500/30"
                >
                    <Rocket className="h-10 w-10 text-white" />
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                        Courses are <span className="text-blue-600">Coming Soon.</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-xl mx-auto mb-12 leading-relaxed">
                        We're currently curating project-based curriculum designed by senior engineers. 
                        Sign up below to get early access and exclusive discounts.
                    </p>
                </motion.div>

                {/* Notify Form */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-md mx-auto"
                >
                    <div className="flex p-1 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
                        <input 
                            type="email" 
                            placeholder="your@email.com"
                            className="flex-1 bg-transparent px-5 py-3 text-slate-900 outline-none text-sm"
                        />
                        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors">
                            Notify Me
                        </button>
                    </div>
                    <p className="mt-4 text-xs text-slate-400">Join 2,400+ developers on the waitlist.</p>
                </motion.div>
            </div>

            {/* Feature Teasers */}
            <div className="grid md:grid-cols-3 gap-8 mt-24">
                {[
                    { title: "Project-Based", icon: Terminal, desc: "Build real production apps, not just tutorials." },
                    { title: "Senior Mentors", icon: Zap, desc: "Get feedback from engineers at top tech companies." },
                    { title: "Certifications", icon: BookOpen, desc: "Earn credentials recognized by industry leaders." }
                ].map((feat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <feat.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-3">{feat.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                    </motion.div>
                ))}
            </div>
          </div>
        ) : (
          /* Dynamic Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      {!loading && !hasNoCourses && (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-50" />
             <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
                    Start Your Learning Journey Today
                </h2>
                <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                    Join thousands of developers leveling up their skills with project-based learning.
                </p>
                <Link href="/register">
                    <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-2xl flex items-center gap-2 mx-auto">
                        Create Free Account <ArrowRight className="w-5 h-5" />
                    </button>
                </Link>
             </div>
        </section>
      )}
    </div>
  );
}
