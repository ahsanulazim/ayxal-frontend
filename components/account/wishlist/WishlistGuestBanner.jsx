"use client";

import Link from "next/link";
import { LuInfo, LuLogIn } from "react-icons/lu";

const WishlistGuestBanner = () => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2.5 text-amber-900">
        <LuInfo className="size-4 shrink-0 text-amber-600" />
        <p className="leading-snug">
          You are viewing a <strong>guest wishlist</strong> saved on this device.{" "}
          <span className="opacity-80">Log in to keep your favorites forever and sync across all devices!</span>
        </p>
      </div>

      <Link
        href="/login"
        className="btn btn-xs bg-amber-500 hover:bg-amber-600 text-white border-0 rounded-xl px-3.5 font-bold shrink-0 self-start sm:self-auto"
      >
        <LuLogIn className="size-3" /> Log In
      </Link>
    </div>
  );
};

export default WishlistGuestBanner;
