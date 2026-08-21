import { htmlToEditorJs } from "./htmlToEditorJs";

export const mapCjProductToForm = (cjProduct) => {
  if (!cjProduct) return {};

  // images parses if it is a JSON string
  let images = [];
  try {
    images =
      typeof cjProduct.productImage === "string"
        ? JSON.parse(cjProduct.productImage)
        : cjProduct.productImageSet || [];
  } catch (error) {
    images = cjProduct.productImageSet || [];
  }

  // base price mapping (e.g., "0.69-6.45" -> we take the starting price 0.69)
  let basePrice = 0;
  if (cjProduct.sellPrice) {
    const prices = cjProduct.sellPrice.split("-");
    basePrice = parseFloat(prices[0]) || 0;
  }

  // Extract dimensions and weight from first variant if available
  const firstVariant = cjProduct.variants?.[0] || {};
  const cjVariants =
    cjProduct.variants?.map((v) => ({
      vid: v.vid,
      variantKey: v.variantKey || "",
      variantSku: v.variantSku || "",
      variantImage: v.variantImage || "",
      variantWeight: v.variantWeight ?? 0,
      variantSellPrice: v.variantSellPrice ?? 0,

      dimensions: {
        length: v.variantLength ?? 0,
        width: v.variantWidth ?? 0,
        height: v.variantHeight ?? 0,
      },
    })) || [];

  return {
    title: cjProduct.productNameEn || "",
    //category: cjProduct.categoryName || "", // categoryName matching
    brand: cjProduct.brand || "",
    noBrand: !cjProduct.brand,
    cjPid: cjProduct.pid || "",
    cjProductSku: cjProduct.sku || "",
    cjVariants,
    basePrice: 0,
    baseStock: 0,
    baseDiscount: 0,
    variations: [],
    thumbnail: { url: cjProduct.bigImage || null, publicId: null },
    images: images.map((image) => ({ url: image, publicId: null })),
    description:
      htmlToEditorJs(cjProduct.description) || cjProduct.description || "",
    weight: Number(firstVariant.variantWeight) ?? 0,
    dimensions: {
      height: Number(firstVariant.variantHeight) ?? 0,
      length: Number(firstVariant.variantLength) ?? 0,
      width: Number(firstVariant.variantWidth) ?? 0,
    },
    freeShipping: false,
  };
};
