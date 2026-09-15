"use client";

import { useState } from "react";
import { LuCheck, LuClock, LuCopy, LuSparkles, LuTicket } from "react-icons/lu";
import { toast } from "react-toastify";

const CouponCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success(`Copied coupon code: ${coupon.code}!`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isFreeShipping = coupon.discountType === "shipping";

  return (
    <div className="group relative bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      {/* Decorative top corner flair */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-main/5 rounded-bl-full pointer-events-none group-hover:bg-main/10 transition-colors" />

      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-sm bg-main text-white font-bold border-0 py-1">
              {coupon.badge || "PROMO"}
            </span>
            {coupon.tag && (
              <span className="badge badge-sm badge-outline text-main border-main/30 font-medium">
                <LuSparkles className="size-3 mr-0.5" /> {coupon.tag}
              </span>
            )}
          </div>

          <div className="w-8 h-8 rounded-full bg-base-200 flex items-center justify-center text-main">
            <LuTicket className="size-4" />
          </div>
        </div>

        <h3 className="font-bold text-base text-base-content mt-3">
          {coupon.title}
        </h3>
        <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
          {coupon.description}
        </p>

        {/* Voucher Metadata */}
        <div className="mt-4 pt-3 border-t border-dashed border-base-200 flex flex-wrap items-center justify-between text-[11px] text-base-content/60 gap-2">
          <span>Min. Spend: <strong>${coupon.minSpend}</strong></span>
          <span className="flex items-center gap-1">
            <LuClock className="size-3" /> Valid for {coupon.expiresInDays} days
          </span>
        </div>
      </div>

      {/* Code Box & Copy Action */}
      <div className="mt-4 pt-3 flex items-center justify-between gap-2 bg-base-200/50 p-2.5 rounded-2xl border border-base-200">
        <div className="flex items-center gap-2">
          <span className="font-mono font-black text-sm text-main tracking-wider pl-1">
            {coupon.code}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`btn btn-xs rounded-xl px-3 font-semibold transition-all ${
            copied
              ? "bg-emerald-600 text-white border-0"
              : "btn-main"
          }`}
        >
          {copied ? (
            <>
              <LuCheck className="size-3" /> Copied
            </>
          ) : (
            <>
              <LuCopy className="size-3" /> Copy Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CouponCard;
