"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getAvailableCoupons } from "@/api/couponApi";
import { getAllProducts } from "@/api/productApi";
import OffersHero from "@/components/offers/OffersHero";
import OffersCoupons from "@/components/offers/OffersCoupons";
import OffersDealsGrid from "@/components/offers/OffersDealsGrid";
import OffersPerks from "@/components/offers/OffersPerks";
import OffersNewsletter from "@/components/offers/OffersNewsletter";
import { LuHouse } from "react-icons/lu";

const OffersContent = () => {
  // 1. Fetch available promo coupons from backend
  const { data: couponsData, isLoading: isCouponsLoading } = useQuery({
    queryKey: ["availableCoupons"],
    queryFn: getAvailableCoupons,
    staleTime: 1000 * 60 * 10,
  });

  // 2. Fetch products for deals showcase
  const { data: productsData, isLoading: isProductsLoading } = useQuery({
    queryKey: ["allProducts", 1, "", 16],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5,
  });

  const coupons = couponsData?.coupons || [];
  const products = productsData?.products || [];

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs text-xs text-base-content/60">
        <ul>
          <li>
            <Link href="/" className="hover:text-main flex items-center gap-1">
              <LuHouse className="size-3.5" />
              <span>Home</span>
            </Link>
          </li>
          <li className="font-semibold text-base-content">Offers &amp; Deals</li>
        </ul>
      </nav>

      {/* 1. Flash Deals Hero Banner */}
      <OffersHero />

      {/* 2. Available Promo Codes & Coupons */}
      <OffersCoupons coupons={coupons} isLoading={isCouponsLoading} />

      {/* 3. Discounted Products Showcase */}
      <OffersDealsGrid products={products} isLoading={isProductsLoading} />

      {/* 4. PrettyPet Guarantees & Perks */}
      <OffersPerks />

      {/* 5. VIP Newsletter Coupon Unlock */}
      <OffersNewsletter />
    </div>
  );
};

export default OffersContent;
