import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";

const categories = ["Science", "Developer", "Law", "Career", "Business", "MBBS", "BCS", "Arts"];
const levels = ["All levels", "Beginner", "Intermediate", "Advanced"];

export default function AdminCourses() {
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    description: "",
    category: "Developer",
    level: "All levels",
    price: 0,
    thumbnail: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/courses", { ...form, price: Number(form.price), sections: [] });
      toast.success("Course created!");
      setForm({ title: "", shortDescription: "", description: "", category: "Developer", level: "All levels", price: 0, thumbnail: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12">
      <p className="eyebrow">Instructor Tools</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Create a new course</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          placeholder="Course title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="input-field"
        />
        <input
          placeholder="Short description (shown on course cards)"
          value={form.shortDescription}
          onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
          className="input-field"
        />
        <textarea
          required
          rows={4}
          placeholder="Full description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-field"
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-field"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            className="input-field"
          >
            {levels.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Price in ₹ (0 = free course)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="input-field"
        />
        <input
          placeholder="Thumbnail image URL"
          value={form.thumbnail}
          onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
          className="input-field"
        />
        <button type="submit" disabled={loading} className="btn-amber w-full">
          {loading ? "Creating..." : "Create Course"}
        </button>
      </form>
    </div>
  );
}
