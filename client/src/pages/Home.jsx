import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, BookOpen, Users,
  Award, Briefcase, Monitor, Star, CheckCircle2
} from "lucide-react";
import api from "../api/api";
import CourseCard from "../components/CourseCard";

const categories = ["Career", "Arts", "Business", "Developer", "Science", "Law", "MBBS", "BCS"];

// Fade-in on scroll hook
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// Animated counter
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useFadeIn();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// Section wrapper with fade-in
function FadeSection({ children, className = "", delay = 0 }) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [categorySummary, setCategorySummary] = useState({});

  useEffect(() => {
    api.get("/courses").then((res) => setCourses(res.data.courses.slice(0, 6)));
    api.get("/courses/categories/summary").then((res) => {
      const map = {};
      res.data.categories.forEach((c) => (map[c._id] = c.count));
      setCategorySummary(map);
    });
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-ink-900 pb-24 pt-20 md:pt-32">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 md:grid-cols-2">
          <div
            style={{ animation: "fadeSlideUp 0.8s ease forwards" }}
          >
            <span className="inline-block rounded-full border border-amber/30 bg-amber/10 px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-widest text-amber">
              Leading Institute — Jodhpur
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-white md:text-5xl lg:text-6xl">
              Learn in-demand skills &amp; build your{" "}
              <span className="text-amber">career</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
              We prepare students for the digital future through industry-focused courses
              and hands-on training. Confident, skilled, and career ready — that's our goal.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/courses" className="btn-amber !px-6 !py-3 text-base shadow-lg shadow-amber/30 hover:shadow-amber/50">
                Browse Courses <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                About VeeCap
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {["✔ Practical Training", "✔ Live Projects", "✔ Job Assistance", "✔ Certifications"].map((t, i) => (
                <span key={i} className="text-sm font-medium text-white/60">{t}</span>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div style={{ animation: "fadeSlideUp 0.8s ease 0.2s both" }}>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="font-mono text-xs font-semibold uppercase tracking-widest text-amber/80">
                Admission Open Now
              </p>
              <div className="mt-4 space-y-3">
                {[
                  "Digital Marketing with AI",
                  "Graphic Designing",
                  "Video Editing",
                  "AutoCAD Civil",
                  "Social Media Marketing",
                  "& 8 more courses...",
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-amber" />
                    <span className="text-sm text-white/80">{c}</span>
                  </div>
                ))}
              </div>
              <Link to="/courses" className="btn-amber mt-6 w-full justify-center">
                View All Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-b border-ink-100 bg-parchment py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 md:grid-cols-4">
          {[
            { target: 13, suffix: "+", label: "Courses Available" },
            { target: 100, suffix: "%", label: "Practical Training" },
            { target: 500, suffix: "+", label: "Students Trained" },
            { target: 7, suffix: "+", label: "Years Experience" },
          ].map((s, i) => (
            <FadeSection key={i} delay={i * 100} className="text-center">
              <p className="font-display text-4xl font-semibold text-ink-900">
                <Counter target={s.target} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-ink-500">{s.label}</p>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE VEECAP ── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <FadeSection className="text-center">
          <p className="eyebrow">Why Choose VeeCap?</p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            Quality courses that go beyond textbooks
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-600">
            At VEECAP CLASSES, we focus on delivering real skills — not just theory.
          </p>
        </FadeSection>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { icon: BookOpen, title: "Practical Learning", text: "Live projects, real-world assignments, portfolio development and hands-on exercises in every course." },
            { icon: Users, title: "Expert Mentors", text: "Learn from experienced professionals who bring real industry knowledge into every session." },
            { icon: Award, title: "Certified Courses", text: "Earn recognized certifications and build a portfolio that stands out to employers and clients." },
            { icon: Briefcase, title: "Job Assistance", text: "From internships to placement support — we help you take the next step in your career." },
            { icon: Monitor, title: "Online & Offline", text: "Attend at our Jodhpur institute or learn online — flexible options to fit your schedule." },
            { icon: Star, title: "AI Tools & Automation", text: "Learn the latest AI tools alongside core skills so you stay ahead in a changing industry." },
          ].map((f, i) => (
            <FadeSection key={i} delay={i * 80}
              className="group rounded-xl border border-ink-100 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:border-amber/40 hover:shadow-cardHover"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber/10 transition group-hover:bg-amber/20">
                <f.icon className="h-6 w-6 text-amber-600" strokeWidth={1.8} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.text}</p>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-ink-900 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <FadeSection className="text-center">
            <p className="eyebrow text-amber/80">Browse by Category</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
              Explore our subjects
            </h2>
          </FadeSection>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((cat, i) => (
              <FadeSection key={cat} delay={i * 60}>
                <Link
                  to={`/courses?category=${cat}`}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-5 text-center transition hover:border-amber/40 hover:bg-white/10"
                >
                  <span className="font-display text-base font-semibold text-white group-hover:text-amber">
                    {cat}
                  </span>
                  <span className="font-mono text-xs text-white/40">
                    {categorySummary[cat] || 0} courses
                  </span>
                </Link>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <FadeSection className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Our Courses</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
              Popular courses
            </h2>
          </div>
          <Link to="/courses" className="hidden text-sm font-semibold text-ink hover:text-amber-600 sm:block">
            View all →
          </Link>
        </FadeSection>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {courses.map((c, i) => (
            <FadeSection key={c._id} delay={i * 80}>
              <CourseCard course={c} />
            </FadeSection>
          ))}
        </div>

        <FadeSection className="mt-10 text-center">
          <Link to="/courses" className="btn-primary !px-8 !py-3 text-base">
            View All 13 Courses <ArrowRight className="h-5 w-5" />
          </Link>
        </FadeSection>
      </section>

      {/* ── WHO IS THIS FOR ── */}
      <section className="border-y border-ink-100 bg-parchment py-20">
        <FadeSection className="mx-auto max-w-6xl px-5 text-center">
          <p className="eyebrow">Our Students</p>
          <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">
            Who studies at VeeCap?
          </h2>
          <p className="mt-3 text-ink-500">No prior experience required for most beginner courses.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              "Students after 10th & 12th", "College Students", "Graduates",
              "Working Professionals", "Entrepreneurs", "Housewives", "Freelancers", "Career Changers",
            ].map((s, i) => (
              <span key={i} className="rounded-full border border-ink-100 bg-white px-5 py-2 text-sm font-semibold text-ink-700 shadow-card transition hover:border-amber/40 hover:shadow-cardHover">
                {s}
              </span>
            ))}
          </div>
        </FadeSection>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative overflow-hidden bg-ink-900 py-20 text-center">
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-amber/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber/10 blur-3xl" />
        <FadeSection className="relative mx-auto max-w-2xl px-5">
          <p className="eyebrow text-amber/80">Admission Open</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">
            Join VEECAP CLASSES today
          </h2>
          <p className="mt-3 text-white/70">
            Take the first step toward a brighter and more successful future.
            Enroll now and start your journey with us.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-amber !px-8 !py-3 text-base shadow-lg shadow-amber/30">
              Create your free account <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Contact Us
            </Link>
          </div>
        </FadeSection>
      </section>

      {/* ── FLOATING WHATSAPP BUTTON ── */}
      <a
        href="https://wa.me/919057720726"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg transition hover:bg-green-600 hover:scale-110"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
