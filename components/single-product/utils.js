export function getImageUrl(image) {
  if (!image) return "";

  if (typeof image === "string") {
    return image;
  }

  if (typeof image === "object") {
    return image?.url || "";
  }

  return "";
}

export function calculateFinalPrice(price = 0, discount = 0) {
  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;

  if (!numericDiscount) return numericPrice;

  return numericPrice - (numericPrice * numericDiscount) / 100;
}

export function formatPrice(price) {
  return `$${Number(price || 0).toFixed(2)}`;
}

export function formatLabel(value = "") {
  return String(value)
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/*
|--------------------------------------------------------------------------
| Get first in-stock variation
|--------------------------------------------------------------------------
*/

export function getDefaultVariation(variations = []) {
  if (!Array.isArray(variations) || !variations.length) {
    return null;
  }

  return (
    variations.find((variation) => Number(variation?.stock) > 0) ||
    variations[0]
  );
}

/*
|--------------------------------------------------------------------------
| Build initial selected attributes
|--------------------------------------------------------------------------
|
| Example:
|
| {
|   color: "blue",
|   size: "s"
| }
|
*/

export function getInitialSelectedAttributes(product) {
  const defaultVariation = getDefaultVariation(product?.variations);

  if (!defaultVariation) {
    return {};
  }

  return (product?.attributes || []).reduce((result, attribute) => {
    result[attribute] = defaultVariation?.[attribute] ?? "";

    return result;
  }, {});
}

/*
|--------------------------------------------------------------------------
| Find exact selected variation
|--------------------------------------------------------------------------
*/

export function findSelectedVariation(
  variations = [],
  selectedAttributes = {},
  attributes = [],
) {
  return (
    variations.find((variation) =>
      attributes.every(
        (attribute) =>
          variation?.[attribute] === selectedAttributes?.[attribute],
      ),
    ) || null
  );
}

/*
|--------------------------------------------------------------------------
| Get unique options for an attribute
|--------------------------------------------------------------------------
*/

export function getAttributeOptions(variations = [], attribute) {
  return [
    ...new Set(
      variations.map((variation) => variation?.[attribute]).filter(Boolean),
    ),
  ];
}

/*
|--------------------------------------------------------------------------
| Check whether attribute value has any in-stock combination
|--------------------------------------------------------------------------
|
| Example:
| selected color = orange
| checking size = l
|
*/

export function isAttributeOptionAvailable({
  variations = [],
  attributes = [],
  selectedAttributes = {},
  attribute,
  value,
}) {
  return variations.some((variation) => {
    if (Number(variation?.stock) <= 0) {
      return false;
    }

    if (variation?.[attribute] !== value) {
      return false;
    }

    /*
     * First attribute যেমন color:
     * শুধু check করবে ঐ color-এর কোনো
     * in-stock variation আছে কিনা।
     */
    if (attribute === attributes[0]) {
      return true;
    }

    /*
     * পরের attributes যেমন size:
     * previous selections respect করবে।
     */
    const attributeIndex = attributes.indexOf(attribute);

    return attributes.slice(0, attributeIndex).every((previousAttribute) => {
      const selectedValue = selectedAttributes?.[previousAttribute];

      if (!selectedValue) {
        return true;
      }

      return variation?.[previousAttribute] === selectedValue;
    });
  });
}
/*
|--------------------------------------------------------------------------
| Find first available variation after changing one attribute
|--------------------------------------------------------------------------
|
| Suppose current:
|
| blue + s
|
| user clicks orange.
|
| orange+s = stock 0
|
| তাহলে automatically প্রথম available orange combination
| যেমন orange+l select করবে।
|
*/

export function findBestVariationForAttribute({
  variations = [],
  attributes = [],
  selectedAttributes = {},
  changedAttribute,
  value,
}) {
  const nextAttributes = {
    ...selectedAttributes,
    [changedAttribute]: value,
  };

  /*
   * First try exact combination
   */
  const exactVariation = findSelectedVariation(
    variations,
    nextAttributes,
    attributes,
  );

  if (exactVariation && Number(exactVariation.stock) > 0) {
    return exactVariation;
  }

  /*
   * Otherwise find first available variation
   * matching newly selected attribute
   */
  return (
    variations.find((variation) => {
      return (
        Number(variation?.stock) > 0 && variation?.[changedAttribute] === value
      );
    }) || null
  );
}
