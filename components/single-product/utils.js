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

export const getDefaultVariationIndex = (variations = []) => {
  if (!variations.length) return 0;

  const inStockIndex = variations.findIndex(
    (variation) => Number(variation.stock) > 0,
  );

  // সব variation out of stock হলে first variant
  return inStockIndex !== -1 ? inStockIndex : 0;
};
