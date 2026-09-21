"use client";

import Link from "next/link";
import { LuHeart } from "react-icons/lu";
import { useWishlist } from "@/context/WishlistContext";

const ProductCard = ({ product }) => {
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Variant stock checking
  const firstVariantWithStock = product?.variantDetails?.find((v) =>
    v.sizes?.some((s) => s.stock > 0),
  );
  const isOutOfStock =
    product?.stock === 0 ||
    product?.baseStock === 0 ||
    (product?.variantDetails && !firstVariantWithStock);

  const categorySlug = product?.categorySlug || product?.category || "all";
  const productSlug = product?.slug || product?._id || product?.pid;
  const isSaved = isWishlisted(product?._id) || isWishlisted(productSlug);

  // Safe price formatting
  let displayPrice = "0.00";
  if (product?.price !== undefined && product?.price !== null) {
    displayPrice = String(product.price);
  } else if (product?.hasVariations && product?.variations?.[0]?.price) {
    displayPrice = String(product.variations[0].price);
  } else if (product?.basePrice !== undefined && product?.basePrice !== null) {
    displayPrice = Number(product.basePrice).toFixed(2);
  }

  const imageUrl =
    product?.thumbnail?.url ||
    product?.thumbnail ||
    (Array.isArray(product?.images) && product.images[0]?.url) ||
    "/default-product.jpg";

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl border border-base-200/80 overflow-clip group relative">
      <Link href={`/products/${categorySlug}/${productSlug}`}>
        <figure className="relative bg-base-200/40 aspect-square overflow-hidden">
          {!isOutOfStock ? (
            <div className="badge badge-success text-white badge-sm font-medium absolute top-2.5 left-2.5 z-10">
              New
            </div>
          ) : (
            <div className="badge badge-neutral text-white badge-sm font-medium absolute top-2.5 left-2.5 z-10">
              Out of Stock
            </div>
          )}

          {/* Floating Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`absolute top-2.5 right-2.5 z-10 btn btn-circle btn-xs sm:btn-sm border-0 shadow-sm backdrop-blur-xs transition-all ${
              isSaved
                ? "bg-red-50 text-red-500 hover:bg-red-100 scale-105"
                : "bg-white/85 hover:bg-white text-base-content/60 hover:text-red-500"
            }`}
            aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
            title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          >
            <LuHeart className={`size-3.5 sm:size-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          <img
            src={imageUrl}
            alt={product?.title || "Pet Product"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </figure>
      </Link>
      <div className="card-body p-3.5 flex flex-col justify-between flex-1 gap-2">
        <div>
          {product?.category && (
            <span className="text-[11px] font-medium text-main uppercase tracking-wider block mb-0.5 truncate">
              {product.category}
            </span>
          )}
          <Link href={`/products/${categorySlug}/${productSlug}`}>
            <h2 className="card-title text-xs xs:text-sm font-semibold text-base-content line-clamp-2 leading-snug group-hover:text-main transition-colors">
              {product?.title || "Pet Product"}
            </h2>
          </Link>
        </div>

        <div className="pt-1">
          <p className="font-extrabold text-sm xs:text-base text-base-content">
            ${displayPrice}
          </p>
          <div className="card-actions mt-2.5">
            <Link
              href={`/products/${categorySlug}/${productSlug}`}
              className="btn btn-sm w-full btn-main rounded-xl font-medium"
            >
              View Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

