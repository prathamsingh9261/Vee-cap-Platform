import React, { useState } from "react";
import toast from "react-hot-toast";
import { MapPin, Mail, Phone } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent — we'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="eyebrow">Get In Touch</p>
      <h1 className="mt-2 font-display text-3xl font-semibold">Contact VEECAP CLASSES</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">

        {/* Contact info */}
        <div className="space-y-6">
          <div className="card-ledger p-5 flex gap-4 items-start">
            <MapPin className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Location</p>
              <p className="mt-1 text-sm text-ink-600">Jodhpur, Rajasthan, India</p>
            </div>
          </div>
          <div className="card-ledger p-5 flex gap-4 items-start">
            <Mail className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="mt-1 text-sm text-ink-600">veecapclasses@gmail.com</p>
            </div>
          </div>
          <div className="card-ledger p-5 flex gap-4 items-start">
            <Phone className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">WhatsApp / Call</p>
              <a href="https://wa.me/919057720726" target="_blank" rel="noopener noreferrer"
                className="mt-1 text-sm text-amber-600 hover:underline">
                +91 90577 20726
              </a>
            </div>
          </div>
          <div className="card-ledger p-5">
            <p className="font-semibold">Working Hours</p>
            <p className="mt-1 text-sm text-ink-600">Monday – Saturday: 9:00 AM – 6:00 PM</p>
            <p className="text-sm text-ink-600">Sunday: Closed</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-700">Your name</label>
            <input required placeholder="Jane Doe" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Your email</label>
            <input required type="email" placeholder="you@example.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700">Message</label>
            <textarea required rows={5} placeholder="How can we help you?"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="input-field mt-1" />
          </div>
          <button type="submit" className="btn-amber w-full">Send Message</button>
        </form>
      </div>
    </div>
  );
}
