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
  Code2
} from "lucide-react";
import { MarqueeBanner } from "@/components/ui/MarqueeBanner";
import { Navbar } from "@/components/layout/Navbar";

/* ============================================
   NAVBAR
   ============================================ */
function PageNavbar() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60]">
        <MarqueeBanner />
      </div>
      <Navbar />
    </>
  );
}

/* ============================================
   HERO SECTION
   ============================================ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 px-4 py-2 rounded-full text-sm font-medium text-primary mb-8">
              <Sparkles className="h-4 w-4" />
              <span>New: Advanced React Patterns course live</span>
              <ChevronRight className="h-4 w-4" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-textPrimary mb-8 tracking-tight leading-[1.05]">
              Learn to build
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent"> real products</span>
              </span>
              <br />not just tutorials.
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-mutedText mb-10 max-w-xl leading-relaxed">
              Structured courses designed by senior engineers. Build production-grade projects and land your dream job.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-12">
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
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6">
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
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            {/* Main Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl shadow-black/10 border border-gray-100 overflow-hidden">
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
                  <div className="h-full w-[68%] bg-gradient-to-r from-primary to-cyan-400 rounded-full" />
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
                    <div
                      key={i}
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
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100 animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-textPrimary">92%</p>
                  <p className="text-xs text-mutedText">Completion rate</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-textPrimary">Certificate Ready</p>
                  <p className="text-xs text-mutedText">Share on LinkedIn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   LOGOS SECTION
   ============================================ */
function LogosSection() {
  const companies = ["Google", "Microsoft", "Amazon", "Meta", "Netflix", "Stripe"];

  return (
    <section className="py-16 border-y border-gray-100 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-sm text-mutedText mb-8">
          Our students work at top companies worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-16">
          {companies.map((company) => (
            <span
              key={company}
              className="text-2xl font-bold text-gray-300 hover:text-gray-400 transition-colors cursor-default"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

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
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6">
            <Zap className="h-4 w-4" />
            Why LearnOrbit
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-textPrimary mb-6 tracking-tight">
            Everything you need to become a{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              10x developer
            </span>
          </h2>
          <p className="text-xl text-mutedText">
            We've helped thousands of developers level up their skills and land jobs at top companies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   COURSES PREVIEW SECTION
   ============================================ */
function CoursesSection() {
  const courses = [
    {
      title: "React & Next.js Masterclass",
      description: "Build production-ready apps with the latest React patterns",
      students: "2,450",
      hours: "45",
      level: "Intermediate",
      gradient: "from-blue-600 to-cyan-500",
      tag: "Bestseller",
    },
    {
      title: "Node.js Backend Development",
      description: "APIs, databases, authentication, and deployment",
      students: "1,890",
      hours: "38",
      level: "Beginner",
      gradient: "from-green-600 to-emerald-500",
      tag: "New",
    },
    {
      title: "System Design Interview",
      description: "Design scalable systems and ace your interviews",
      students: "1,230",
      hours: "32",
      level: "Advanced",
      gradient: "from-purple-600 to-pink-500",
      tag: "Popular",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6">
              <BookOpen className="h-4 w-4" />
              Popular Courses
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-textPrimary tracking-tight">
              Start your journey today
            </h2>
          </div>
          <Link href="/courses">
            <button className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              View all courses <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <div
              key={i}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-black/10 hover:-translate-y-2 transition-all duration-500"
            >
              {/* Image Area */}
              <div className={`h-48 bg-gradient-to-br ${course.gradient} p-6 relative`}>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {course.tag}
                </div>
                <div className="absolute bottom-6 left-6">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Code2 className="h-7 w-7 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {course.level}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-textPrimary mb-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-mutedText mb-6">{course.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-mutedText">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.students}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.hours}h
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-6">
            <Star className="h-4 w-4" />
            Testimonials
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-textPrimary mb-6 tracking-tight">
            Loved by developers worldwide
          </h2>
          <p className="text-xl text-mutedText">
            Join thousands of developers who have accelerated their careers with LearnOrbit.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
            <div key={i} className="text-center">
              <p className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                {stat.value}
              </p>
              <p className="text-gray-400 text-lg">{stat.label}</p>
            </div>
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
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="relative rounded-[2.5rem] overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-purple-700" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative px-8 py-20 lg:px-20 lg:py-28">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
                Ready to level up your skills?
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Join 50,000+ developers who are building their dream careers with structured, project-based learning.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <button className="w-full sm:w-auto bg-white text-textPrimary px-10 py-5 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                    Start Learning Free
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
                <Link href="/courses">
                  <button className="w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-full text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
                    Browse Courses
                  </button>
                </Link>
              </div>
              <p className="text-white/60 text-sm mt-8">
                No credit card required · Free forever plan available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER
   ============================================ */
function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">LearnOrbit</span>
            </Link>
            <p className="text-gray-400 max-w-sm mb-6">
              Structured learning for developers who want to build real products and advance their careers.
            </p>
            <div className="flex items-center gap-4">
              {["Twitter", "GitHub", "Discord", "YouTube"].map((social) => (
                <button
                  key={social}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <span className="text-xs font-medium">{social[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {[
            { title: "Platform", links: ["Courses", "Pricing", "Enterprise", "Careers"] },
            { title: "Resources", links: ["Blog", "Tutorials", "Community", "Events"] },
            { title: "Company", links: ["About", "Contact", "Privacy", "Terms"] },
          ].map((column) => (
            <div key={column.title}>
              <p className="font-semibold mb-4">{column.title}</p>
              <div className="space-y-3">
                {column.links.map((link) => (
                  <Link
                    key={link}
                    href={`/${link.toLowerCase()}`}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 LearnOrbit. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Made with ❤️ for developers
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ============================================
   CUSTOM ANIMATIONS (Add to globals.css)
   ============================================ */
// Add this to your globals.css:
// @keyframes bounce-slow {
//   0%, 100% {transform: translateY(0); }
//   50% {transform: translateY(-10px); }
// }
// .animate-bounce-slow {
//   animation: bounce-slow 3s ease-in-out infinite;
// }

/* ============================================
   MAIN PAGE
   ============================================ */
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
      <Footer />
    </div>
  );
}
