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
  const weight = firstVariant.variantWeight || 0;
  const dimensions = {
    length: firstVariant.variantLength || 0,
    width: firstVariant.variantWidth || 0,
    height: firstVariant.variantHeight || 0,
  };

  // Determine if it has variations
  const hasVariations = cjProduct.variants && cjProduct.variants.length > 1;

  // Attributes mapping
  // CJ offers attributes in "productKeyEn" like "capacity-Color"
  const cjKeys =
    cjProduct.productKeyEnSet || cjProduct.productKeyEn?.split("-") || [];

  // Map attributes and variations to match your form structure
  const attributes = cjKeys.map((key) => key.toLowerCase()); // e.g., ['size', 'color']

  // Map variations if needed
  const variations = hasVariations
    ? cjProduct.variants.map((v) => {
        // e.g. "300ml Garbage Bag-Indigo" -> ['300ml Garbage Bag', 'Indigo']
        const keys = v.variantKey?.split("-") || [];
        const variantData = {
          stock: v.inventoryNum || 0,
          price: v.variantSellPrice || 0,
          discount: 0,
          thumbnail: v.variantImage || null,
          images: [],
        };

        // Dynamic key mappings based on cjKeys
        cjKeys.forEach((key, idx) => {
          variantData[key.toLowerCase()] = keys[idx] || "";
        });

        return variantData;
      })
    : [];

  return {
    title: cjProduct.productNameEn || "",
    //category: cjProduct.categoryName || "", // categoryName matching
    brand: cjProduct.brand || "",
    noBrand: !cjProduct.brand,
    hasVariations: hasVariations,
    attributes: attributes, // ['size', 'color']
    basePrice: basePrice,
    baseStock: 0,
    baseDiscount: 0,
    variations: variations,
    thumbnail: cjProduct.bigImage || null,
    images: images,
    description: cjProduct.description || "",
    weight: weight,
    dimensions: dimensions,
    freeShipping: false,

    // For react-hook-form to dynamically populate attribute values
    ...cjKeys.reduce((acc, key, idx) => {
      // Collect unique options for each attribute key from variations
      const uniqueValues = Array.from(
        new Set(
          cjProduct.variants
            ?.map((v) => v.variantKey?.split("-")[idx])
            .filter(Boolean),
        ),
      );
      // Format as react-select options
      acc[key.toLowerCase()] = uniqueValues.map((val) => ({
        value: val.toLowerCase(),
        label: val,
      }));
      return acc;
    }, {}),
  };
};
