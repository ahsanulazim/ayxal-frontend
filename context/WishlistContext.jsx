"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { MyContext } from "@/context/MyProvider";
import { getUserData, toggleWishlist as apiToggleWishlist, getWishlistProducts } from "@/api/usersApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { newUser } = useContext(MyContext);
  const email = newUser?.user?.email;
  const queryClient = useQueryClient();

  // Guest wishlist fallback in localStorage
  const [guestWishlist, setGuestWishlist] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("pretypet_guest_wishlist");
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.error("Failed to read guest wishlist:", e);
      }
    }
    return [];
  });

  // Query authenticated user data
  const { data: userDataResp, isLoading: isUserLoading } = useQuery({
    queryKey: ["userData", email],
    queryFn: () => getUserData(email),
    enabled: !!email,
    staleTime: 1000 * 60 * 5,
  });

  const authenticatedWishlistIds = useMemo(() => {
    return (userDataResp?.user?.wishlist || []).map(String);
  }, [userDataResp]);

  // Unified wishlist IDs
  const wishlistIds = useMemo(() => {
    return email ? authenticatedWishlistIds : guestWishlist.map(String);
  }, [email, authenticatedWishlistIds, guestWishlist]);

  const wishlistCount = wishlistIds.length;

  // Check if a product is saved
  const isWishlisted = useCallback(
    (productId) => {
      if (!productId) return false;
      const strId = String(productId);
      return wishlistIds.includes(strId);
    },
    [wishlistIds]
  );

  // Toggle wishlist function
  const toggleWishlist = useCallback(
    async (product) => {
      const productId = product?._id || product?.slug || product?.pid || product;
      if (!productId) return;
      const strId = String(productId);
      const currentlySaved = wishlistIds.includes(strId);

      if (email) {
        // Authenticated user
        try {
          const res = await apiToggleWishlist(email, strId);
          queryClient.invalidateQueries({ queryKey: ["userData", email] });
          queryClient.invalidateQueries({ queryKey: ["wishlistProducts", email] });
          
          if (!currentlySaved) {
            toast.success("Saved to your wishlist! ❤️");
          } else {
            toast.info("Removed from your wishlist");
          }
          return res;
        } catch (err) {
          console.error("Error toggling wishlist:", err);
          toast.error("Could not update wishlist. Please try again.");
        }
      } else {
        // Guest user fallback
        setGuestWishlist((prev) => {
          let updated;
          if (prev.includes(strId)) {
            updated = prev.filter((id) => id !== strId);
            toast.info("Removed from your wishlist");
          } else {
            updated = [...prev, strId];
            toast.success("Saved to your wishlist! ❤️ (Login to sync across devices)");
          }
          try {
            localStorage.setItem("pretypet_guest_wishlist", JSON.stringify(updated));
          } catch (e) {
            console.error("Failed to persist guest wishlist:", e);
          }
          return updated;
        });
      }
    },
    [email, wishlistIds, queryClient]
  );

  const value = useMemo(
    () => ({
      wishlistIds,
      wishlistCount,
      isWishlisted,
      toggleWishlist,
      isUserLoading,
    }),
    [wishlistIds, wishlistCount, isWishlisted, toggleWishlist, isUserLoading]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
