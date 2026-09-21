"use client";

import { useState } from "react";
import { LuCheck, LuClock, LuCopy, LuSparkles, LuTicket } from "react-icons/lu";
import { toast } from "react-toastify";

const filterOptions = [
  { key: "all", label: "All Vouchers" },
  { key: "percent", label: "Percent Off" },
  { key: "flat", label: "Flat Deals" },
  { key: "shipping", label: "Free Shipping" },
];

const OffersCoupons = ({ coupons = [], isLoading = false }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Copied promo code: "${code}"! Apply at checkout.`);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  const filteredCoupons = coupons.filter((c) => {
    if (activeFilter === "all") return true;
    return c.discountType === activeFilter;
  });

  return (
    <section id="coupons-section" className="space-y-6 pt-2">
      {/* Section Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-main/10 text-main">
              <LuTicket className="size-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-base-content tracking-tight">
              Active Promo Codes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Click to copy any coupon code and apply it during checkout for instant savings.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 bg-base-100 p-1.5 rounded-2xl border border-base-200 shadow-xs">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setActiveFilter(opt.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === opt.key
                  ? "bg-main text-white shadow-xs"
                  : "text-base-content/70 hover:bg-base-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-44 bg-base-100 rounded-3xl border border-base-200 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-base-100 rounded-3xl p-8 text-center border border-base-200 text-xs text-base-content/60">
          No active vouchers found in this category right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCoupons.map((coupon) => {
            const isCopied = copiedCode === coupon.code;
            return (
              <div
                key={coupon.code}
                className="group relative bg-base-100 rounded-3xl p-5 border border-base-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative background circle */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-main/5 rounded-bl-full pointer-events-none group-hover:bg-main/10 transition-colors" />

                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-sm bg-main text-white font-black border-0 py-1">
                        {coupon.badge || "SPECIAL"}
                      </span>
                      {coupon.tag && (
                        <span className="badge badge-sm badge-outline text-main border-main/30 font-semibold">
                          <LuSparkles className="size-3 mr-0.5" /> {coupon.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-semibold text-main/80 uppercase tracking-wider">
                      {coupon.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-base text-base-content mt-3">
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
                    {coupon.description}
                  </p>

                  {/* Min Spend & Expiry */}
                  <div className="mt-4 pt-3 border-t border-dashed border-base-200 flex items-center justify-between text-[11px] text-base-content/60">
                    <span>
                      Min. Spend:{" "}
                      <strong className="text-base-content">
                        ${coupon.minSpend}
                      </strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <LuClock className="size-3" /> Valid for{" "}
                      {coupon.expiresInDays} days
                    </span>
                  </div>
                </div>

                {/* Coupon Code Strip & Copy Button */}
                <div className="mt-4 pt-3 border-t border-base-200/80 flex items-center justify-between gap-3">
                  <div className="bg-base-200/60 border border-dashed border-main/40 px-3 py-1.5 rounded-xl font-mono font-bold text-xs sm:text-sm text-main tracking-wider select-all">
                    {coupon.code}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(coupon.code)}
                    className={`btn btn-sm rounded-xl text-xs font-semibold gap-1.5 transition-all ${
                      isCopied
                        ? "btn-success text-white"
                        : "btn-main"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <LuCheck className="size-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <LuCopy className="size-3.5" /> Copy Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default OffersCoupons;
