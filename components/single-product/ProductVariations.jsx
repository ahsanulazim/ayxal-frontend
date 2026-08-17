import { LuCheck, LuX } from "react-icons/lu";
import {
  calculateFinalPrice,
  findBestVariationForAttribute,
  formatLabel,
  formatPrice,
  getAttributeOptions,
  getImageUrl,
  isAttributeOptionAvailable,
} from "./utils";

export default function ProductVariations({
  product,
  selectedAttributes,
  onChange,
}) {
  if (
    !product?.hasVariations ||
    !product?.variations?.length ||
    !product?.attributes?.length
  ) {
    return null;
  }
  const handleAttributeChange = (attribute, value) => {
    /*
     * Clicking already selected option
     */
    if (selectedAttributes?.[attribute] === value) {
      return;
    }

    /*
     * Find best in-stock variation
     * for clicked value
     */
    const bestVariation = findBestVariationForAttribute({
      variations: product.variations,
      attributes: product.attributes,
      selectedAttributes,
      changedAttribute: attribute,
      value,
    });

    /*
     * যদি এই attribute value-এর কোনো
     * in-stock combination না থাকে,
     * selection allow করছি না।
     */
    if (!bestVariation) {
      return;
    }

    /*
     * Rebuild full selected attributes
     * from matched variation.
     *
     * Example:
     *
     * clicked orange while blue+s selected
     *
     * orange+s unavailable
     * orange+l available
     *
     * becomes:
     *
     * {
     *   color: "orange",
     *   size: "l"
     * }
     */
    const nextSelectedAttributes = product.attributes.reduce(
      (result, currentAttribute) => {
        result[currentAttribute] = bestVariation[currentAttribute];

        return result;
      },
      {},
    );

    onChange(nextSelectedAttributes);
  };
  return (
    <div className="mt-8">
      {product.attributes.map((attribute) => {
        const values = getAttributeOptions(product.variations, attribute);

        return (
          <div key={attribute}>
            {/* Attribute title */}

            <div className="mb-3 flex items-center gap-2">
              <span className="font-semibold">{formatLabel(attribute)}</span>

              <span className="text-zinc-300">:</span>

              <span className="text-sm font-medium capitalize text-zinc-600">
                {formatLabel(selectedAttributes?.[attribute])}
              </span>
            </div>

            {/* Attribute options */}

            <div className="flex flex-wrap gap-3">
              {values.map((value) => {
                const active = selectedAttributes?.[attribute] === value;

                const available = isAttributeOptionAvailable({
                  variations: product.variations,
                  attributes: product.attributes,
                  selectedAttributes,
                  attribute,
                  value,
                });

                /*
                 * For color selector we can show image.
                 *
                 * Find any variation of this color.
                 */
                const exampleVariation = product.variations.find(
                  (variation) => variation?.[attribute] === value,
                );

                const image =
                  attribute === "color"
                    ? getImageUrl(exampleVariation?.thumbnail)
                    : null;

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={!available}
                    onClick={() => handleAttributeChange(attribute, value)}
                    className={`
                      relative flex items-center gap-2
                      rounded-xl border-2 transition

                      ${
                        attribute === "color"
                          ? "p-2 pr-4"
                          : "min-w-14.5 justify-center px-4 py-2.5"
                      }

                      ${
                        active
                          ? "border-emerald-600 bg-emerald-50"
                          : "border-zinc-200 bg-white"
                      }

                      ${
                        available
                          ? "hover:border-emerald-400"
                          : "cursor-not-allowed opacity-40"
                      }
                    `}
                  >
                    {image && (
                      <img
                        src={image}
                        alt={formatLabel(value)}
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                    )}

                    <span className="text-sm font-semibold">
                      {formatLabel(value)}
                    </span>

                    {active && available && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <LuCheck size={12} strokeWidth={3} />
                      </span>
                    )}

                    {!available && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-400 text-white">
                        <LuX size={11} strokeWidth={3} />
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
