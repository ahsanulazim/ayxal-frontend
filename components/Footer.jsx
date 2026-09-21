"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaFacebook,
  FaInstagram,
  FaXTwitter,
  FaPinterest,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaCcApplePay,
  FaGooglePay,
  FaMedal,
} from "react-icons/fa6";
import {
  LuTruck,
  LuShieldCheck,
  LuRotateCcw,
  LuHeartHandshake,
  LuMail,
  LuPhone,
  LuClock,
  LuArrowRight,
  LuLock,
} from "react-icons/lu";

const perks = [
  {
    icon: LuTruck,
    title: "Free Express Shipping",
    desc: "On all qualifying orders over $49",
  },
  {
    icon: LuShieldCheck,
    title: "100% Secure Checkout",
    desc: "Bank-grade 256-bit SSL encrypted",
  },
  {
    icon: LuRotateCcw,
    title: "14-Day Easy Returns",
    desc: "Hassle-free refunds or exchanges",
  },
  {
    icon: LuHeartHandshake,
    title: "Dedicated Pet Support",
    desc: "Friendly guidance from pet experts",
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    toast.success(
      "Welcome to the PrettyPet VIP Club! Check your inbox for a 10% coupon code.",
    );
    setEmail("");
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300">
      {/* 1. Value Proposition / Perks Top Banner */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/60">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-zinc-800/30 border border-zinc-800/60 hover:border-main/40 transition-colors"
                >
                  <div className="size-11 rounded-xl bg-main/15 text-main flex items-center justify-center shrink-0">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {perk.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Content */}
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Column 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/pretypet-logo.svg"
                alt="PrettyPet Logo"
                width={150}
                height={45}
                className="brightness-0 invert opacity-95"
              />
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              PrettyPet is your dedicated destination for premium, pet-safe
              essentials. We curate wholesome treats, cozy beds, engaging toys,
              and stylish gear designed to keep your pets healthy, active, and
              happy.
            </p>

            {/* Quick Contact Information */}
            <div className="space-y-2.5 pt-1 text-xs text-zinc-400">
              <div className="flex items-center gap-2.5">
                <LuMail className="size-4 text-main shrink-0" />
                <a
                  href="mailto:support@prettypet.com"
                  className="hover:text-white transition-colors"
                >
                  support@prettypet.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <LuPhone className="size-4 text-main shrink-0" />
                <a
                  href="tel:+18005557387"
                  className="hover:text-white transition-colors"
                >
                  +1 (800) 555-PETS (+1 800-555-7387)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <LuClock className="size-4 text-main shrink-0" />
                <span>Sun – Thu: 9:00 AM – 6:00 PM EST</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">
                Connect With Us
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/PretypetGlobal"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="size-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-main hover:border-main transition-all"
                >
                  <FaFacebook size={16} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="size-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-main hover:border-main transition-all"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter / X"
                  className="size-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-main hover:border-main transition-all"
                >
                  <FaXTwitter size={16} />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Pinterest"
                  className="size-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-main hover:border-main transition-all"
                >
                  <FaPinterest size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Shop (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Shop Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  All Pet Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/travel-and-outdoor"
                  className="hover:text-white transition-colors"
                >
                  Travel and Outdoor
                </Link>
              </li>
              <li>
                <Link
                  href="/products/grooming-and-hygiene"
                  className="hover:text-white transition-colors"
                >
                  Grooming and Hygiene
                </Link>
              </li>
              <li>
                <Link
                  href="/products/feeding-and-nutrition"
                  className="hover:text-white transition-colors"
                >
                  Feeding and Nutrition
                </Link>
              </li>
              <li>
                <Link
                  href="/products/pet-toy"
                  className="hover:text-white transition-colors"
                >
                  Pet Toy
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors"
                >
                  <span>Special Offers &amp; Deals</span>
                  <span className="badge badge-xs bg-amber-400 text-zinc-950 font-bold border-0">
                    SALE
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  My Account &amp; Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="hover:text-white transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us &amp; Support
                </Link>
              </li>
              <li>
                <Link
                  href="/return-and-refund-policy"
                  className="hover:text-white transition-colors"
                >
                  Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Club (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-main/20 text-emerald-300 text-xs font-semibold border border-main/30">
              <FaMedal className="size-3.5" />
              <span>PrettyPet VIP Club</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Get 10% Off Your First Order
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Subscribe to unlock secret flash deals, new pet care guides, and
              exclusive voucher codes directly to your inbox.
            </p>

            {isSubscribed ? (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                🎉 <strong>You&apos;re in!</strong> Use coupon code{" "}
                <span className="font-mono bg-emerald-900 px-1.5 py-0.5 rounded text-white font-bold">
                  WELCOME10
                </span>{" "}
                at checkout for 10% off.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input input-sm bg-zinc-900 border-zinc-800 focus:border-main focus:outline-0 text-xs text-white placeholder:text-zinc-500 rounded-xl w-full"
                  />
                  <button
                    type="submit"
                    className="btn btn-main btn-sm rounded-xl px-4 shrink-0 flex items-center gap-1"
                  >
                    <span>Join</span>
                    <LuArrowRight className="size-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500">
                  <LuLock className="inline-block" /> We respect your privacy.
                  No spam, unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. Bottom Sub-Footer */}
      <div className="border-t border-zinc-800/80 bg-zinc-950">
        <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright & Operator */}
            <div className="text-xs text-zinc-400 text-center md:text-left">
              <p>
                © {new Date().getFullYear()}{" "}
                <span className="text-white font-semibold">PretyPet</span>. All
                rights reserved. Operated by{" "}
                <a
                  href="https://ayxal.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-300 hover:text-white underline font-medium"
                >
                  Ayxal LLC
                </a>
                .
              </p>
            </div>

            {/* Payment Method Badges */}
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-xs text-zinc-500 mr-1 hidden sm:inline">
                Guaranteed Safe Checkout:
              </span>
              <div className="flex items-center gap-2 text-2xl">
                <span
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:text-white transition-colors"
                  title="Visa"
                >
                  <FaCcVisa className="size-5" />
                </span>
                <span
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:text-white transition-colors"
                  title="Mastercard"
                >
                  <FaCcMastercard className="size-5" />
                </span>
                <span
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:text-white transition-colors"
                  title="American Express"
                >
                  <FaCcAmex className="size-5" />
                </span>
                <span
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:text-white transition-colors"
                  title="PayPal"
                >
                  <FaCcPaypal className="size-5" />
                </span>
                <span
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:text-white transition-colors"
                  title="Apple Pay"
                >
                  <FaCcApplePay className="size-5" />
                </span>
                <span
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 hover:text-white transition-colors"
                  title="Google Pay"
                >
                  <FaGooglePay className="size-5" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
