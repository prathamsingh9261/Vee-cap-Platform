import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <XCircle className="mx-auto h-14 w-14 text-ink-300" />
      <h1 className="mt-4 font-display text-3xl font-semibold">Payment cancelled</h1>
      <p className="mt-3 text-ink-500">No charge was made. You can try again whenever you're ready.</p>
      <Link to="/courses" className="btn-amber mt-8 inline-flex">
        Back to courses
      </Link>
    </div>
  );
}
