import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-20">
      <p className="eyebrow text-center">Welcome Back</p>
      <h1 className="mt-2 text-center font-display text-3xl font-semibold">Log in to your account</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink-700">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field mt-1"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink-700">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field mt-1"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-amber w-full">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600">
        Don't have an account?{" "}
        <Link to="/register" className="font-semibold text-ink hover:text-amber-600">
          Sign up
        </Link>
      </p>

      <p className="mt-4 rounded-md bg-ink-50 p-3 text-center text-xs text-ink-500">
        Demo logins (after running the seed script): admin@veecapclasses.com / Admin@123 ·
        aisha@veecapclasses.com / Instructor@123
      </p>
    </div>
  );
}
