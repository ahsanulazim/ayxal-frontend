"use client";

import { useContext } from "react";
import { MyContext } from "@/context/MyProvider";
import { useWishlist } from "@/context/WishlistContext";
import { getWishlistProducts } from "@/api/usersApi";
import { getAllProducts } from "@/api/productApi";
import { useQuery } from "@tanstack/react-query";

// Modular Components
import WishlistHeader from "@/components/account/wishlist/WishlistHeader";
import WishlistCard from "@/components/account/wishlist/WishlistCard";
import WishlistEmptyState from "@/components/account/wishlist/WishlistEmptyState";
import WishlistGuestBanner from "@/components/account/wishlist/WishlistGuestBanner";

const WishlistPage = () => {
  const { newUser } = useContext(MyContext);
  const email = newUser?.user?.email;
  const { wishlistIds, wishlistCount, toggleWishlist } = useWishlist();

  // 1. For logged-in users: Fetch wishlist products directly from backend
  const { data: userWishlistData, isLoading: isUserWishlistLoading } = useQuery({
    queryKey: ["wishlistProducts", email],
    queryFn: () => getWishlistProducts(email),
    enabled: !!email,
  });

  // 2. For guest users: Fetch products from catalog matching guest wishlist IDs
  const { data: catalogData, isLoading: isCatalogLoading } = useQuery({
    queryKey: ["guestWishlistProducts", wishlistIds],
    queryFn: () => getAllProducts({ queryKey: ["allProducts", 1, "", 50] }),
    enabled: !email && wishlistIds.length > 0,
  });

  // Determine products to display
  let products = [];
  if (email) {
    products = userWishlistData?.products || [];
  } else {
    const catalogProducts = catalogData?.products || [];
    products = catalogProducts.filter((p) =>
      wishlistIds.includes(String(p._id)) || wishlistIds.includes(String(p.slug))
    );
  }

  const isLoading = email ? isUserWishlistLoading : isCatalogLoading;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <WishlistHeader count={wishlistCount} />

      {/* 2. Guest Info Banner (if not logged in) */}
      {!email && <WishlistGuestBanner />}

      {/* 3. Wishlist Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-64 bg-base-100 rounded-3xl border border-base-200 animate-pulse"
            />
          ))}
        </div>
      ) : wishlistCount === 0 || products.length === 0 ? (
        <WishlistEmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <WishlistCard
              key={product._id || product.slug}
              product={product}
              onRemove={toggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
