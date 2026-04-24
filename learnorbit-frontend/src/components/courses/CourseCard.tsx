import Link from "next/link";
import { BookOpen, Clock, Users } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string | number;
    title: string;
    description: string | null;
    thumbnail_url?: string | null;
    is_free?: boolean;
    price?: number | null;
    instructor?: string;
    instructorName?: string;
    duration?: string;
    students?: number;
    enrollment_count?: number;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const displayInstructor = course.instructor || course.instructorName || "Expert Instructor";
  const displayStudents = course.students || course.enrollment_count || 0;
  const displayDuration = course.duration || "Self-paced";

  return (
    <Link href={`/courses/${course.id}`}>
      <div className="group bg-surface border border-borderLight rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-44 bg-gradient-to-br from-primary/10 to-indigo-600/10 overflow-hidden">
          {course.thumbnail_url ? (
            <img 
                src={course.thumbnail_url} 
                alt={course.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <BookOpen className="h-16 w-16 text-primary/30" />
            </div>
          )}
          
          {/* Badge */}
          <div className="absolute top-4 right-4">
             {course.is_free ? (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Free</span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Premium</span>
              )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-textPrimary mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-mutedText mb-6 line-clamp-2 leading-relaxed">
            {course.description || "No description provided."}
          </p>

          {/* Meta Info */}
          <div className="flex items-center gap-5 text-[11px] font-medium text-slate-500 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary/60" />
              <span>{displayDuration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary/60" />
              <span>{displayStudents.toLocaleString()} Students</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                {displayInstructor.charAt(0)}
            </div>
            <p className="text-xs text-mutedText">
              by <span className="text-textPrimary font-semibold">{displayInstructor}</span>
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom Section */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              {course.is_free ? (
                <span className="text-base font-bold text-emerald-600">Start Free</span>
              ) : (
                <span className="text-base font-bold text-textPrimary">
                  {course.price ? `$${course.price.toFixed(2)}` : "TBA"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
              View Details <span className="text-base">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
