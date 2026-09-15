"use client";

import { getAvailableCoupons } from "@/api/couponApi";
import CouponCard from "@/components/account/CouponCard";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { LuGift, LuShoppingBag, LuSparkles, LuTicket } from "react-icons/lu";

const filterOptions = [
  { key: "all", label: "All Vouchers" },
  { key: "percent", label: "Percent Off" },
  { key: "flat", label: "Flat Deals" },
  { key: "shipping", label: "Free Shipping" },
];

const CouponsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: couponsResp, isLoading } = useQuery({
    queryKey: ["availableCoupons"],
    queryFn: getAvailableCoupons,
  });

  const coupons = couponsResp?.coupons || [];

  const filteredCoupons = coupons.filter((c) => {
    if (activeFilter === "all") return true;
    return c.discountType === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <LuTicket className="size-6 text-main" /> Coupons & Vouchers
          </h2>
          <p className="text-xs text-base-content/60 mt-1">
            Exclusive member savings on premium pet food, grooming supplies, and treats.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 bg-base-100 p-1.5 rounded-2xl border border-base-200">
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

      {/* Promo banner */}
      <div className="bg-linear-to-r from-main/15 via-emerald-500/10 to-amber-500/10 rounded-3xl p-5 border border-main/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-main text-white flex items-center justify-center shrink-0 shadow-sm">
            <LuGift className="size-5" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-base-content text-sm flex items-center gap-1.5">
              <LuSparkles className="size-3.5 text-amber-500" /> Have a voucher code?
            </h4>
            <p className="text-base-content/70 mt-0.5">
              Click &quot;Copy Code&quot; on any card below, then paste it in the Coupon box at checkout to claim your discount!
            </p>
          </div>
        </div>
        <Link
          href="/"
          className="btn btn-main btn-sm rounded-xl px-5 gap-1.5 text-xs shrink-0"
        >
          <LuShoppingBag className="size-3.5" /> Start Shopping
        </Link>
      </div>

      {/* Coupons Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-48 bg-base-100 rounded-3xl border border-base-200 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-200 space-y-3">
          <div className="w-14 h-14 rounded-full bg-base-200 flex items-center justify-center text-base-content/40 mx-auto">
            <LuTicket className="size-7" />
          </div>
          <h3 className="font-bold text-base text-base-content">No vouchers found</h3>
          <p className="text-xs text-base-content/60">
            Check back soon for new holiday promotions and pet birthday discounts.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((coupon) => (
            <CouponCard key={coupon.code} coupon={coupon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
