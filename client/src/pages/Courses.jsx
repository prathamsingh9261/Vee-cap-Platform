import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronDown, X } from "lucide-react";
import api from "../api/api";
import CourseCard from "../components/CourseCard";

const categories = ["Career", "Arts", "Business", "Developer", "Science", "Law", "MBBS", "BCS"];
const levels = ["All levels", "Beginner", "Intermediate", "Advanced"];
const sortOptions = [
  { value: "", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

// Custom dropdown that doesn't cause mobile scroll jump
function Dropdown({ label, value, options, onChange, displayValue }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input-field flex items-center justify-between gap-2 !w-auto min-w-[140px] cursor-pointer"
      >
        <span className="truncate text-sm">
          {displayValue || label}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-ink-100 bg-white shadow-cardHover">
          <div className="py-1">
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-ink-50 ${!value ? "font-semibold text-amber-600" : "text-ink-700"}`}
            >
              {label}
            </button>
            {options.map((opt) => (
              <button
                key={typeof opt === "object" ? opt.value : opt}
                type="button"
                onClick={() => {
                  onChange(typeof opt === "object" ? opt.value : opt);
                  setOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-ink-50 ${
                  value === (typeof opt === "object" ? opt.value : opt)
                    ? "font-semibold text-amber-600"
                    : "text-ink-700"
                }`}
              >
                {typeof opt === "object" ? opt.label : opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Courses() {
  const [params, setParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.get("search") || "");

  const category = params.get("category") || "";
  const level = params.get("level") || "";
  const sort = params.get("sort") || "";

  useEffect(() => {
    setLoading(true);
    const query = {};
    if (category) query.category = category;
    if (level) query.level = level;
    if (sort) query.sort = sort;
    if (params.get("search")) query.search = params.get("search");

    api
      .get("/courses", { params: query })
      .then((res) => setCourses(res.data.courses))
      .finally(() => setLoading(false));
  }, [category, level, sort, params]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next);
  };

  const clearAll = () => {
    setSearch("");
    setParams({});
  };

  const hasFilters = category || level || sort || params.get("search");

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="eyebrow">Course Catalog</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Find your next course</h1>

      {/* Search bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateParam("search", search);
        }}
        className="mt-6 flex w-full items-center gap-2"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="input-field max-w-md"
        />
        <button type="submit" className="btn-primary !px-4 !py-2.5">
          <Search className="h-4 w-4" />
        </button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); updateParam("search", ""); }}
            className="btn-outline !px-3 !py-2.5"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Filters row */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Dropdown
          label="All Categories"
          value={category}
          options={categories}
          onChange={(v) => updateParam("category", v)}
          displayValue={category || ""}
        />
        <Dropdown
          label="All Levels"
          value={level}
          options={levels}
          onChange={(v) => updateParam("level", v)}
          displayValue={level || ""}
        />
        <Dropdown
          label="Sort By"
          value={sort}
          options={sortOptions}
          onChange={(v) => updateParam("sort", v)}
          displayValue={sortOptions.find((o) => o.value === sort)?.label || ""}
        />
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-900"
          >
            <X className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>

      {/* Active filter tags */}
      {hasFilters && (
        <div className="mt-3 flex flex-wrap gap-2">
          {category && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {category}
              <button onClick={() => updateParam("category", "")}><X className="h-3 w-3" /></button>
            </span>
          )}
          {level && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {level}
              <button onClick={() => updateParam("level", "")}><X className="h-3 w-3" /></button>
            </span>
          )}
          {params.get("search") && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              "{params.get("search")}"
              <button onClick={() => { setSearch(""); updateParam("search", ""); }}><X className="h-3 w-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <p className="mt-12 text-center text-ink-400">Loading courses...</p>
      ) : courses.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-ink-400">No courses match these filters.</p>
          <button onClick={clearAll} className="btn-amber mt-4">Clear filters</button>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-ink-500">{courses.length} courses found</p>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {courses.map((c) => (
              <CourseCard key={c._id} course={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
