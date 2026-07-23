import React from "react";
import { CheckCircle2, Target, Eye, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">

      {/* Hero */}
      <p className="eyebrow">About Us</p>
      <h1 className="mt-2 font-display text-4xl font-semibold leading-tight">
        Empowering students with skills for a successful future
      </h1>
      <p className="mt-5 text-base text-ink-600 leading-relaxed">
        Welcome to <strong>VEECAP CLASSES</strong>, one of the leading institutes for professional
        and skill-based education in Jodhpur. Founded with a vision to bridge the gap between
        education and industry, we believe that education should go beyond theory and prepare
        students for real-world success.
      </p>
      <p className="mt-4 text-base text-ink-600 leading-relaxed">
        We are a leading skill development institute dedicated to providing industry-focused training
        in digital marketing, graphic designing, AutoCAD, e-commerce, social media marketing, and
        other career-oriented courses. Our mission is to offer practical training that helps students
        build confidence and achieve their career goals.
      </p>

      {/* Quick highlights */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          "✔ Practical Training",
          "✔ Live Projects",
          "✔ Expert Mentors",
          "✔ Online & Offline Classes",
          "✔ Career Guidance & Certifications",
        ].map((item, i) => (
          <div key={i} className="card-ledger p-3 text-center text-xs font-semibold text-ink-700">
            {item}
          </div>
        ))}
      </div>

      {/* Vision & Mission */}
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card-ledger p-6">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-amber-600" />
            <p className="eyebrow">Our Vision</p>
          </div>
          <p className="mt-3 text-ink-600 leading-relaxed">
            To become the most trusted and innovative training institute in India by empowering
            students with practical skills, creativity, and industry knowledge. We strive to create
            a learning environment where students are encouraged to explore new ideas, develop
            confidence, and prepare themselves for future challenges.
          </p>
        </div>
        <div className="card-ledger p-6">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-600" />
            <p className="eyebrow">Our Mission</p>
          </div>
          <ul className="mt-3 space-y-2">
            {[
              "Provide industry-oriented courses with practical training.",
              "Prepare students with job-ready skills and professional confidence.",
              "Promote creativity, innovation and continuous learning.",
              "Prepare students for employment, freelancing and entrepreneurship.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Why Choose VeeCap */}
      <div className="mt-14">
        <p className="eyebrow">Why Choose VeeCap?</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">
          Quality courses that go beyond textbooks
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            { title: "Industry-Oriented Curriculum", text: "Our courses are designed according to current industry trends and market demands. We continuously update our syllabus to ensure students learn the latest tools, technologies and strategies used by professionals." },
            { title: "Practical Learning", text: "Skills are best learned through practice. Our training includes live projects, real-world assignments, portfolio development, hands-on exercises and interactive classroom sessions." },
            { title: "Expert Trainers", text: "Learn from experienced professionals who bring industry knowledge and practical insights into every classroom session." },
            { title: "Certified Courses", text: "Our courses are designed to help students earn recognized certifications and build strong professional portfolios." },
            { title: "Job Assistance", text: "From internships to job guidance, we assist students in taking the next step toward a successful career." },
            { title: "AI Tools & Automation", text: "We integrate the latest AI tools into our curriculum so students stay ahead in a competitive and fast-changing digital world." },
          ].map((f, i) => (
            <div key={i} className="card-ledger p-5">
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-600 leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Our Students */}
      <div className="mt-14">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-amber-600" />
          <p className="eyebrow">Our Students</p>
        </div>
        <h2 className="mt-2 font-display text-3xl font-semibold">
          The heart of VEECAP CLASSES
        </h2>
        <p className="mt-4 text-ink-600 leading-relaxed">
          At VEECAP CLASSES, students are at the center of everything we do. We take pride in
          seeing our students achieve success in jobs, freelance careers, higher education, and
          entrepreneurship. Their achievements inspire us to continue delivering quality education
          and creating new opportunities for future learners.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            "Students after 10th & 12th",
            "College Students",
            "Graduates",
            "Working Professionals",
            "Entrepreneurs",
            "Housewives",
            "Freelancers",
            "Career Changers",
          ].map((s, i) => (
            <div key={i} className="card-ledger p-4 text-center text-sm font-semibold text-ink-700">
              {s}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-ink-500 text-center">
          No prior experience required for most beginner courses. Basic computer knowledge is mandatory.
        </p>
      </div>

      {/* CTA */}
      <div className="mt-14 rounded-lg bg-ink-900 p-8 text-center text-white">
        <h2 className="font-display text-2xl font-semibold">
          Join VEECAP CLASSES today
        </h2>
        <p className="mt-2 text-ink-100/80">
          Take the first step toward a brighter and more successful future.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn-amber">
            Get Started
          </Link>
          <Link to="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
