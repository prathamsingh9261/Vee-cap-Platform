import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Users, BookOpen, ShoppingBag, TrendingUp,
  Award, Trash2, RefreshCw, Plus, BarChart3,
  LogOut, Home, ChevronRight
} from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-ink-900">
        {typeof value === "number" && value > 999
          ? `₹${value.toLocaleString("en-IN")}`
          : value}
      </p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  );
}

// ── Section Header ──────────────────────────────────────────
function SectionHeader({ title, count }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-100 pb-3">
      <h2 className="font-display text-xl font-semibold text-ink-900">{title}</h2>
      {count !== undefined && (
        <span className="rounded-full bg-ink-50 px-3 py-1 font-mono text-xs font-semibold text-ink-500">
          {count} total
        </span>
      )}
    </div>
  );
}

// ── Status Badge ────────────────────────────────────────────
function Badge({ status }) {
  const styles = {
    paid: "bg-green-100 text-green-700",
    pending: "bg-amber-50 text-amber-600",
    failed: "bg-red-100 text-red-600",
    refunded: "bg-ink-100 text-ink-500",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold capitalize ${styles[status] || "bg-ink-100 text-ink-500"}`}>
      {status}
    </span>
  );
}

// ── Main Component ──────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(false);

  // New course form state
  const [courseForm, setCourseForm] = useState({
    title: "", shortDescription: "", description: "",
    category: "Career", level: "Beginner", price: 0, thumbnail: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    loadStats();
  }, [user]);

  useEffect(() => {
    if (tab === "students") loadStudents();
    if (tab === "orders") loadOrders();
    if (tab === "enrollments") loadEnrollments();
    if (tab === "courses") loadCourses();
    if (tab === "revenue") loadRevenue();
  }, [tab]);

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch { toast.error("Failed to load stats"); }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/students");
      setStudents(res.data.students);
    } catch { toast.error("Failed to load students"); }
    finally { setLoading(false); }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/orders");
      setOrders(res.data.orders);
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  };

  const loadEnrollments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/enrollments");
      setEnrollments(res.data.enrollments);
    } catch { toast.error("Failed to load enrollments"); }
    finally { setLoading(false); }
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/courses");
      setCourses(res.data.courses);
    } catch { toast.error("Failed to load courses"); }
    finally { setLoading(false); }
  };

  const loadRevenue = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/revenue-by-course");
      setRevenue(res.data.data);
    } catch { toast.error("Failed to load revenue"); }
    finally { setLoading(false); }
  };

  const handleRefund = async (orderId) => {
    if (!window.confirm("Mark this order as refunded?")) return;
    try {
      await api.patch(`/admin/orders/${orderId}/refund`);
      toast.success("Order refunded");
      loadOrders();
    } catch { toast.error("Failed to refund"); }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Delete this student and all their data?")) return;
    try {
      await api.delete(`/admin/students/${id}`);
      toast.success("Student deleted");
      loadStudents();
    } catch { toast.error("Failed to delete"); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course permanently?")) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success("Course deleted");
      loadCourses();
    } catch { toast.error("Failed to delete course"); }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/courses", { ...courseForm, price: Number(courseForm.price), sections: [] });
      toast.success("Course created!");
      setCourseForm({ title: "", shortDescription: "", description: "", category: "Career", level: "Beginner", price: 0, thumbnail: "" });
      loadCourses();
      setTab("courses");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally { setSubmitting(false); }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "students", label: "Students", icon: Users },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "enrollments", label: "Enrollments", icon: Award },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "revenue", label: "Revenue", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-ink-50/30">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <Link to="/" className="hover:text-ink">VeeCap</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-ink-900">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-500 sm:block">
              Welcome, <span className="font-semibold text-ink-900">{user?.name}</span>
            </span>
            <Link to="/" className="btn-outline !px-3 !py-1.5 text-xs">
              View Site
            </Link>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-1 text-xs text-ink-500 hover:text-ink-900"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mx-auto max-w-7xl overflow-x-auto px-5">
          <div className="flex gap-1 pb-0">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                  tab === t.id
                    ? "border-amber-500 text-amber-600"
                    : "border-transparent text-ink-500 hover:text-ink-900"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            <h1 className="font-display text-2xl font-semibold">Dashboard Overview</h1>
            <p className="mt-1 text-sm text-ink-500">All your key metrics at a glance.</p>

            {stats ? (
              <>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                  <StatCard icon={Users} label="Total Students" value={stats.totalStudents} color="bg-blue-500" />
                  <StatCard icon={BookOpen} label="Total Courses" value={stats.totalCourses} color="bg-amber-500" />
                  <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="bg-purple-500" />
                  <StatCard icon={Award} label="Enrollments" value={stats.totalEnrollments} color="bg-green-500" />
                  <StatCard icon={TrendingUp} label="Revenue" value={stats.totalRevenue} color="bg-ink-700" />
                  <StatCard icon={RefreshCw} label="Orders (7 days)" value={stats.recentOrders} color="bg-pink-500" />
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Quick actions */}
                  <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
                    <h3 className="font-display text-lg font-semibold">Quick Actions</h3>
                    <div className="mt-4 space-y-3">
                      <button onClick={() => setTab("courses")} className="btn-amber w-full">
                        <Plus className="h-4 w-4" /> Manage Courses
                      </button>
                      <button onClick={() => setTab("orders")} className="btn-outline w-full">
                        <ShoppingBag className="h-4 w-4" /> View All Orders
                      </button>
                      <button onClick={() => setTab("students")} className="btn-outline w-full">
                        <Users className="h-4 w-4" /> View All Students
                      </button>
                    </div>
                  </div>

                  {/* Stats summary */}
                  <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
                    <h3 className="font-display text-lg font-semibold">Summary</h3>
                    <ul className="mt-4 space-y-3 text-sm">
                      {[
                        { label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}` },
                        { label: "Total Students", value: stats.totalStudents },
                        { label: "Active Courses", value: stats.totalCourses },
                        { label: "Total Enrollments", value: stats.totalEnrollments },
                        { label: "Orders This Week", value: stats.recentOrders },
                      ].map((item, i) => (
                        <li key={i} className="flex items-center justify-between border-b border-ink-50 pb-3">
                          <span className="text-ink-500">{item.label}</span>
                          <span className="font-mono font-semibold text-ink-900">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-8 text-center text-ink-400">Loading stats...</p>
            )}
          </div>
        )}

        {/* ── STUDENTS ── */}
        {tab === "students" && (
          <div>
            <SectionHeader title="All Students" count={students.length} />
            {loading ? (
              <p className="mt-8 text-center text-ink-400">Loading...</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                      <tr>
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3">Email</th>
                        <th className="px-5 py-3">Enrollments</th>
                        <th className="px-5 py-3">Joined</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-50">
                      {students.map((s) => (
                        <tr key={s._id} className="hover:bg-ink-50/50">
                          <td className="px-5 py-3 font-medium text-ink-900">{s.name}</td>
                          <td className="px-5 py-3 text-ink-500">{s.email}</td>
                          <td className="px-5 py-3">
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 font-mono text-xs font-semibold text-amber-700">
                              {s.enrollments} courses
                            </span>
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-ink-400">
                            {new Date(s.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => handleDeleteStudent(s._id)}
                              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {students.length === 0 && (
                        <tr><td colSpan={5} className="px-5 py-8 text-center text-ink-400">No students yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <div>
            <SectionHeader title="All Orders" count={orders.length} />
            {loading ? (
              <p className="mt-8 text-center text-ink-400">Loading...</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                      <tr>
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Course</th>
                        <th className="px-5 py-3">Amount</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Invoice</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-50">
                      {orders.map((o) => (
                        <tr key={o._id} className="hover:bg-ink-50/50">
                          <td className="px-5 py-3">
                            <p className="font-medium text-ink-900">{o.student?.name}</p>
                            <p className="text-xs text-ink-400">{o.student?.email}</p>
                          </td>
                          <td className="px-5 py-3 text-ink-600">{o.course?.title}</td>
                          <td className="px-5 py-3 font-mono font-semibold text-ink-900">
                            ₹{o.amount?.toLocaleString("en-IN")}
                          </td>
                          <td className="px-5 py-3"><Badge status={o.status} /></td>
                          <td className="px-5 py-3 font-mono text-xs text-ink-400">{o.invoiceNumber || "—"}</td>
                          <td className="px-5 py-3 font-mono text-xs text-ink-400">
                            {new Date(o.createdAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-5 py-3">
                            {o.status === "paid" && (
                              <button
                                onClick={() => handleRefund(o._id)}
                                className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50"
                              >
                                <RefreshCw className="h-3.5 w-3.5" /> Refund
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan={7} className="px-5 py-8 text-center text-ink-400">No orders yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ENROLLMENTS ── */}
        {tab === "enrollments" && (
          <div>
            <SectionHeader title="All Enrollments" count={enrollments.length} />
            {loading ? (
              <p className="mt-8 text-center text-ink-400">Loading...</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                      <tr>
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Course</th>
                        <th className="px-5 py-3">Category</th>
                        <th className="px-5 py-3">Progress</th>
                        <th className="px-5 py-3">Certificate</th>
                        <th className="px-5 py-3">Enrolled On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-50">
                      {enrollments.map((e) => (
                        <tr key={e._id} className="hover:bg-ink-50/50">
                          <td className="px-5 py-3">
                            <p className="font-medium text-ink-900">{e.student?.name}</p>
                            <p className="text-xs text-ink-400">{e.student?.email}</p>
                          </td>
                          <td className="px-5 py-3 text-ink-600">{e.course?.title}</td>
                          <td className="px-5 py-3">
                            <span className="rounded-full bg-ink-50 px-2 py-0.5 font-mono text-xs text-ink-500">
                              {e.course?.category}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-ink-100">
                                <div className="h-full rounded-full bg-amber" style={{ width: `${e.progressPercent}%` }} />
                              </div>
                              <span className="font-mono text-xs text-ink-500">{e.progressPercent}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            {e.certificateIssued ? (
                              <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                                <Award className="h-3.5 w-3.5" /> Issued
                              </span>
                            ) : (
                              <span className="text-xs text-ink-400">Pending</span>
                            )}
                          </td>
                          <td className="px-5 py-3 font-mono text-xs text-ink-400">
                            {new Date(e.createdAt).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                      {enrollments.length === 0 && (
                        <tr><td colSpan={6} className="px-5 py-8 text-center text-ink-400">No enrollments yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── COURSES ── */}
        {tab === "courses" && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Course list */}
            <div className="lg:col-span-2">
              <SectionHeader title="All Courses" count={courses.length} />
              {loading ? (
                <p className="mt-8 text-center text-ink-400">Loading...</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {courses.map((c) => (
                    <div key={c._id} className="flex items-center gap-4 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
                      {c.thumbnail && (
                        <img src={c.thumbnail} alt={c.title} className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-ink-900 truncate">{c.title}</p>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-ink-400">{c.category}</span>
                          <span className="text-ink-200">·</span>
                          <span className="font-mono text-xs font-semibold text-ink-900">
                            {c.price === 0 ? "Free" : `₹${c.price.toLocaleString("en-IN")}`}
                          </span>
                          <span className="text-ink-200">·</span>
                          <span className="font-mono text-xs text-ink-400">{c.studentsCount || 0} students</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/courses/${c.slug}`}
                          className="rounded-md border border-ink-100 px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-50"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(c._id)}
                          className="rounded-md px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <p className="mt-4 text-center text-ink-400">No courses yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Create course form */}
            <div>
              <h2 className="font-display text-xl font-semibold border-b border-ink-100 pb-3">Add New Course</h2>
              <form onSubmit={handleCreateCourse} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-ink-600">Title</label>
                  <input required value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    className="input-field mt-1" placeholder="Course title" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-600">Short Description</label>
                  <input value={courseForm.shortDescription}
                    onChange={(e) => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
                    className="input-field mt-1" placeholder="Shown on course card" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-600">Full Description</label>
                  <textarea required rows={4} value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    className="input-field mt-1" placeholder="Full course description" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-ink-600">Category</label>
                    <select value={courseForm.category}
                      onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                      className="input-field mt-1">
                      {["Career","Arts","Business","Developer","Science","Law","MBBS","BCS"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-600">Level</label>
                    <select value={courseForm.level}
                      onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                      className="input-field mt-1">
                      {["Beginner","Intermediate","Advanced","All levels"].map(l => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-600">Price (₹) — 0 for free</label>
                  <input type="number" min="0" value={courseForm.price}
                    onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                    className="input-field mt-1" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink-600">Thumbnail URL</label>
                  <input value={courseForm.thumbnail}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                    className="input-field mt-1" placeholder="https://..." />
                </div>
                <button type="submit" disabled={submitting} className="btn-amber w-full">
                  {submitting ? "Creating..." : "Create Course"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── REVENUE ── */}
        {tab === "revenue" && (
          <div>
            <SectionHeader title="Revenue by Course" />
            {loading ? (
              <p className="mt-8 text-center text-ink-400">Loading...</p>
            ) : (
              <div className="mt-4 space-y-3">
                {revenue.map((r, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-ink-100 bg-white p-5 shadow-card">
                    <div>
                      <p className="font-semibold text-ink-900">{r.title}</p>
                      <p className="mt-1 font-mono text-xs text-ink-400">{r.count} purchases</p>
                    </div>
                    <p className="font-display text-xl font-semibold text-ink-900">
                      ₹{r.total.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
                {revenue.length === 0 && (
                  <div className="rounded-xl border border-ink-100 bg-white p-8 text-center text-ink-400">
                    No revenue data yet — revenue appears here after students purchase courses.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
