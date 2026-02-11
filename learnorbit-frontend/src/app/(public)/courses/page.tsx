import Link from "next/link";
import { BookOpen } from "lucide-react";
import { CourseCard } from "@/components/courses/CourseCard";

// Mock data for demonstration
const mockCourses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.",
    thumbnail_url: null,
    is_free: true,
    price: null,
    instructor: "John Doe",
    duration: "8 weeks",
    students: 1234,
  },
  {
    id: 2,
    title: "React for Beginners",
    description: "Master React and build interactive user interfaces with modern JavaScript.",
    thumbnail_url: null,
    is_free: false,
    price: 49.99,
    instructor: "Jane Smith",
    duration: "6 weeks",
    students: 856,
  },
  {
    id: 3,
    title: "Node.js Backend Development",
    description: "Build scalable backend applications with Node.js and Express.",
    thumbnail_url: null,
    is_free: false,
    price: 59.99,
    instructor: "Mike Johnson",
    duration: "10 weeks",
    students: 642,
  },
  {
    id: 4,
    title: "Database Design with PostgreSQL",
    description: "Learn database design principles and master PostgreSQL.",
    thumbnail_url: null,
    is_free: true,
    price: null,
    instructor: "Sarah Williams",
    duration: "4 weeks",
    students: 423,
  },
  {
    id: 5,
    title: "TypeScript Fundamentals",
    description: "Write safer, more maintainable code with TypeScript's powerful type system.",
    thumbnail_url: null,
    is_free: false,
    price: 39.99,
    instructor: "Alex Chen",
    duration: "5 weeks",
    students: 967,
  },
  {
    id: 6,
    title: "API Design Best Practices",
    description: "Design robust, scalable APIs following industry best practices and standards.",
    thumbnail_url: null,
    is_free: false,
    price: 54.99,
    instructor: "Maria Garcia",
    duration: "7 weeks",
    students: 531,
  },
];

export default function CoursesPage() {
  const hasNoCourses = mockCourses.length === 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-surface border-b border-borderLight">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            {/* Accent Bar */}
            <div className="flex items-start gap-4">
              <div className="w-1 h-12 bg-primary rounded-full flex-shrink-0" />
              <div>
                <h1 className="text-4xl font-semibold text-textPrimary mb-3 tracking-tight">
                  Explore Courses
                </h1>
                <p className="text-base text-mutedText leading-relaxed">
                  Structured learning paths built for serious developers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {hasNoCourses ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-mutedText" />
            </div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">
              No Courses Available
            </h3>
            <p className="text-sm text-mutedText max-w-sm">
              We're working on adding new courses. Check back soon for exciting learning opportunities!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      {!hasNoCourses && (
        <section className="bg-primary">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-semibold text-white mb-4 tracking-tight">
                Ready to Start Learning?
              </h2>
              <p className="text-base text-white/90 mb-8 leading-relaxed">
                Join thousands of students already learning on LearnOrbit.
              </p>
              <Link href="/register">
                <button className="bg-surface text-primary px-8 py-3 rounded-xl font-semibold hover:bg-white transition-colors duration-200 shadow-lg">
                  Create Free Account
                </button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
