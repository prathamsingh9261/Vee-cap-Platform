import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, PlayCircle } from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/enrollments/my"), api.get("/payments/my-orders")])
      .then(([e, o]) => {
        setEnrollments(e.data.enrollments);
        setOrders(o.data.orders);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="eyebrow">Welcome back</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">{user?.name}'s Dashboard</h1>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">My Courses</h2>
        {loading ? (
          <p className="mt-4 text-ink-400">Loading...</p>
        ) : enrollments.length === 0 ? (
          <div className="mt-4 card-ledger p-8 text-center">
            <p className="text-ink-600">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn-amber mt-4 inline-flex">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {enrollments.map((en) => (
              <div key={en._id} className="card-ledger flex gap-4 p-4">
                <img
                  src={en.course?.thumbnail}
                  alt={en.course?.title}
                  className="h-20 w-28 rounded-md object-cover"
                />
                <div className="flex-1">
                  <p className="font-mono text-xs uppercase text-amber-600">{en.course?.category}</p>
                  <h3 className="font-display font-semibold leading-snug">{en.course?.title}</h3>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-50">
                    <div
                      className="h-full rounded-full bg-amber"
                      style={{ width: `${en.progressPercent}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-ink-500">
                    <span>{en.progressPercent}% complete</span>
                    {en.certificateIssued && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Award className="h-3.5 w-3.5" /> Certified
                      </span>
                    )}
                  </div>
                  <Link
                    to={`/courses/${en.course?.slug}`}
                    className="mt-2 flex items-center gap-1 text-sm font-semibold text-ink hover:text-amber-600"
                  >
                    <PlayCircle className="h-4 w-4" /> Continue learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">Order History</h2>
        {orders.length === 0 ? (
          <p className="mt-3 text-sm text-ink-500">No purchases yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-ink-100 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-ink-600">
                <tr>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td className="px-4 py-3">{o.course?.title}</td>
                    <td className="px-4 py-3 font-mono">₹{o.amount.toFixed(0)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          o.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : o.status === "pending"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-ink-500">{o.invoiceNumber || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
