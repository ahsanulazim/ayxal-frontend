"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/skeleton/ProductCardSkeleton";
import { LuArrowRight, LuFlame, LuTag } from "react-icons/lu";

const dealTabs = [
  { key: "all", label: "All Featured Deals" },
  { key: "under20", label: "Under $20 Treats & Toys" },
  { key: "under35", label: "Under $35 Essentials" },
];

const OffersDealsGrid = ({ products = [], isLoading = false }) => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = products.filter((p) => {
    const rawPrice =
      Number(
        p.price ||
          (p.hasVariations && p.variations?.[0]?.price) ||
          p.basePrice ||
          0
      ) || 0;

    if (activeTab === "under20") return rawPrice > 0 && rawPrice <= 20;
    if (activeTab === "under35") return rawPrice > 0 && rawPrice <= 35;
    return true;
  });

  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
              <LuFlame className="size-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-base-content tracking-tight">
              Special Discounted Products
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Hand-picked value picks, bundle savings, and limited pet accessories on special prices.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 bg-base-100 p-1.5 rounded-2xl border border-base-200 shadow-xs">
          {dealTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "bg-main text-white shadow-xs"
                  : "text-base-content/70 hover:bg-base-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-base-100 rounded-3xl p-10 text-center border border-base-200 space-y-3">
          <LuTag className="size-8 text-base-content/30 mx-auto" />
          <p className="text-xs sm:text-sm text-base-content/60">
            No products found matching this price filter right now. Check our full catalog!
          </p>
          <Link href="/products" className="btn btn-main btn-sm rounded-xl px-5">
            Browse All Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id || product.slug} product={product} />
          ))}
        </div>
      )}

      {/* Explore More Button */}
      <div className="text-center pt-2">
        <Link
          href="/search"
          className="btn btn-outline border-main text-main hover:bg-main hover:text-white rounded-2xl text-xs sm:text-sm font-bold px-8 shadow-xs"
        >
          View All Pet Products <LuArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
};

export default OffersDealsGrid;
