import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
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
  openGraph: {
    title: "LearnOrbit - Online Learning Management System",
    description: "Empower your learning journey with LearnOrbit",
    type: "website",
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
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}
