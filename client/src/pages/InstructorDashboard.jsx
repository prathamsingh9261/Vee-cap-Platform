import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  BookOpen, Users, TrendingUp, ShoppingBag,
  Trash2, Plus, ChevronRight, LogOut,
  User, Award, Edit3, Save, X
} from "lucide-react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

// ── Stat Card ──────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, prefix = "" }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" strokeWidth={2} />
      </div>
      <p className="mt-4 font-display text-3xl font-semibold text-ink-900">
        {prefix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────
function Badge({ text, color = "bg-ink-100 text-ink-500" }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold ${color}`}>
      {text}
    </span>
  );
}

const CATEGORIES = ["Career","Arts","Business","Developer","Science","Law","MBBS","BCS"];
const LEVELS = ["Beginner","Intermediate","Advanced","All levels"];

export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [earnings, setEarnings] = useState({ earnings: [], recentOrders: [] });
  const [loading, setLoading] = useState(false);

  // Course form
  const [courseForm, setCourseForm] = useState({
    title: "", shortDescription: "", description: "",
    category: "Career", level: "Beginner", price: 0, thumbnail: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: "", bio: "", avatar: "" });
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== "instructor" && user.role !== "admin")) {
      navigate("/dashboard");
      return;
    }
    setProfileForm({ name: user.name || "", bio: user.bio || "", avatar: user.avatar || "" });
    loadStats();
  }, [user]);

  useEffect(() => {
    if (tab === "courses") loadCourses();
    if (tab === "students") loadStudents();
    if (tab === "earnings") loadEarnings();
  }, [tab]);

  const loadStats = async () => {
    try {
      const res = await api.get("/instructor/stats");
      setStats(res.data);
    } catch { toast.error("Failed to load stats"); }
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/instructor/my-courses");
      setCourses(res.data.courses);
    } catch { toast.error("Failed to load courses"); }
    finally { setLoading(false); }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/instructor/my-students");
      setStudents(res.data.enrollments);
    } catch { toast.error("Failed to load students"); }
    finally { setLoading(false); }
  };

  const loadEarnings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/instructor/my-earnings");
      setEarnings(res.data);
    } catch { toast.error("Failed to load earnings"); }
    finally { setLoading(false); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Delete this course permanently?")) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success("Course deleted");
      loadCourses();
      loadStats();
    } catch { toast.error("Failed to delete"); }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/courses", { ...courseForm, price: Number(courseForm.price), sections: [] });
      toast.success("Course created!");
      setCourseForm({ title: "", shortDescription: "", description: "", category: "Career", level: "Beginner", price: 0, thumbnail: "" });
      setTab("courses");
      loadStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally { setSubmitting(false); }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.patch("/instructor/profile", profileForm);
      toast.success("Profile updated!");
      setEditingProfile(false);
    } catch { toast.error("Failed to update profile"); }
    finally { setSavingProfile(false); }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "students", label: "My Students", icon: Users },
    { id: "earnings", label: "Earnings", icon: ShoppingBag },
    { id: "add", label: "Add Course", icon: Plus },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-ink-50/30">
      {/* Top bar */}
      <div className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2 text-sm text-ink-500">
            <Link to="/" className="hover:text-ink">VeeCap</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-ink-900">Instructor Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-ink-500 sm:block">
              <span className="font-semibold text-ink-900">{user?.name}</span>
              <span className="ml-1 rounded-full bg-amber/10 px-2 py-0.5 font-mono text-xs text-amber-700">Instructor</span>
            </span>
            <Link to="/" className="btn-outline !px-3 !py-1.5 text-xs">View Site</Link>
            <button onClick={() => { logout(); navigate("/"); }} className="flex items-center gap-1 text-xs text-ink-500 hover:text-ink-900">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-7xl overflow-x-auto px-5">
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                  tab === t.id ? "border-amber-500 text-amber-600" : "border-transparent text-ink-500 hover:text-ink-900"
                }`}
              >
                <t.icon className="h-4 w-4" />{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-8">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            <h1 className="font-display text-2xl font-semibold">Welcome back, {user?.name}!</h1>
            <p className="mt-1 text-sm text-ink-500">Here's how your courses are performing.</p>

            {stats ? (
              <>
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                  <StatCard icon={BookOpen} label="My Courses" value={stats.totalCourses} color="bg-amber-500" />
                  <StatCard icon={Users} label="My Students" value={stats.totalStudents} color="bg-blue-500" />
                  <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} color="bg-purple-500" />
                  <StatCard icon={TrendingUp} label="Total Earnings" value={stats.totalEarnings} color="bg-green-500" prefix="₹" />
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
                    <h3 className="font-display text-lg font-semibold">Quick Actions</h3>
                    <div className="mt-4 space-y-3">
                      <button onClick={() => setTab("add")} className="btn-amber w-full">
                        <Plus className="h-4 w-4" /> Create New Course
                      </button>
                      <button onClick={() => setTab("courses")} className="btn-outline w-full">
                        <BookOpen className="h-4 w-4" /> Manage My Courses
                      </button>
                      <button onClick={() => setTab("earnings")} className="btn-outline w-full">
                        <TrendingUp className="h-4 w-4" /> View Earnings
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
                    <h3 className="font-display text-lg font-semibold">Performance Summary</h3>
                    <ul className="mt-4 space-y-3">
                      {[
                        { label: "Courses Published", value: stats.totalCourses },
                        { label: "Students Enrolled", value: stats.totalStudents },
                        { label: "Paid Orders", value: stats.totalOrders },
                        { label: "Total Earnings", value: `₹${stats.totalEarnings.toLocaleString("en-IN")}` },
                      ].map((item, i) => (
                        <li key={i} className="flex items-center justify-between border-b border-ink-50 pb-3 text-sm">
                          <span className="text-ink-500">{item.label}</span>
                          <span className="font-mono font-semibold text-ink-900">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-8 text-center text-ink-400">Loading...</p>
            )}
          </div>
        )}

        {/* ── MY COURSES ── */}
        {tab === "courses" && (
          <div>
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <h2 className="font-display text-xl font-semibold">My Courses</h2>
              <button onClick={() => setTab("add")} className="btn-amber !px-4 !py-2 text-sm">
                <Plus className="h-4 w-4" /> Add Course
              </button>
            </div>

            {loading ? (
              <p className="mt-8 text-center text-ink-400">Loading...</p>
            ) : courses.length === 0 ? (
              <div className="mt-8 rounded-xl border border-ink-100 bg-white p-10 text-center shadow-card">
                <BookOpen className="mx-auto h-10 w-10 text-ink-200" />
                <p className="mt-3 font-semibold text-ink-700">No courses yet</p>
                <p className="mt-1 text-sm text-ink-400">Create your first course to get started</p>
                <button onClick={() => setTab("add")} className="btn-amber mt-4">
                  <Plus className="h-4 w-4" /> Create Course
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {courses.map((c) => (
                  <div key={c._id} className="flex items-center gap-4 rounded-xl border border-ink-100 bg-white p-4 shadow-card">
                    {c.thumbnail && (
                      <img src={c.thumbnail} alt={c.title} className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink-900 truncate">{c.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <Badge text={c.category} color="bg-amber-50 text-amber-700" />
                        <Badge text={c.level} color="bg-ink-50 text-ink-500" />
                        <span className="font-mono text-xs font-semibold text-ink-900">
                          {c.price === 0 ? "Free" : `₹${c.price.toLocaleString("en-IN")}`}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-4 font-mono text-xs text-ink-400">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> {c.enrollments} students
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> ₹{(c.earnings || 0).toLocaleString("en-IN")} earned
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link to={`/courses/${c.slug}`}
                        className="rounded-md border border-ink-100 px-3 py-1.5 text-xs font-medium text-ink-600 hover:bg-ink-50">
                        View
                      </Link>
                      <button onClick={() => handleDeleteCourse(c._id)}
                        className="rounded-md px-2 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MY STUDENTS ── */}
        {tab === "students" && (
          <div>
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <h2 className="font-display text-xl font-semibold">My Students</h2>
              <span className="rounded-full bg-ink-50 px-3 py-1 font-mono text-xs font-semibold text-ink-500">
                {students.length} total
              </span>
            </div>

            {loading ? (
              <p className="mt-8 text-center text-ink-400">Loading...</p>
            ) : students.length === 0 ? (
              <div className="mt-8 rounded-xl border border-ink-100 bg-white p-10 text-center shadow-card">
                <Users className="mx-auto h-10 w-10 text-ink-200" />
                <p className="mt-3 font-semibold text-ink-700">No students yet</p>
                <p className="mt-1 text-sm text-ink-400">Students will appear here after they enroll in your courses</p>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                      <tr>
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Course</th>
                        <th className="px-5 py-3">Progress</th>
                        <th className="px-5 py-3">Certificate</th>
                        <th className="px-5 py-3">Enrolled On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-50">
                      {students.map((e) => (
                        <tr key={e._id} className="hover:bg-ink-50/50">
                          <td className="px-5 py-3">
                            <p className="font-medium text-ink-900">{e.student?.name}</p>
                            <p className="text-xs text-ink-400">{e.student?.email}</p>
                          </td>
                          <td className="px-5 py-3 text-ink-600">{e.course?.title}</td>
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
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── EARNINGS ── */}
        {tab === "earnings" && (
          <div>
            <h2 className="font-display text-xl font-semibold border-b border-ink-100 pb-3">My Earnings</h2>

            {loading ? (
              <p className="mt-8 text-center text-ink-400">Loading...</p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Earnings by course */}
                <div>
                  <h3 className="font-display text-lg font-semibold">Earnings by Course</h3>
                  <div className="mt-4 space-y-3">
                    {earnings.earnings.length === 0 ? (
                      <div className="rounded-xl border border-ink-100 bg-white p-8 text-center shadow-card">
                        <TrendingUp className="mx-auto h-10 w-10 text-ink-200" />
                        <p className="mt-3 text-sm text-ink-400">No earnings yet — revenue appears here after students purchase your courses</p>
                      </div>
                    ) : (
                      earnings.earnings.map((e, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border border-ink-100 bg-white p-4 shadow-card">
                          <div>
                            <p className="font-semibold text-ink-900">{e.title}</p>
                            <p className="mt-0.5 font-mono text-xs text-ink-400">{e.count} purchases</p>
                          </div>
                          <p className="font-display text-xl font-semibold text-green-600">
                            ₹{e.total.toLocaleString("en-IN")}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Recent orders */}
                <div>
                  <h3 className="font-display text-lg font-semibold">Recent Orders</h3>
                  <div className="mt-4 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
                    {earnings.recentOrders.length === 0 ? (
                      <p className="p-8 text-center text-sm text-ink-400">No orders yet</p>
                    ) : (
                      <table className="w-full text-sm">
                        <thead className="bg-ink-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                          <tr>
                            <th className="px-4 py-3">Course</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-ink-50">
                          {earnings.recentOrders.map((o) => (
                            <tr key={o._id} className="hover:bg-ink-50/50">
                              <td className="px-4 py-3 text-ink-700">{o.course?.title}</td>
                              <td className="px-4 py-3 font-mono font-semibold text-green-600">
                                ₹{o.amount?.toLocaleString("en-IN")}
                              </td>
                              <td className="px-4 py-3 font-mono text-xs text-ink-400">
                                {new Date(o.createdAt).toLocaleDateString("en-IN")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ADD COURSE ── */}
        {tab === "add" && (
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-xl font-semibold border-b border-ink-100 pb-3">Create New Course</h2>
            <form onSubmit={handleCreateCourse} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-ink-700">Course Title *</label>
                <input required value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="input-field mt-1" placeholder="e.g. Digital Marketing with AI" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-700">Short Description</label>
                <input value={courseForm.shortDescription}
                  onChange={(e) => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
                  className="input-field mt-1" placeholder="Shown on the course card (1-2 lines)" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-700">Full Description *</label>
                <textarea required rows={6} value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="input-field mt-1" placeholder="Full course details, what students will learn, benefits..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-ink-700">Category</label>
                  <select value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="input-field mt-1">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink-700">Level</label>
                  <select value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="input-field mt-1">
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-700">Price (₹) — Enter 0 for free course</label>
                <input type="number" min="0" value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                  className="input-field mt-1" placeholder="e.g. 9999" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-700">Thumbnail Image URL</label>
                <input value={courseForm.thumbnail}
                  onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                  className="input-field mt-1" placeholder="https://... (upload to imgbb.com first)" />
                {courseForm.thumbnail && (
                  <img src={courseForm.thumbnail} alt="preview" className="mt-2 h-32 w-full rounded-lg object-cover" />
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-amber flex-1">
                  {submitting ? "Creating..." : "Create Course"}
                </button>
                <button type="button" onClick={() => setCourseForm({ title: "", shortDescription: "", description: "", category: "Career", level: "Beginner", price: 0, thumbnail: "" })}
                  className="btn-outline">
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── PROFILE ── */}
        {tab === "profile" && (
          <div className="mx-auto max-w-lg">
            <div className="flex items-center justify-between border-b border-ink-100 pb-3">
              <h2 className="font-display text-xl font-semibold">My Profile</h2>
              {!editingProfile ? (
                <button onClick={() => setEditingProfile(true)} className="btn-outline !px-3 !py-2 text-sm">
                  <Edit3 className="h-4 w-4" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-amber !px-3 !py-2 text-sm">
                    <Save className="h-4 w-4" /> {savingProfile ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setEditingProfile(false)} className="btn-outline !px-3 !py-2 text-sm">
                    <X className="h-4 w-4" /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 rounded-xl border border-ink-100 bg-white p-6 shadow-card">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber/10 font-display text-2xl font-semibold text-amber-700">
                  {profileForm.avatar ? (
                    <img src={profileForm.avatar} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    user?.name?.charAt(0)
                  )}
                </div>
                <div>
                  <p className="font-semibold text-ink-900">{user?.name}</p>
                  <p className="text-sm text-ink-500">{user?.email}</p>
                  <span className="mt-1 inline-block rounded-full bg-amber/10 px-2 py-0.5 font-mono text-xs text-amber-700">
                    Instructor
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-semibold text-ink-700">Full Name</label>
                  {editingProfile ? (
                    <input value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="input-field mt-1" />
                  ) : (
                    <p className="mt-1 text-ink-700">{profileForm.name || "—"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink-700">Bio</label>
                  {editingProfile ? (
                    <textarea rows={3} value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="input-field mt-1" placeholder="Tell students about yourself..." />
                  ) : (
                    <p className="mt-1 text-ink-600 text-sm">{profileForm.bio || "No bio added yet"}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink-700">Avatar URL</label>
                  {editingProfile ? (
                    <input value={profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      className="input-field mt-1" placeholder="https://..." />
                  ) : (
                    <p className="mt-1 text-sm text-ink-400">{profileForm.avatar || "No avatar set"}</p>
                  )}
                </div>
                <div className="border-t border-ink-100 pt-4">
                  <label className="text-sm font-semibold text-ink-700">Email</label>
                  <p className="mt-1 text-sm text-ink-500">{user?.email} (cannot be changed)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
