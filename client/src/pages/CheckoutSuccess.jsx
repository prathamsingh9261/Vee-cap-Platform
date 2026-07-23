import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import api from "../api/api";

export default function CheckoutSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    api
      .get(`/payments/order/${orderId}`)
      .then((res) => setOrder(res.data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
      <h1 className="mt-4 font-display text-3xl font-semibold">Payment received</h1>

      {loading ? (
        <p className="mt-3 text-ink-500">Confirming your enrollment...</p>
      ) : order ? (
        <div className="mt-6 card-ledger p-5 text-left">
          <p className="font-mono text-xs text-ink-400">Invoice {order.invoiceNumber || "pending"}</p>
          <p className="mt-1 font-display text-lg font-semibold">{order.course?.title}</p>
          <p className="mt-1 text-sm text-ink-600">
            Amount paid: <span className="font-mono">₹{order.amount?.toFixed(0)}</span>
          </p>
          <p className="mt-1 text-sm text-ink-600">
            Status: <span className="font-semibold capitalize">{order.status}</span>
          </p>
        </div>
      ) : (
        <p className="mt-3 text-ink-500">We couldn't find that order — check your dashboard.</p>
      )}

      <Link to="/dashboard" className="btn-amber mt-8 inline-flex">
        Go to my courses
      </Link>
    </div>
  );
}
