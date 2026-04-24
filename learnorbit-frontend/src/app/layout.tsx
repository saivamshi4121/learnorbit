import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { SmoothScrolling } from "@/components/ui/SmoothScrolling";
import { WelcomeAnimation } from "@/components/layout/WelcomeAnimation";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LearnOrbit - Online Learning Management System",
  description: "Empower your learning journey with LearnOrbit - a modern LMS platform for students, instructors, and administrators.",
  keywords: ["LMS", "Learning", "Education", "Online Courses", "LearnOrbit"],
  authors: [{ name: "LearnOrbit Team" }],
  icons: {
    icon: "/learnorbit.png",
    shortcut: "/learnorbit.png",
    apple: "/learnorbit.png",
  },
  openGraph: {
    title: "LearnOrbit - Online Learning Management System",
    description: "Empower your learning journey with LearnOrbit",
    type: "website",
    images: ["/learnorbit.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <WelcomeAnimation />
        <SmoothScrolling>
          {children}
          <Footer />
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </SmoothScrolling>
      </body>
    </html>
  );
}
