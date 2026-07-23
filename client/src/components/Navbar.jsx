import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/veecap-logo.png";

const navLinks = [
  { to: "/courses", label: "Courses" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-parchment/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="VeeCap Classes" className="h-12 w-auto object-contain" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-ink-600 hover:text-ink">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {/* Instagram link */}
          <a
            href="https://www.instagram.com/veecapclasses_"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-100 text-ink-400 transition hover:border-pink-400 hover:text-pink-500"
            title="Follow on Instagram"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          {user ? (
            <>
              {user.role === "admin" && (
                <Link to="/admin" className="text-xs font-semibold rounded-md bg-amber/10 px-3 py-1.5 text-amber-700 hover:bg-amber/20">
                  Admin Panel
                </Link>
              )}
              {(user.role === "instructor") && (
                <Link to="/instructor" className="text-xs font-semibold rounded-md bg-blue-50 px-3 py-1.5 text-blue-700 hover:bg-blue-100">
                  Instructor Panel
                </Link>
              )}
              <Link to="/dashboard" className="text-sm font-medium text-ink-600 hover:text-ink">
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="btn-outline !px-3 !py-2 text-sm"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink-600 hover:text-ink">
                Log in
              </Link>
              <Link to="/register" className="btn-amber !px-4 !py-2 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-100 bg-parchment px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium text-ink-600">
                {l.label}
              </Link>
            ))}
            <hr className="border-ink-100" />
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="text-sm font-semibold text-amber-700">
                    Admin Panel
                  </Link>
                )}
                {user.role === "instructor" && (
                  <Link to="/instructor" onClick={() => setOpen(false)} className="text-sm font-semibold text-blue-700">
                    Instructor Panel
                  </Link>
                )}
                <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium">Dashboard</Link>
                <button onClick={() => { logout(); setOpen(false); navigate("/"); }} className="text-left text-sm font-medium text-ink-600">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-amber w-fit !px-4 !py-2 text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
