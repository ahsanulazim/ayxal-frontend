import { LuCheck } from "react-icons/lu";
import {
  calculateFinalPrice,
  formatLabel,
  formatPrice,
  getImageUrl,
} from "./utils";

export default function ProductVariations({
  product,
  selectedVariationIndex,
  onChange,
}) {
  if (!product?.hasVariations || !product?.variations?.length) {
    return null;
  }

  const primaryAttribute = product.attributes?.[0];

  const options = primaryAttribute ? product?.[primaryAttribute] || [] : [];

  return (
    <div className="mt-8">
      <div className="mb-3 font-semibold">
        {formatLabel(primaryAttribute || "Options")}
      </div>

      <div className="flex flex-wrap gap-3">
        {product.variations.map((variation, index) => {
          const rawValue = primaryAttribute
            ? variation[primaryAttribute]
            : `Option ${index + 1}`;

          const matchingOption = options.find(
            (option) => option.value === rawValue,
          );

          const label = matchingOption?.label || formatLabel(rawValue);

          const active = selectedVariationIndex === index;

          return (
            <button
              key={`${rawValue}-${index}`}
              onClick={() => onChange(index)}
              disabled={variation?.stock < 1}
              className={`relative flex items-center gap-3 rounded-xl border-2 p-2 pr-4  ${
                active ? "border-emerald-600 bg-emerald-50" : "border-zinc-200"
              } ${variation?.stock < 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-sm hover:shadow-accent"}`}
            >
              {getImageUrl(variation?.thumbnail) && (
                <img
                  src={getImageUrl(variation?.thumbnail)}
                  alt={label}
                  className="h-12 w-12 rounded-box object-cover"
                />
              )}

              <div className="text-left">
                <div className="text-sm font-semibold">{label}</div>

                <div className="text-xs text-zinc-500">
                  {formatPrice(
                    calculateFinalPrice(variation.price, variation.discount),
                  )}
                </div>
              </div>

              {active && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <LuCheck size={12} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
