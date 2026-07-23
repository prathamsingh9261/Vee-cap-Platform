import React from "react";
import { Link } from "react-router-dom";
import { Clock, BarChart3, Star, ArrowRight } from "lucide-react";

export default function CourseCard({ course }) {
  const price = course.discountPrice ?? course.price;
  const isFree = price === 0;

  return (
    <Link
      to={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-amber/30 hover:shadow-cardHover"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/9] overflow-hidden bg-ink-50">
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-ink-900/0 transition duration-300 group-hover:bg-ink-900/20" />
        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-ink shadow-sm">
          {course.category}
        </span>
        {/* Free badge */}
        {isFree && (
          <span className="absolute right-3 top-3 rounded-full bg-green-500 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-wide text-white">
            Free
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 font-mono text-xs text-ink-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {course.totalDurationMinutes || 0} min
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="h-3.5 w-3.5" />
            {course.level}
          </span>
        </div>

        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink-900 transition group-hover:text-amber-600">
          {course.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-ink-500">
          {course.shortDescription}
        </p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-ink-500">
            <Star className="h-3.5 w-3.5 fill-amber text-amber" />
            <span>{course.ratingAverage?.toFixed(1) || "New"}</span>
            <span className="text-ink-300">·</span>
            <span>{course.studentsCount || 0} students</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-base font-bold text-ink-900">
              {isFree ? "Free" : `₹${price.toLocaleString("en-IN")}`}
            </span>
          </div>
        </div>

        {/* Enroll button - appears on hover */}
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-amber-600 opacity-0 transition duration-300 group-hover:opacity-100">
          View Course <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}
