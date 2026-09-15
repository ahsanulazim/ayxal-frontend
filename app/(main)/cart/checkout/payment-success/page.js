"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LuCheck,
  LuHouse,
  LuPackage,
  LuShieldCheck,
  LuShoppingBag,
} from "react-icons/lu";
import { verifyOrderPayment } from "@/api/orderApi";
import { useCart } from "@/context/CartContext";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id");
  const orderNumberParam = searchParams.get("order_number");

  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(Boolean(sessionId));
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    // Clear cart immediately on successful return from checkout
    clearCart();

    if (sessionId) {
      verifyOrderPayment(sessionId, orderId)
        .then((res) => {
          if (res?.success && res?.order) {
            setOrder(res.order);
          }
        })
        .catch((err) => {
          console.error("Verification error:", err);
          setError("Order confirmed. Could not refresh live order details.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [sessionId, orderId, clearCart]);

  const displayOrderNumber =
    order?.orderNumber ||
    orderNumberParam ||
    (sessionId ? sessionId.slice(-8) : "Confirmed");

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/80 shadow-md text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-5">
          <LuCheck className="w-8 h-8 stroke-3" />
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
          <LuShieldCheck className="w-3.5 h-3.5" /> Payment Verified
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
          Thank You for Your Order!
        </h1>

        <p className="text-sm text-zinc-600 mt-2 max-w-md mx-auto">
          Your payment has been successfully processed via Stripe. A
          confirmation email has been sent to your inbox.
        </p>

        {/* Order Receipt Box */}
        <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 text-left space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Order Number:</span>
            <span className="font-mono font-bold text-zinc-900 bg-white px-2 py-0.5 rounded-md border border-zinc-200">
              #{displayOrderNumber}
            </span>
          </div>

          {order?.shipping?.name && (
            <div className="flex justify-between items-center">
              <span className="text-zinc-500">Shipping Courier:</span>
              <span className="font-semibold text-zinc-800">
                {order.shipping.name}
              </span>
            </div>
          )}

          {order?.total !== undefined && (
            <div className="flex justify-between items-center pt-2 border-t border-zinc-200/60 text-base">
              <span className="font-semibold text-zinc-700">Total Paid:</span>
              <span className="font-black text-main text-lg">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <button className="btn btn-main w-full sm:w-auto px-6 rounded-xl font-bold flex items-center justify-center gap-2">
              <LuShoppingBag className="w-4 h-4" /> Continue Shopping
            </button>
          </Link>
        </div>

        <p className="text-xs text-zinc-400 mt-6">
          Need assistance with your order? Contact us at{" "}
          <a
            href="mailto:support@pretypet.com"
            className="text-main hover:underline"
          >
            support@pretypet.com
          </a>
        </p>
      </div>
    </div>
  );
}

const PaymentSuccessPage = () => {
  return (
    <main className="min-h-[80vh] bg-zinc-50/60 pb-12">
      <section className="px-5 pt-4">
        <div className="max-w-6xl mx-auto">
          <div className="breadcrumbs text-xs text-zinc-500">
            <ul>
              <li>
                <Link
                  href="/"
                  className="hover:text-main flex items-center gap-1"
                >
                  <LuHouse className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/cart">Cart</Link>
              </li>
              <li className="font-semibold text-emerald-700">
                Order Confirmed
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="py-20 flex justify-center items-center">
            <span className="loading loading-spinner loading-lg text-main"></span>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </main>
  );
};

export default PaymentSuccessPage;
