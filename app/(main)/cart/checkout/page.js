"use client";

import Link from "next/link";
import { LuHouse, LuShieldCheck, LuLock } from "react-icons/lu";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import ShippingForm from "@/components/cart/checkout/ShippingForm";
import Overview from "@/components/cart/Overview";
import Spinner from "@/components/skeleton/Spinner";

const CheckoutPage = () => {
  const router = useRouter();
  const { cart, loaded } = useCart();
  const [isPending, setIsPending] = useState(false);
  const checkoutRef = useRef(null);

  useEffect(() => {
    if (loaded && cart.length === 0) {
      router.push("/cart");
    }
  }, [loaded, cart, router]);

  if (!loaded) {
    return <Spinner />;
  }

  return (
    <main className="min-h-screen bg-zinc-50/60 pb-16">
      {/* Breadcrumb & Security Header */}
      <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-200/60 pb-3">
          <div className="breadcrumbs text-xs text-zinc-500">
            <ul>
              <li>
                <Link href="/" className="hover:text-main flex items-center gap-1">
                  <LuHouse className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-main">
                  Cart
                </Link>
              </li>
              <li className="font-semibold text-zinc-800">Secure Checkout</li>
            </ul>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <LuShieldCheck className="w-4 h-4 text-emerald-600" />
              Guaranteed Safe Checkout
            </span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center gap-1 text-zinc-600">
              <LuLock className="w-3.5 h-3.5 text-zinc-400" />
              Stripe 256-bit Encryption
            </span>
          </div>
        </div>
      </section>

      {/* Main Checkout Columns */}
      <section className="px-4 sm:px-6 lg:px-8 mt-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer & Shipping Details */}
          <div className="lg:col-span-7 xl:col-span-8">
            <ShippingForm ref={checkoutRef} setIsPending={setIsPending} />
          </div>

          {/* Right Column: Order Summary & Instant Checkout */}
          <div className="lg:col-span-5 xl:col-span-4">
            <Overview
              ref={checkoutRef}
              isCheckout={true}
              isPending={isPending}
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default CheckoutPage;
