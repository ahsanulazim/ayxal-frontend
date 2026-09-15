import { LuCheck, LuX } from "react-icons/lu";
import {
  calculateFinalPrice,
  findBestVariationForAttribute,
  formatLabel,
  formatPrice,
  getAttributeOptions,
  getImageUrl,
  isAttributeOptionAvailable,
  getNormalizedAttributes,
  getAttributeKey,
  getAttributeName,
  getVariationAttributeValue,
} from "./utils";

export default function ProductVariations({
  product,
  selectedAttributes,
  onChange,
}) {
  const attributes = getNormalizedAttributes(product);

  if (
    !product?.hasVariations ||
    !product?.variations?.length ||
    !attributes.length
  ) {
    return null;
  }

  const handleAttributeChange = (attribute, value) => {
    const attrKey = getAttributeKey(attribute);

    // Clicking already selected option
    if (selectedAttributes?.[attrKey] === value) {
      return;
    }

    // Find best in-stock variation for clicked value
    const bestVariation = findBestVariationForAttribute({
      variations: product.variations,
      attributes,
      selectedAttributes,
      changedAttribute: attribute,
      value,
    });

    if (!bestVariation) {
      return;
    }

    // Rebuild full selected attributes from matched variation
    const nextSelectedAttributes = attributes.reduce(
      (result, currentAttribute) => {
        const key = getAttributeKey(currentAttribute);
        result[key] = getVariationAttributeValue(bestVariation, currentAttribute);
        return result;
      },
      {},
    );

    onChange(nextSelectedAttributes);
  };

  return (
    <div className="mt-6 space-y-5">
      {attributes.map((attribute) => {
        const attrKey = getAttributeKey(attribute);
        const attrName = getAttributeName(attribute);
        const values = getAttributeOptions(product.variations, attribute);

        if (!values.length) return null;

        // Check if options under this attribute have distinct image thumbnails
        const optionImageMap = {};
        values.forEach((val) => {
          const matching = product.variations.find(
            (v) => getVariationAttributeValue(v, attribute) === val,
          );
          const url = getImageUrl(matching?.thumbnail);
          if (url) optionImageMap[val] = url;
        });

        const distinctImageCount = new Set(Object.values(optionImageMap)).size;
        const showThumbnails = distinctImageCount > 1;

        return (
          <div key={attrKey}>
            {/* Attribute title */}
            <div className="mb-2.5 flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-900">
                {formatLabel(attrName)}
              </span>

              <span className="text-zinc-300">:</span>

              <span className="text-sm font-semibold text-main capitalize">
                {formatLabel(selectedAttributes?.[attrKey])}
              </span>
            </div>

            {/* Attribute options */}
            <div className="flex flex-wrap gap-2.5">
              {values.map((value) => {
                const active = selectedAttributes?.[attrKey] === value;

                const available = isAttributeOptionAvailable({
                  variations: product.variations,
                  attributes,
                  selectedAttributes,
                  attribute,
                  value,
                });

                const image = optionImageMap[value];
                const hasImagePreview = showThumbnails && Boolean(image);

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={!available}
                    onClick={() => handleAttributeChange(attribute, value)}
                    className={`
                      relative flex items-center gap-2 rounded-xl border-2 transition-all duration-150 select-none cursor-pointer

                      ${
                        hasImagePreview
                          ? "p-1.5 pr-3.5"
                          : "min-w-12 justify-center px-3.5 py-2"
                      }

                      ${
                        active
                          ? "border-main bg-main/5 text-main font-bold shadow-xs"
                          : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
                      }

                      ${
                        available
                          ? "hover:border-main/50"
                          : "cursor-not-allowed opacity-40 line-through bg-zinc-50 text-zinc-400"
                      }
                    `}
                  >
                    {hasImagePreview && (
                      <img
                        src={image}
                        alt={formatLabel(value)}
                        className="h-10 w-10 rounded-lg object-contain bg-zinc-50 border border-zinc-100"
                      />
                    )}

                    <span className="text-sm">
                      {formatLabel(value)}
                    </span>

                    {active && available && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-main text-white shadow-xs">
                        <LuCheck size={11} strokeWidth={3} />
                      </span>
                    )}

                    {!available && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-zinc-400 text-white">
                        <LuX size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
