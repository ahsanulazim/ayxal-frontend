"use client";

import { useState } from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
import {
  LuCreditCard,
  LuLock,
  LuShieldCheck,
  LuCircleAlert,
} from "react-icons/lu";

const StripePaymentElement = ({ isReady, errorMessage }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:border-zinc-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100/80 flex items-center justify-center text-main">
            <LuCreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-base">
              Payment Method
            </h3>
            <p className="text-xs text-zinc-500">
              All transactions are end-to-end encrypted & secure
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-main bg-teal-50/80 px-2.5 py-1 rounded-full border border-teal-200/60">
          <LuLock className="w-3.5 h-3.5" />
          <span>SSL Secured</span>
        </div>
      </div>

      {/* Error display if any */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <LuCircleAlert className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Stripe Payment Element */}
      <div className="min-h-35 relative">
        {!isLoaded && (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-zinc-400">
            <span className="loading loading-spinner loading-md text-main"></span>
            <span className="text-xs font-medium">
              Loading secure payment fields...
            </span>
          </div>
        )}

        <PaymentElement
          onReady={() => setIsLoaded(true)}
          options={{
            layout: "tabs",
            fields: {
              billingDetails: "auto",
            },
          }}
        />
      </div>

      {/* Trust Footer */}
      <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <LuShieldCheck className="w-4 h-4 text-main" />
          <span className="text-zinc-500 font-medium">
            Powered by Stripe PCI-DSS Level 1 Compliance
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-400">
          <span>VISA</span> • <span>MASTERCARD</span> • <span>AMEX</span> •{" "}
          <span>DISCOVER</span>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentElement;
