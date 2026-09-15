"use client";

import { useState } from "react";
import { LuHeart, LuShoppingCart, LuZap, LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import { formatPrice } from "./utils";

export default function ProductActions({
  outOfStock,
  isAdding = false,
  onAddToCart,
  onBuyNow,
  price = 0,
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistToggle = () => {
    setIsWishlisted((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Saved to your wishlist!");
      } else {
        toast.info("Removed from your wishlist");
      }
      return next;
    });
  };

  return (
    <>
      {/* Desktop & Default Inline Actions */}
      <div className="mt-8 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            disabled={outOfStock || isAdding}
            onClick={onAddToCart}
            className={`btn btn-lg h-13 min-h-13 rounded-xl font-bold shadow-xs transition-all flex items-center justify-center gap-2 text-sm sm:text-base border-2 ${
              outOfStock
                ? "bg-zinc-100 border-zinc-200 text-zinc-400 cursor-not-allowed"
                : "border-main text-main bg-white hover:bg-main hover:text-white active:scale-98"
            }`}
          >
            {isAdding ? (
              <LuLoader className="w-5 h-5 animate-spin" />
            ) : (
              <LuShoppingCart className="w-5 h-5" />
            )}
            <span>{outOfStock ? "Out of Stock" : "Add to Cart"}</span>
          </button>

          <button
            type="button"
            disabled={outOfStock}
            onClick={onBuyNow}
            className={`btn btn-lg h-13 min-h-13 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
              outOfStock
                ? "bg-zinc-200 border-zinc-200 text-zinc-400 cursor-not-allowed"
                : "bg-main hover:bg-main/90 text-white border-main active:scale-98 shadow-md shadow-main/20"
            }`}
          >
            <LuZap className="w-5 h-5" />
            <span>Buy Now</span>
          </button>
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors border ${
            isWishlisted
              ? "bg-red-50 border-red-200 text-red-600"
              : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
          }`}
        >
          <LuHeart
            className={`w-4.5 h-4.5 transition-transform active:scale-125 ${
              isWishlisted ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span>{isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}</span>
        </button>
      </div>

      {/* Mobile Fixed Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-zinc-400 uppercase font-medium">
            Price
          </span>
          <span className="text-lg font-extrabold text-main leading-tight">
            {formatPrice(price)}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-70">
          <button
            type="button"
            disabled={outOfStock || isAdding}
            onClick={onAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg text-xs font-bold border border-main text-main bg-white hover:bg-main/5 disabled:opacity-40"
          >
            <LuShoppingCart className="w-3.5 h-3.5" />
            <span>Cart</span>
          </button>

          <button
            type="button"
            disabled={outOfStock}
            onClick={onBuyNow}
            className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-lg text-xs font-bold bg-main text-white shadow-xs hover:bg-main/90 disabled:opacity-40"
          >
            <LuZap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </>
  );
}
