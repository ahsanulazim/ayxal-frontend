"use client";

import { useState } from "react";
import moment from "moment";
import {
  LuReceipt,
  LuCreditCard,
  LuShieldCheck,
  LuClock,
  LuCopy,
  LuCheck,
  LuTruck,
} from "react-icons/lu";

const OrderSummary = ({ order }) => {
  const [copiedSession, setCopiedSession] = useState(false);

  const subtotal = Number(order?.subtotal ?? order?.total ?? 0);
  const shippingCost = Number(order?.shippingCost ?? order?.shipping?.price ?? 0);
  const discount = Number(order?.discount ?? 0);
  const total = Number(order?.total ?? subtotal + shippingCost);

  const isPaid = order?.paymentStatus?.toLowerCase() === "paid";
  const stripeSessionId = order?.stripeSessionId;

  const handleCopySession = () => {
    if (stripeSessionId) {
      navigator.clipboard.writeText(stripeSessionId);
      setCopiedSession(true);
      setTimeout(() => setCopiedSession(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <LuReceipt className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-base text-zinc-900">Financial Summary</h3>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isPaid
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {isPaid ? (
            <>
              <LuShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Paid via Stripe
            </>
          ) : (
            <>
              <LuClock className="w-3.5 h-3.5 text-amber-600" />
              Payment Pending
            </>
          )}
        </span>
      </div>

      <div className="p-5 space-y-3.5 text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-zinc-600">
          <span>Items Subtotal</span>
          <span className="font-semibold text-zinc-800">${subtotal.toFixed(2)}</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-zinc-600">
          <span className="flex items-center gap-1.5">
            <LuTruck className="w-3.5 h-3.5 text-zinc-400" />
            Shipping Fee {order?.shipping?.name ? `(${order.shipping.name})` : ""}
          </span>
          <span className="font-semibold text-zinc-800">
            {shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : "Free Shipping"}
          </span>
        </div>

        {/* Discount if any */}
        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600">
            <span>Discount Applied</span>
            <span className="font-semibold">-${discount.toFixed(2)}</span>
          </div>
        )}

        {/* Grand Total */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-base">
          <span className="font-bold text-zinc-900">Grand Total</span>
          <span className="font-black text-xl text-main">${total.toFixed(2)}</span>
        </div>

        {/* Payment Metadata Box */}
        <div className="mt-4 pt-4 border-t border-zinc-100/80 bg-zinc-50/70 -mx-5 -mb-5 p-5 space-y-2 text-xs text-zinc-500 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-zinc-600">
              <LuCreditCard className="w-3.5 h-3.5 text-zinc-400" /> Payment Method:
            </span>
            <span className="font-semibold text-zinc-800">
              {order?.paymentDetails ? (
                order.paymentDetails.wallet
                  ? `${order.paymentDetails.wallet === "apple_pay" ? "Apple Pay" : order.paymentDetails.wallet === "google_pay" ? "Google Pay" : order.paymentDetails.wallet} (${order.paymentDetails.brand?.toUpperCase()} ••${order.paymentDetails.last4})`
                  : `${order.paymentDetails.brand ? order.paymentDetails.brand.toUpperCase() : "Card"} •••• ${order.paymentDetails.last4 || ""}`
              ) : (
                "Credit / Debit Card"
              )}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Gateway:</span>
            <span>Stripe</span>
          </div>

          {order?.paymentDetails?.receiptUrl && (
            <div className="flex items-center justify-between">
              <span>Stripe Receipt:</span>
              <a
                href={order.paymentDetails.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-main hover:underline text-xs"
              >
                View Receipt ↗
              </a>
            </div>
          )}

          {order?.paidAt && (
            <div className="flex items-center justify-between">
              <span>Paid At:</span>
              <span className="font-medium text-zinc-700">
                {moment(order.paidAt).format("MMM DD, YYYY · h:mm A")}
              </span>
            </div>
          )}

          {(order?.stripePaymentIntentId || order?.stripeSessionId) && (
            <div className="flex items-center justify-between pt-1">
              <span>Payment Ref:</span>
              <div className="flex items-center gap-1">
                <span className="font-mono text-[11px] text-zinc-700 bg-white px-2 py-0.5 rounded border border-zinc-200 truncate max-w-[170px]">
                  {order?.stripePaymentIntentId || order?.stripeSessionId}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const id = order?.stripePaymentIntentId || order?.stripeSessionId;
                    if (id) {
                      navigator.clipboard.writeText(id);
                      setCopiedSession(true);
                      setTimeout(() => setCopiedSession(false), 2000);
                    }
                  }}
                  className="text-zinc-400 hover:text-zinc-700 p-1"
                  title="Copy Reference"
                >
                  {copiedSession ? (
                    <LuCheck className="w-3 h-3 text-emerald-600" />
                  ) : (
                    <LuCopy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
