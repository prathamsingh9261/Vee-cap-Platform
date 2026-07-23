import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "What is VEECAP CLASSES?",
    a: "VEECAP CLASSES is a leading skill development institute in Jodhpur offering certificate courses in digital marketing, graphic designing, video editing, AutoCAD, website designing, freelancing and many such courses. Our courses are designed to provide practical knowledge, industry exposure and career focused skills."
  },
  {
    q: "Why should I choose VEECAP?",
    a: "100% Practical Learning, Live Campaign Experience, Portfolio Building, Job Assistance, AI Tools & Automation, Internship & Placement Support, and Hands-on Projects."
  },
  {
    q: "Who can join VEECAP CLASSES?",
    a: "Students after 10th & 12th, College Students, Graduates, Working Professionals, Entrepreneurs, Housewives looking to restart careers, and Freelancers. No prior experience is required for most beginner courses. Basic computer knowledge is mandatory."
  },
  {
    q: "Are the courses practical or theory based?",
    a: "Our courses are 100% practical. Students learn through live projects, real world assignments, portfolio building, practical sessions, and interactive workshops."
  },
  {
    q: "Do you provide certificates?",
    a: "Yes. After successfully completing the course, students receive a certificate that validates their skills and enhances their professional profile."
  },
  {
    q: "Do you offer internships?",
    a: "Yes. Many of our courses include internship opportunities where students work on live projects and gain real world experience."
  },
  {
    q: "Do you provide job assistance?",
    a: "Yes. We provide job assistance to help students start their professional journey."
  },
  {
    q: "How do I enroll in VEECAP CLASSES?",
    a: "You can visit our institute in Jodhpur, call us for counselling, fill out the enquiry form on our website, or speak with our counselors to choose the right course. Our team will guide you through the admission process and help select the course that matches your career goals."
  },
  {
    q: "What makes VEECAP CLASSES different from other institutes?",
    a: "What sets us apart is our commitment to student success. We focus on practical learning, expert trainers, career-oriented training, live projects, internships, job assistance, individual attention, and affordable fees."
  },
  {
    q: "How does payment work on the website?",
    a: "Paid courses are processed securely through Razorpay (UPI, cards, netbanking). We never see or store your card details."
  },
  {
    q: "Can I get a refund?",
    a: "Contact our support team within 14 days of purchase if a course isn't right for you, and we'll review it for a refund."
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <p className="eyebrow">Frequently Asked</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Questions &amp; answers</h1>
      <div className="mt-8 space-y-3">
        {faqs.map((f, i) => (
          <div key={i} className="card-ledger overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between p-4 text-left font-semibold"
            >
              {f.q}
              <ChevronDown className={`h-4 w-4 shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i && (
              <p className="border-t border-ink-100 p-4 text-sm text-ink-600 leading-relaxed whitespace-pre-line">
                {f.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
