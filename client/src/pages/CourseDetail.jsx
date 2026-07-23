import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Clock, BarChart3, Star, CheckCircle2, PlayCircle } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function CourseDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    api
      .get(`/courses/${slug}`)
      .then((res) => setCourse(res.data.course))
      .catch(() => toast.error("Course not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please log in to enroll");
      navigate("/login");
      return;
    }

    setProcessing(true);
    try {
      const price = course.discountPrice ?? course.price;
      if (price === 0) {
        await api.post(`/enrollments/free/${course._id}`);
        toast.success("Enrolled! Redirecting to your dashboard...");
        setTimeout(() => navigate("/dashboard"), 1200);
        return;
      }

      if (!window.Razorpay) {
        toast.error("Payment script failed to load. Check your internet connection and reload.");
        return;
      }

      const { data } = await api.post(`/payments/create-order/${course._id}`);

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: "VeeCap Classes",
        description: data.courseName,
        prefill: {
          name: data.studentName,
          email: data.studentEmail,
        },
        theme: { color: "#16213E" },
        handler: async (response) => {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Enrolling you now...");
            navigate(`/checkout/success?order_id=${data.orderId}`);
          } catch (err) {
            toast.error("Payment verification failed. Contact support if you were charged.");
          }
        },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled — no charge was made.");
          },
        },
      });

      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <p className="py-24 text-center text-ink-400">Loading...</p>;
  if (!course) return <p className="py-24 text-center text-ink-400">Course not found.</p>;

  const price = course.discountPrice ?? course.price;
  const isFree = price === 0;
  const totalLessons = course.sections?.reduce((sum, s) => sum + s.lessons.length, 0) || 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wide text-amber-600">
              {course.category}
            </span>
            <span className="text-ink-300">•</span>
            <span className="text-xs text-ink-500">{course.level}</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight md:text-4xl">
            {course.title}
          </h1>
          <p className="mt-4 text-base text-ink-600">{course.description}</p>

          <div className="mt-5 flex flex-wrap items-center gap-5 font-mono text-sm text-ink-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {course.totalDurationMinutes} min
            </span>
            <span className="flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" /> {course.level}
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber text-amber" />
              {course.ratingAverage?.toFixed(1) || "New"} ({course.studentsCount} students)
            </span>
          </div>

          {course.instructor && (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-ink-100 bg-white p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-50 font-display text-lg font-semibold text-ink">
                {course.instructor.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-ink-400">Instructor</p>
                <p className="font-semibold text-ink-900">{course.instructor.name}</p>
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="font-display text-2xl font-semibold">Curriculum</h2>
            <div className="mt-4 space-y-3">
              {course.sections?.map((section, i) => (
                <div key={i} className="rounded-lg border border-ink-100 bg-white">
                  <div className="border-b border-ink-100 px-4 py-3 font-semibold text-ink-900">
                    {i + 1}. {section.title}
                  </div>
                  <ul className="divide-y divide-ink-100">
                    {section.lessons.map((lesson, j) => (
                      <li key={j} className="flex items-center justify-between px-4 py-3 text-sm">
                        <span className="flex items-center gap-2 text-ink-700">
                          <PlayCircle className="h-4 w-4 text-ink-300" /> {lesson.title}
                        </span>
                        <span className="font-mono text-xs text-ink-400">{lesson.duration} min</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky purchase card */}
        <div>
          <div className="card-ledger sticky top-24 overflow-hidden">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="aspect-video w-full object-cover" />
            )}
            <div className="p-5">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl font-semibold text-ink-900">
                  {isFree ? "Free" : `₹${price.toFixed(0)}`}
                </span>
                {!isFree && course.discountPrice && (
                  <span className="text-sm text-ink-400 line-through">₹{course.price.toFixed(0)}</span>
                )}
              </div>

              <button onClick={handleEnroll} disabled={processing} className="btn-amber mt-5 w-full">
                {processing ? "Processing..." : isFree ? "Enroll for Free" : "Buy This Course"}
              </button>

              <ul className="mt-5 space-y-2 text-sm text-ink-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" /> {totalLessons} lessons
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" /> Certificate on completion
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" /> Lifetime access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" /> Secure checkout via Razorpay (UPI, cards, netbanking)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
