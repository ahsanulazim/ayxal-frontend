import { useState } from "react";
import ProductVariations from "./ProductVariations";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "./ProductActions";

import { formatPrice, calculateFinalPrice } from "./utils";
import {
  LuCheck,
  LuStar,
  LuShare2,
  LuTruck,
  LuShieldCheck,
  LuRotateCcw,
  LuLock,
  LuCircleAlert,
  LuCircleX,
} from "react-icons/lu";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ProductInfo({
  product,
  selectedVariation,
  selectedAttributes,
  onAttributesChange,
  quantity,
  setQuantity,
}) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [copied, setCopied] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const price = selectedVariation?.price ?? product.basePrice ?? 0;
  const discount = selectedVariation?.discount ?? product.baseDiscount ?? 0;
  const stock = selectedVariation?.stock ?? product.baseStock ?? 0;
  const finalPrice = calculateFinalPrice(price, discount);
  const savings =
    discount > 0 ? (Number(price) - Number(finalPrice)).toFixed(2) : 0;
  const outOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  // Add to cart handler
  const handleAddToCart = () => {
    setIsAdding(true);
    try {
      const res = addToCart({
        product,
        variation: selectedVariation,
        quantity,
      });
      if (res?.success) {
        toast.success(res.message || "Added to cart!");
      } else {
        toast.error(res?.message || "Failed to add to cart");
      }
    } finally {
      setTimeout(() => setIsAdding(false), 300);
    }
  };

  // Buy Now handler
  const handleBuyNow = () => {
    const res = addToCart({
      product,
      variation: selectedVariation,
      quantity,
    });
    if (res?.success) {
      toast.success(res.message || "Proceeding to checkout...");
      router.push("/cart/checkout");
    } else {
      toast.error(res?.message || "Failed to proceed to checkout");
    }
  };

  // Share handler
  const handleShare = async () => {
    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Product link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } else if (navigator?.share) {
        await navigator.share({
          title: product.title,
          url: window.location.href,
        });
      }
    } catch {
      toast.info("Could not copy link automatically");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Brand & Meta info bar */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-main/10 text-main uppercase tracking-wider">
            {product.brand || "PretyPet Original"}
          </span>
          {product.sku && (
            <span className="text-xs text-zinc-400 font-mono">
              SKU: {product.sku}
            </span>
          )}
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-main p-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
          title="Share product link"
        >
          <LuShare2 className="w-3.5 h-3.5" />
          <span>{copied ? "Copied!" : "Share"}</span>
        </button>
      </div>

      {/* Product Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-snug">
        {product.title}
      </h1>

      {/* Reviews & Social Proof */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <LuStar key={star} className="w-4 h-4" fill="currentColor" />
          ))}
        </div>
        <span className="text-sm font-bold text-zinc-800">
          {product.rating || "4.8"}
        </span>
        <span className="text-zinc-300">•</span>
        <span className="text-xs sm:text-sm font-medium text-main hover:underline cursor-pointer">
          {product.reviewsCount || "124"} verified reviews
        </span>
      </div>

      {/* Price & Savings Display */}
      <div className="mt-5 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex flex-wrap items-baseline gap-3">
        <span className="text-3xl sm:text-4xl font-black text-main tracking-tight">
          {formatPrice(finalPrice)}
        </span>

        {discount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-lg text-zinc-400 line-through font-medium">
              {formatPrice(price)}
            </span>
            <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
              {discount}% OFF
            </span>
            {Number(savings) > 0 && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                You save ${savings}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Real-time Stock Status */}
      <div className="mt-3.5 flex items-center gap-2">
        {outOfStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200/60 px-3 py-1 text-xs font-semibold text-red-700">
            <LuCircleX className="w-4 h-4 text-red-600" />
            Currently Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/60 px-3 py-1 text-xs font-semibold text-amber-800">
            <LuCircleAlert className="w-4 h-4 text-amber-600 animate-bounce" />
            Only {stock} items left in stock - order soon!
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            In Stock &amp; Ready to Ship
          </span>
        )}
      </div>

      {/* Dynamic Key Highlights / Vital Informations if available */}
      {Array.isArray(product.vitalInformations) &&
      product.vitalInformations.length > 0 ? (
        <div className="mt-5 space-y-2">
          {product.vitalInformations.slice(0, 4).map((info, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-sm text-zinc-700"
            >
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-main/10 text-main">
                <LuCheck className="w-3 h-3 stroke-[3]" />
              </span>
              <span>
                <strong className="text-zinc-900 font-semibold">
                  {info.label}:
                </strong>{" "}
                {info.value}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {/* Variations Selector */}
      <ProductVariations
        product={product}
        selectedAttributes={selectedAttributes}
        onChange={onAttributesChange}
      />

      {/* Quantity Selector */}
      <QuantitySelector
        quantity={quantity}
        stock={stock}
        onChange={setQuantity}
      />

      {/* Action Buttons */}
      <ProductActions
        outOfStock={outOfStock}
        isAdding={isAdding}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        product={product}
        price={finalPrice}
      />

      {/* Pet Store Trust Badges & Guarantee */}
      <div className="mt-8 border-t border-zinc-200 pt-6 grid grid-cols-2 gap-3 sm:gap-4 text-xs text-zinc-600">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50/80 border border-zinc-100">
          <LuTruck className="w-5 h-5 text-main shrink-0" />
          <div>
            <p className="font-semibold text-zinc-900">
              {product.freeShipping ? "Free Delivery" : "Fast Delivery"}
            </p>
            <p className="text-[11px] text-zinc-500">2-4 business days</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50/80 border border-zinc-100">
          <LuShieldCheck className="w-5 h-5 text-main shrink-0" />
          <div>
            <p className="font-semibold text-zinc-900">100% Pet-Safe</p>
            <p className="text-[11px] text-zinc-500">
              Tested &amp; certified non-toxic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50/80 border border-zinc-100">
          <LuRotateCcw className="w-5 h-5 text-main shrink-0" />
          <div>
            <p className="font-semibold text-zinc-900">30-Day Returns</p>
            <p className="text-[11px] text-zinc-500">Hassle-free exchange</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-50/80 border border-zinc-100">
          <LuLock className="w-5 h-5 text-main shrink-0" />
          <div>
            <p className="font-semibold text-zinc-900">Secure Checkout</p>
            <p className="text-[11px] text-zinc-500">SSL Encrypted Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}
