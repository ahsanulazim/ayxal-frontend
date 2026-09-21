"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuClock, LuFlame, LuPercent, LuSparkles, LuTruck } from "react-icons/lu";
import { FaPaw } from "react-icons/fa6";

const OffersHero = () => {
  // 48-hour rolling flash sale countdown
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-linear-to-br from-main via-emerald-800 to-teal-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
      {/* Background Decorative Circles */}
      <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-amber-400/10 blur-xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-5">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-neutral-900 text-xs font-black uppercase tracking-wider shadow-xs">
            <LuFlame className="size-3.5 fill-current text-red-600" /> Flash Deals Active
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-medium">
            <FaPaw className="size-3" /> Pet Parent Savings Carnival
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-balance leading-tight">
            Exclusive Pet Deals &amp; Vouchers
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-xl text-balance">
            Pamper your pet companions with nutritious food, cozy beds, and interactive toys. 
            Enjoy up to <strong className="text-amber-300 font-extrabold">40% OFF</strong> plus 
            free shipping on qualifying orders!
          </p>
        </div>

        {/* Countdown Box */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
            <LuClock className="size-4 text-amber-300 animate-pulse" />
            <span className="text-xs text-white/80 font-medium">Flash Sale Ends In:</span>
            <div className="flex items-center gap-1 font-mono font-black text-sm text-amber-300">
              <span className="bg-white/10 px-1.5 py-0.5 rounded-md">
                {String(timeLeft.hours).padStart(2, "0")}h
              </span>
              <span>:</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded-md">
                {String(timeLeft.minutes).padStart(2, "0")}m
              </span>
              <span>:</span>
              <span className="bg-white/10 px-1.5 py-0.5 rounded-md">
                {String(timeLeft.seconds).padStart(2, "0")}s
              </span>
            </div>
          </div>

          <a
            href="#coupons-section"
            className="btn btn-sm sm:btn-md bg-amber-400 hover:bg-amber-300 text-neutral-900 font-extrabold rounded-2xl border-0 shadow-md transition-all"
          >
            <LuSparkles className="size-4" /> Collect Coupons Below
          </a>
        </div>

        {/* Trust Badges */}
        <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-white/70 border-t border-white/15">
          <span className="flex items-center gap-1.5">
            <LuTruck className="size-4 text-amber-300" /> Free Delivery over $35
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <LuPercent className="size-4 text-amber-300" /> Instant Checkout Discounts
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <FaPaw className="size-3.5 text-amber-300" /> 100% Pet-Safe Guarantee
          </span>
        </div>
      </div>
    </section>
  );
};

export default OffersHero;
