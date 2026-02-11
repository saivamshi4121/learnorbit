import Link from "next/link";
import { BookOpen, Clock, Users } from "lucide-react";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string | null;
    is_free: boolean;
    price: number | null;
    instructor: string;
    duration: string;
    students: number;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group bg-surface border border-borderLight rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-lg cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-44 bg-primary/5 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
            <BookOpen className="h-14 w-14 text-primary/40" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-semibold text-textPrimary mb-2 line-clamp-2 leading-snug">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-mutedText mb-4 line-clamp-2 leading-relaxed">
            {course.description}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-xs text-mutedText mb-3">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>{course.students.toLocaleString()}</span>
            </div>
          </div>

          {/* Instructor */}
          <p className="text-xs text-mutedText mb-4">
            by <span className="text-textPrimary font-medium">{course.instructor}</span>
          </p>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Section */}
          <div className="flex items-center justify-between pt-4 border-t border-borderLight">
            <div>
              {course.is_free ? (
                <span className="text-sm font-semibold text-success">Free</span>
              ) : (
                <span className="text-sm font-semibold text-textPrimary">
                  ${course.price?.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-xs font-medium text-primary group-hover:underline">
              View Course →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
