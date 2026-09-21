"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import {
  LuTruck,
  LuLock,
  LuShieldCheck,
  LuRotateCcw,
  LuSparkles,
  LuChevronDown,
  LuChevronUp,
} from "react-icons/lu";
import { useState } from "react";

const Overview = ({ isCheckout, ref, isPending }) => {
  const {
    cart = [],
    cartSubtotal = 0,
    cartOriginalTotal = 0,
    cartSavings = 0,
    selectedShipping,
    shippingCost = 0,
    cartGrandTotal = 0,
  } = useCart();

  const [showItems, setShowItems] = useState(true);
  const finalDisplayTotal = isCheckout ? cartGrandTotal : cartSubtotal;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs sticky top-24">
      {/* Header with item count */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <h2 className="font-extrabold text-lg text-zinc-900">Order Summary</h2>
        {isCheckout && cart.length > 0 && (
          <button
            type="button"
            onClick={() => setShowItems((prev) => !prev)}
            className="text-xs font-semibold text-main hover:underline flex items-center gap-1"
          >
            <span>
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </span>
            {showItems ? (
              <LuChevronUp className="w-3.5 h-3.5" />
            ) : (
              <LuChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        )}
      </div>

      {/* Cart Items Preview in Checkout */}
      {isCheckout && showItems && cart.length > 0 && (
        <div className="py-3 border-b border-zinc-100 max-h-60 overflow-y-auto space-y-3 pr-1">
          {cart.map((item) => (
            <div
              key={item.key || item.productId}
              className="flex items-center gap-3"
            >
              <div className="relative w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200/60 overflow-hidden shrink-0">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-zinc-400">
                    Pet
                  </div>
                )}
                <span className="absolute -top-1 -right-1 bg-zinc-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-900 truncate">
                  {item.title}
                </p>
                {item.selectedAttributes &&
                  Object.keys(item.selectedAttributes).length > 0 && (
                    <p className="text-[11px] text-zinc-500 truncate">
                      {Object.entries(item.selectedAttributes)
                        .map(([k, v]) => `${v}`)
                        .join(" / ")}
                    </p>
                  )}
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs font-bold text-zinc-900">
                  $
                  {(
                    Number(item.finalPrice || item.price) *
                    Number(item.quantity || 1)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pricing Calculation Breakdown */}
      <div className="space-y-3 py-4 border-b border-zinc-100">
        {/* Original List Price if Discounted */}
        {cartSavings > 0 && (
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span>List Price:</span>
            <span className="line-through">
              ${cartOriginalTotal.toFixed(2)}
            </span>
          </div>
        )}

        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-600">Subtotal:</span>
          <span className="font-bold text-zinc-900">
            ${cartSubtotal.toFixed(2)}
          </span>
        </div>

        {/* Savings Badge */}
        {cartSavings > 0 && (
          <div className="flex justify-between items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            <span className="font-medium flex items-center gap-1">
              <LuSparkles className="w-3.5 h-3.5" /> Special Discount:
            </span>
            <span className="font-bold">-${cartSavings.toFixed(2)}</span>
          </div>
        )}

        {/* Shipping Line with real-time reactive update */}
        <div className="flex justify-between items-start text-sm">
          <div className="flex flex-col">
            <span className="text-zinc-600 flex items-center gap-1.5 font-medium">
              <LuTruck className="w-4 h-4 text-main" />
              Shipping:
            </span>
            {selectedShipping ? (
              <span className="text-[11px] text-zinc-500 mt-0.5 max-w-42.5 truncate">
                {selectedShipping.logisticName || selectedShipping.name}
              </span>
            ) : isCheckout ? (
              <span className="text-[11px] text-zinc-400 mt-0.5">
                Calculated from address
              </span>
            ) : null}
          </div>

          <div className="text-right">
            {selectedShipping ? (
              <span className="font-bold text-zinc-900">
                ${shippingCost.toFixed(2)}
              </span>
            ) : isCheckout ? (
              <span className="text-xs text-zinc-400 font-medium">—</span>
            ) : (
              <span className="text-xs text-zinc-400 font-medium">
                Calculated at checkout
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="py-4">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-base font-bold text-zinc-900">Total:</span>
          <div className="text-right">
            <span className="font-black text-2xl sm:text-3xl text-main tracking-tight">
              ${finalDisplayTotal.toFixed(2)}
            </span>
            <span className="text-xs text-zinc-500 font-normal ml-1">USD</span>
          </div>
        </div>
        <p className="text-[11px] text-zinc-400 text-right">
          Includes applicable duties and handling
        </p>
      </div>

      {/* Terms & Policies agreement */}
      {isCheckout && (
        <div className="mb-4">
          <label className="label cursor-pointer justify-start gap-2.5 items-start p-0">
            <input
              type="checkbox"
              defaultChecked
              required
              className="checkbox checkbox-xs checkbox-primary mt-0.5 rounded-sm"
            />
            <span className="text-[11px] text-zinc-500 leading-tight">
              I agree to the{" "}
              <Link href="#" className="text-main hover:underline">
                Terms
              </Link>
              ,{" "}
              <Link href="#" className="text-main hover:underline">
                Privacy
              </Link>
              , and{" "}
              <Link href="#" className="text-main hover:underline">
                Return Policy
              </Link>
              .
            </span>
          </label>
        </div>
      )}

      {/* Action Button: Stripe Checkout */}
      {isCheckout ? (
        <button
          onClick={() => ref?.current?.requestSubmit()}
          disabled={isPending}
          className={`btn ${isPending ? "btn-disabled" : "btn-main"} w-full rounded-xl py-3 shadow-md flex items-center justify-center gap-2 text-sm sm:text-base font-bold transition-all duration-200 hover:shadow-lg`}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
              <LuLock className="w-4 h-4" />
              <span>
                {cartGrandTotal > 0
                  ? `Pay $${cartGrandTotal.toFixed(2)}`
                  : "Complete Order"}
              </span>
            </>
          )}
        </button>
      ) : (
        <Link href="/cart/checkout" className="block w-full">
          <button className="btn btn-main w-full rounded-xl py-3 shadow-md text-sm sm:text-base font-bold">
            Proceed to Checkout
          </button>
        </Link>
      )}

      {/* Trust Badges & Guarantees */}
      <div className="mt-5 pt-4 border-t border-zinc-100 space-y-2.5">
        <div className="flex items-center justify-center gap-4 text-zinc-400">
          <span className="text-[11px] font-bold tracking-wider uppercase">
            Encrypted by Stripe
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <LuShieldCheck className="w-3.5 h-3.5" /> 256-Bit SSL
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-500 pt-1">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-50 border border-zinc-100">
            <LuShieldCheck className="w-3.5 h-3.5 text-main shrink-0" />
            <span className="font-medium">100% Pet-Safe</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-zinc-50 border border-zinc-100">
            <LuRotateCcw className="w-3.5 h-3.5 text-main shrink-0" />
            <span className="font-medium">30-Day Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
