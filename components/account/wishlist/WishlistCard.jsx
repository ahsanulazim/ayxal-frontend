"use client";

import Link from "next/link";
import { LuPackage, LuShoppingBag, LuTrash2 } from "react-icons/lu";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

const WishlistCard = ({ product, onRemove }) => {
  const { addToCart } = useCart();

  const categorySlug = product?.categorySlug || product?.category || "all";
  const productSlug = product?.slug || product?._id || product?.pid;

  const imageUrl =
    product?.thumbnail?.url ||
    product?.thumbnail ||
    (Array.isArray(product?.images) && product.images[0]?.url) ||
    "/default-product.jpg";

  // Price formatting
  let displayPrice = "0.00";
  if (product?.price !== undefined && product?.price !== null) {
    displayPrice = String(product.price);
  } else if (product?.hasVariations && product?.variations?.[0]?.price) {
    displayPrice = String(product.variations[0].price);
  } else if (product?.basePrice !== undefined && product?.basePrice !== null) {
    displayPrice = Number(product.basePrice).toFixed(2);
  }

  const handleAddToCart = () => {
    try {
      const variation = product?.hasVariations ? product.variations?.[0] : null;
      addToCart(product, variation, 1);
      toast.success(`"${product?.title || "Item"}" added to cart! 🛍️`);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Could not add to cart");
    }
  };

  return (
    <div className="group bg-base-100 rounded-3xl p-4 border border-base-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Product Image Box */}
        <div className="aspect-square w-full rounded-2xl bg-base-200/50 overflow-hidden relative mb-3">
          <Link href={`/products/${categorySlug}/${productSlug}`}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product?.title || "Product"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base-content/40">
                <LuPackage className="size-8" />
              </div>
            )}
          </Link>

          {/* Remove Action Button */}
          <button
            type="button"
            onClick={() => onRemove(product)}
            className="absolute top-2 right-2 btn btn-xs btn-circle bg-base-100/90 backdrop-blur-xs text-error hover:bg-base-100 border-0 shadow-sm transition-transform active:scale-90"
            title="Remove from wishlist"
            aria-label="Remove from wishlist"
          >
            <LuTrash2 className="size-3.5" />
          </button>
        </div>

        {/* Category & Title */}
        {product?.category && (
          <span className="text-[10px] font-semibold text-main uppercase tracking-wider block mb-0.5 truncate">
            {product.category}
          </span>
        )}

        <Link href={`/products/${categorySlug}/${productSlug}`}>
          <h4 className="font-bold text-xs sm:text-sm text-base-content line-clamp-2 hover:text-main transition-colors">
            {product?.title || "Pet Product"}
          </h4>
        </Link>

        {/* Price */}
        <p className="font-black text-sm sm:text-base text-main mt-1.5">
          ${displayPrice}
        </p>
      </div>

      {/* Add to Cart CTA */}
      <div className="mt-3 pt-3 border-t border-base-200">
        <button
          type="button"
          onClick={handleAddToCart}
          className="btn btn-main btn-sm rounded-xl w-full text-xs font-semibold gap-1.5"
        >
          <LuShoppingBag className="size-3.5" /> Move to Cart
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
