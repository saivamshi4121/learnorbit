"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Play,
  FileText,
  File,
  BookOpen,
  Users,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  TrendingUp,
  Shield,
  Sparkles,
  Code2,
  Terminal,
  Layout,
  GraduationCap
} from "lucide-react";
import { MarqueeBanner } from "@/components/ui/MarqueeBanner";
import { Navbar } from "@/components/layout/Navbar";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ============================================
   NAVBAR
   ============================================ */
function PageNavbar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60]">
        <MarqueeBanner />
        <motion.div
          className="h-1 bg-primary origin-left"
          style={{ scaleX }}
        />
      </div>
      <Navbar />
    </>
  );
}

/* ============================================
   HERO SECTION
   ============================================ */
function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20 lg:py-0">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl "
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl "
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl "
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 px-4 py-2 rounded-full text-sm font-medium text-primary mb-8"
            >
              <Sparkles className="h-4 w-4" />
              <span>New: Advanced React Patterns course live</span>
              <ChevronRight className="h-4 w-4" />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-textPrimary mb-8 tracking-tight leading-[1.05]"
            >
              Learn to build
              <span className="relative inline-block mx-2">
                <motion.span
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 0.8, ease: "circOut" }}
                  className="absolute bottom-2 left-0 h-3 bg-primary/20 -z-10"
                />
                <span className="relative z-10 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">real products</span>
              </span>
              <br />not just tutorials.
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-mutedText mb-10 max-w-xl leading-relaxed"
            >
              Structured courses designed by senior engineers. Build production-grade projects and land your dream job.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row items-start gap-4 mb-12"
            >
              <Link href="/courses">
                <button className="group relative bg-textPrimary text-white px-8 py-4 rounded-full text-lg font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Learning Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              <button className="flex items-center gap-3 text-mutedText hover:text-textPrimary transition-colors group">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <Play className="h-5 w-5 text-textPrimary ml-0.5" />
                </div>
                <span className="font-medium">Watch Demo</span>
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs font-bold text-gray-600"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-mutedText">
                  <span className="font-semibold text-textPrimary">4.9/5</span> from 2,500+ students
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <div className="relative hidden lg:block h-full">
            <motion.div style={{ y: y1 }} className="absolute right-0 top-0 w-full h-full flex items-center justify-center">
              {/* Main Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden w-[90%]"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
                        <Code2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">React Masterclass</p>
                        <p className="text-gray-400 text-sm">Pro Course</p>
                      </div>
                    </div>
                    <div className="bg-success/20 text-success px-3 py-1 rounded-full text-xs font-medium">
                      Bestseller
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">68%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "68%" }}
                      transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm font-medium text-mutedText mb-4">Current Module</p>

                  <div className="space-y-3">
                    {[
                      { title: "Advanced Hooks Patterns", done: true },
                      { title: "State Management Deep Dive", done: true },
                      { title: "Performance Optimization", current: true },
                      { title: "Testing Best Practices", done: false },
                    ].map((lesson, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + (i * 0.1) }}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${lesson.current
                          ? "bg-primary/5 border border-primary/20"
                          : "hover:bg-gray-50"
                          }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lesson.done
                          ? "bg-success/10"
                          : lesson.current
                            ? "bg-primary/10"
                            : "bg-gray-100"
                          }`}>
                          {lesson.done ? (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          ) : lesson.current ? (
                            <Play className="h-4 w-4 text-primary" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                          )}
                        </div>
                        <span className={`text-sm ${lesson.current ? "font-medium text-textPrimary" : "text-mutedText"}`}>
                          {lesson.title}
                        </span>
                        {lesson.current && (
                          <span className="ml-auto text-xs bg-primary text-white px-2 py-1 rounded-md">
                            Continue
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating Cards */}
              <motion.div
                style={{ y: y2 }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-12 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-textPrimary">92%</p>
                    <p className="text-xs text-mutedText">Completion rate</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, type: "spring" }}
                className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-textPrimary">Certificate Ready</p>
                    <p className="text-xs text-mutedText">Share on LinkedIn</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   LOGOS SECTION
   ============================================ */
/* ============================================
   LOGOS SECTION
   ============================================ */
function LogosSection() {
  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Stripe", "Uber", "Airbnb", "Spotify"];

  return (
    <section className="py-16 border-y border-gray-100 bg-gray-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
        <p className="text-center text-sm text-mutedText">
          Our students work at top companies worldwide
        </p>
      </div>

      <div className="flex relative">
        <motion.div
          animate={{ x: "-50%" }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-16 whitespace-nowrap px-8"
        >
          {[...companies, ...companies].map((company, i) => (
            <span
              key={i}
              className="text-2xl font-bold text-gray-300 hover:text-gray-400 transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ============================================
   FEATURES SECTION
   ============================================ */
/* ============================================
   FEATURES SECTION
   ============================================ */
function FeaturesSection() {
  const features = [
    {
      icon: BookOpen,
      title: "Project-Based Learning",
      description: "Build 10+ real projects that you can showcase in your portfolio. No toy examples.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Expert Mentorship",
      description: "Learn from senior engineers at FAANG companies with 10+ years of experience.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Career Support",
      description: "Resume reviews, mock interviews, and direct referrals to partner companies.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Shield,
      title: "Lifetime Access",
      description: "Access all course updates forever. Learn at your own pace, on your own schedule.",
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6"
          >
            <Zap className="h-4 w-4" />
            Why LearnOrbit
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-textPrimary mb-6 tracking-tight"
          >
            Everything you need to become a{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              10x developer
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-mutedText"
          >
            We've helped thousands of developers level up their skills and land jobs at top companies.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 hover:border-gray-200 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-textPrimary mb-4">{feature.title}</h3>
              <p className="text-lg text-mutedText leading-relaxed">{feature.description}</p>

              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="h-6 w-6 text-gray-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   COURSES PREVIEW SECTION
   ============================================ */
/* ============================================
   COURSES PREVIEW SECTION
   ============================================ */
function CoursesSection() {
  return (
    <section className="py-24 lg:py-32 bg-gray-50 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6"
          >
            <Sparkles className="h-4 w-4" />
            Exciting Updates Ahead
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold text-textPrimary tracking-tight mb-8"
          >
            Courses are <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Coming Soon.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-mutedText mb-12"
          >
            We are curating high-quality, project-based courses designed by industry experts. 
            Be the first to know when we launch and get an exclusive early-bird discount.
          </motion.p>

          {/* Waitlist Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="max-w-md mx-auto mb-20"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex p-2 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-black/5">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                />
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center gap-2">
                  Notify Me <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Terminal, title: "Pro Projects", desc: "Real-world apps you can deploy." },
              { icon: Layout, title: "System Design", desc: "Architecting for millions of users." },
              { icon: GraduationCap, title: "Certification", desc: "Industry-recognized credentials." }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-white shadow-sm flex items-center gap-4 text-left"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <card.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{card.title}</h4>
                  <p className="text-xs text-slate-500">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   TESTIMONIALS SECTION
   ============================================ */
/* ============================================
   TESTIMONIALS SECTION
   ============================================ */
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "LearnOrbit completely transformed my career. The structured approach helped me land a job at Google within 6 months.",
      author: "Priya Sharma",
      role: "Software Engineer at Google",
      avatar: "PS",
    },
    {
      quote: "Best investment I've made in my career. The projects I built here became my portfolio pieces that got me hired.",
      author: "Rahul Verma",
      role: "Senior Developer at Microsoft",
      avatar: "RV",
    },
    {
      quote: "Unlike other platforms, LearnOrbit focuses on real skills. I went from junior to senior in just 2 years.",
      author: "Ananya Patel",
      role: "Tech Lead at Stripe",
      avatar: "AP",
    },
  ];

  return (
    <section id="testimonials" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6"
          >
            <Star className="h-4 w-4" />
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-textPrimary mb-6 tracking-tight"
          >
            Loved by developers worldwide
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-mutedText"
          >
            Join thousands of developers who have accelerated their careers with LearnOrbit.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg text-textPrimary mb-8 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-textPrimary">{testimonial.author}</p>
                  <p className="text-sm text-mutedText">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   STATS SECTION
   ============================================ */
/* ============================================
   STATS SECTION
   ============================================ */
function StatsSection() {
  const stats = [
    { value: "50K+", label: "Students Enrolled" },
    { value: "45", label: "Expert Courses" },
    { value: "92%", label: "Success Rate" },
    { value: "4.9", label: "Average Rating" },
  ];

  return (
    <section className="py-20 bg-textPrimary relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className="text-center"
            >
              <p className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                {stat.value}
              </p>
              <p className="text-gray-400 text-lg">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ============================================
   CTA SECTION
   ============================================ */
function CTASection() {
  return (
    <section className="py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-gray-900 rounded-[2.5rem] px-6 py-24 text-center shadow-2xl sm:px-16 lg:py-32">
          {/* Orbital Background Animation */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              style={{ x: "-50%", y: "-50%" }}
              className="absolute top-1/2 left-1/2 w-[600px] h-[600px] rounded-full border border-white/5"
            />
            <motion.div
              style={{ x: "-50%", y: "-50%" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full border border-white/10"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full blur-[2px] shadow-[0_0_20px_rgba(37,99,235,1)]" />
            </motion.div>
            <motion.div
              style={{ x: "-50%", y: "-50%" }}
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full border border-white/5 border-dashed"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-purple-500 rounded-full blur-[2px] shadow-[0_0_20px_rgba(168,85,247,1)]" />
            </motion.div>

            {/* Glowing Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/20 blur-[100px] rounded-full opacity-50" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/20 blur-[80px] rounded-full opacity-40" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-white mb-8 border border-white/10"
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
              <span>Limited Time Offer</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight"
            >
              Ready to enter the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                LMS Orbit?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-300 mb-10 leading-relaxed"
            >
              Join a universe of 50,000+ developers building their future.
              Get unlimited access to all courses, projects, and career paths.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/register">
                <button className="group relative bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-bold overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Your Orbit
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              <Link href="/courses">
                <button className="px-8 py-4 rounded-full text-lg font-semibold text-white border border-white/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  View Flight Plan
                </button>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-sm text-gray-500"
            >
              30-day money-back guarantee · Cancel anytime
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <PageNavbar />
      <HeroSection />
      <LogosSection />
      <FeaturesSection />
      <CoursesSection />
      <TestimonialsSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}
