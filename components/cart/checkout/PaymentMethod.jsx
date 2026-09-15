"use client";

import { LuCreditCard, LuShieldCheck } from "react-icons/lu";

const PaymentMethod = () => {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <h2 className="font-bold text-base text-zinc-900 flex items-center gap-2">
          <LuCreditCard className="w-4 h-4 text-main" /> Payment Method
        </h2>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <LuShieldCheck className="w-3 h-3" /> Secure Stripe Checkout
        </span>
      </div>

      <div className="mt-3.5 p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-main/10 text-main flex items-center justify-center shrink-0">
          <LuCreditCard className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-zinc-800">
            Credit / Debit Card (Stripe)
          </p>
          <p className="text-[11px] text-zinc-500">
            Safe & encrypted payment processed directly via Stripe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
