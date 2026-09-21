"use client";

import Link from "next/link";
import { LuHeart } from "react-icons/lu";

const WishlistEmptyState = () => {
  return (
    <div className="bg-base-100 rounded-3xl p-10 sm:p-14 text-center border border-base-200 space-y-4 shadow-xs">
      <div className="size-16 rounded-full bg-main/10 text-main flex items-center justify-center mx-auto shadow-inner">
        <LuHeart className="size-8" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="font-black text-lg text-base-content">
          Your Wishlist is Empty
        </h3>
        <p className="text-xs text-base-content/60 leading-relaxed">
          Explore our pet catalog and tap the heart icon on any product to save it for later.
        </p>
      </div>
      <div className="pt-2">
        <Link href="/products" className="btn btn-main btn-sm rounded-xl px-6">
          Explore Pet Products
        </Link>
      </div>
    </div>
  );
};

export default WishlistEmptyState;
