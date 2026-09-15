"use client";

import { getAllProducts } from "@/api/productApi";
import { getUserData, toggleWishlist } from "@/api/usersApi";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useContext } from "react";
import { LuHeart, LuPackage, LuShoppingBag, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const { newUser, addToCart } = useContext(MyContext);
  const email = newUser?.user?.email;
  const queryClient = useQueryClient();

  const { data: userDataResp, isLoading: isUserLoading } = useQuery({
    queryKey: ["userData", email],
    queryFn: () => getUserData(email),
    enabled: !!email,
  });

  const { data: allProductsResp, isLoading: isProductsLoading } = useQuery({
    queryKey: ["allProducts", 1, "", 50],
    queryFn: getAllProducts,
  });

  const wishlistIds = userDataResp?.user?.wishlist || [];
  const allProducts = allProductsResp?.products || [];

  // Filter products matching wishlist IDs
  const wishlistProducts = allProducts.filter((p) =>
    wishlistIds.includes(p.pid || p._id)
  );

  const toggleMutation = useMutation({
    mutationFn: (productId) => toggleWishlist(email, productId),
    onSuccess: (data) => {
      toast.success(data?.message || "Wishlist updated");
      queryClient.invalidateQueries({ queryKey: ["userData", email] });
    },
    onError: () => {
      toast.error("Failed to update wishlist");
    },
  });

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(
        {
          pid: product.pid,
          productNameEn: product.productNameEn,
          sellPrice: product.sellPrice,
          bigImage: product.bigImage,
        },
        "default",
        1
      );
      toast.success("Item added to cart!");
    }
  };

  const isLoading = isUserLoading || isProductsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
          <LuHeart className="size-6 text-main fill-main/20" /> My Wishlist
        </h2>
        <p className="text-xs text-base-content/60 mt-1">
          Saved pet treats, grooming items, and supplies you love.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-64 bg-base-100 rounded-3xl border border-base-200 animate-pulse"
            />
          ))}
        </div>
      ) : wishlistIds.length === 0 ? (
        <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-main/10 text-main flex items-center justify-center mx-auto">
            <LuHeart className="size-8" />
          </div>
          <h3 className="font-bold text-lg text-base-content">Your wishlist is empty</h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            Explore our pet catalogue and tap the heart icon on any product to save it for later.
          </p>
          <Link href="/" className="btn btn-main btn-sm rounded-xl px-6 mt-2">
            Explore Pet Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistProducts.map((product) => {
            const price = product.sellPrice
              ? Number(product.sellPrice.split("-")[0]) + 15
              : 0;

            return (
              <div
                key={product.pid || product._id}
                className="group bg-base-100 rounded-3xl p-4 border border-base-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square w-full rounded-2xl bg-base-200 overflow-hidden relative mb-3">
                    {product.bigImage ? (
                      <img
                        src={product.bigImage}
                        alt={product.productNameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base-content/40">
                        <LuPackage className="size-8" />
                      </div>
                    )}

                    <button
                      onClick={() => toggleMutation.mutate(product.pid || product._id)}
                      className="absolute top-2 right-2 btn btn-xs btn-circle bg-base-100/80 backdrop-blur-xs text-error hover:bg-base-100 border-0 shadow-sm"
                      title="Remove from wishlist"
                    >
                      <LuTrash2 className="size-3.5" />
                    </button>
                  </div>

                  <h4 className="font-bold text-xs sm:text-sm text-base-content line-clamp-2">
                    {product.productNameEn}
                  </h4>
                  <p className="font-bold text-sm text-main mt-1.5">
                    ${price.toFixed(2)}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-base-200">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-main btn-sm rounded-xl w-full text-xs gap-1.5"
                  >
                    <LuShoppingBag className="size-3.5" /> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
