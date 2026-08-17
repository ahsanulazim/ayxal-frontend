import ProductVariations from "./ProductVariations";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "./ProductActions";

import { formatPrice, calculateFinalPrice } from "./utils";
import { LuCheck, LuStar } from "react-icons/lu";

export default function ProductInfo({
  product,
  selectedVariation,
  selectedVariationIndex,
  quantity,
  setQuantity,
  onVariationChange,
}) {
  const price = selectedVariation?.price ?? product.basePrice ?? 0;

  const discount = selectedVariation?.discount ?? product.baseDiscount ?? 0;

  const stock = selectedVariation?.stock ?? product.baseStock ?? 0;

  const finalPrice = calculateFinalPrice(price, discount);

  const outOfStock = stock <= 0;

  const addToCart = () => {
    console.log({
      product,
      variation: selectedVariation,
      quantity,
      price: finalPrice,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold leading-tight">{product.title}</h1>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex text-amber-400">
          {[1, 2, 3, 4, 5].map((star) => (
            <LuStar key={star} size={18} fill="currentColor" />
          ))}
        </div>

        <span className="font-semibold">4.8</span>

        <span className="text-sm text-emerald-700">124 reviews</span>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-3xl font-bold text-emerald-700">
          {formatPrice(finalPrice)}
        </span>

        {discount > 0 && (
          <>
            <span className="text-lg text-zinc-400 line-through">
              {formatPrice(price)}
            </span>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              {discount}% OFF
            </span>
          </>
        )}
      </div>

      <div className="mt-3">
        {outOfStock ? (
          <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
            Out of stock
          </span>
        ) : (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            {stock} in stock
          </span>
        )}
      </div>

      <div className="mt-7 space-y-3">
        {[
          "Portable and lightweight design",
          "One-button water outlet",
          "Easy to clean",
          "Perfect for outdoor walks",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <LuCheck size={13} />
            </span>

            {item}
          </div>
        ))}
      </div>

      <ProductVariations
        product={product}
        selectedVariationIndex={selectedVariationIndex}
        onChange={onVariationChange}
      />

      <QuantitySelector
        quantity={quantity}
        stock={stock}
        onChange={setQuantity}
      />

      <ProductActions outOfStock={outOfStock} onAddToCart={addToCart} />
    </div>
  );
}
