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
  if (!value) return "";

  let raw = value;
  if (typeof raw === "object") {
    raw = raw.name || raw.label || raw.slug || raw.value || "";
  }

  return String(raw)
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/*
|--------------------------------------------------------------------------
| Attribute Key & Name Helpers (Handles both string & object attributes)
|--------------------------------------------------------------------------
*/

export function getAttributeKey(attribute) {
  if (!attribute) return "";
  if (typeof attribute === "string") return attribute;
  return (
    attribute.slug ||
    attribute.key ||
    attribute.value ||
    attribute.name?.toLowerCase().replace(/[^a-z0-9]+/g, "_") ||
    ""
  );
}

export function getAttributeName(attribute) {
  if (!attribute) return "";
  if (typeof attribute === "string") return attribute;
  return attribute.name || attribute.label || attribute.slug || "";
}

/*
|--------------------------------------------------------------------------
| Normalized Attributes Inferrer
| 100% Dynamic: derives attributes from product.attributes or product.productKeyEn
| or decomposes compound keys without any hardcoded dictionary lists.
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Delimiter Detection Helper
| Automatically detects compound delimiters (-, /, |, ,) without hardcoding
|--------------------------------------------------------------------------
*/
function detectDelimiter(keys = []) {
  const delimiters = ["-", "/", "|", ","];
  for (const delim of delimiters) {
    const counts = keys.map((k) => (typeof k === "string" ? k.split(delim).length : 1));
    const firstCount = counts[0];
    if (firstCount > 1 && counts.every((c) => c === firstCount)) {
      return delim;
    }
  }
  return null;
}

/*
|--------------------------------------------------------------------------
| Normalized Attributes Inferrer
| 100% Dynamic: derives attributes from product.attributes, product.productKeyEn,
| variation key-value objects, or decomposes compound variant keys dynamically.
| Zero hardcoded dictionaries or attribute names.
|--------------------------------------------------------------------------
*/
export function getNormalizedAttributes(product) {
  const existing = Array.isArray(product?.attributes) ? product.attributes : [];

  // 1. If product already has explicit multiple attributes (from manual creation or CJ import)
  if (existing.length > 1) {
    return existing.map((attr, idx) => ({
      name: getAttributeName(attr) || `Option ${idx + 1}`,
      slug: getAttributeKey(attr) || `option_${idx + 1}`,
      partIndex: idx,
    }));
  }

  // 2. If product specifies productKeyEn (e.g. "Color-Size", "Flavor/Weight", "Material | Capacity")
  if (
    typeof product?.productKeyEn === "string" &&
    product.productKeyEn.trim()
  ) {
    const rawKeys = product.productKeyEn
      .split(/[\-\/,|]/)
      .map((k) => k.trim())
      .filter(Boolean);

    if (rawKeys.length > 0) {
      return rawKeys.map((name, index) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        partIndex: index,
      }));
    }
  }

  // 3. If existing has 1 attribute with a meaningful name (not generic "Variant")
  if (
    existing.length === 1 &&
    existing[0]?.name &&
    existing[0].name.toLowerCase() !== "variant"
  ) {
    return existing;
  }

  const variations = Array.isArray(product?.variations) ? product.variations : [];
  if (!variations.length) {
    return existing.length ? existing : [{ name: "Variant", slug: "variant" }];
  }

  // 4. Check if variations have a structured `attributes` map or object (e.g. { color: "Red", size: "M" })
  const firstWithAttrs = variations.find(
    (v) => v?.attributes && typeof v.attributes === "object" && !Array.isArray(v.attributes),
  );
  if (firstWithAttrs) {
    const attrKeys = Object.keys(firstWithAttrs.attributes);
    if (attrKeys.length > 0) {
      return attrKeys.map((key, idx) => ({
        name: formatLabel(key),
        slug: key.toLowerCase().replace(/[^a-z0-9]+/g, "_"),
        partIndex: idx,
      }));
    }
  }

  // 5. Fully dynamic compound variant key detection (e.g. "Blue-S", "Chicken/500g", "Glass | 100ml")
  const sampleKeys = variations
    .map((v) => (v.variantKey || v.variant || v.name || "").trim())
    .filter(Boolean);

  if (!sampleKeys.length) {
    return existing.length ? existing : [{ name: "Variant", slug: "variant" }];
  }

  const delimiter = detectDelimiter(sampleKeys);
  if (delimiter) {
    const partsCount = sampleKeys[0].split(delimiter).length;
    return Array.from({ length: partsCount }, (_, i) => ({
      name: `Option ${i + 1}`,
      slug: `option_${i + 1}`,
      partIndex: i,
      delimiter,
    }));
  }

  return existing.length ? existing : [{ name: "Variant", slug: "variant" }];
}

/*
|--------------------------------------------------------------------------
| Extract attribute value from a variation
| 100% Dynamic: checks direct property, nested attributes object, or compound keys
|--------------------------------------------------------------------------
*/
export function getVariationAttributeValue(variation, attribute) {
  if (!variation) return "";

  const key = getAttributeKey(attribute);
  const name = getAttributeName(attribute);

  // 1. Direct property match (e.g. variation.color, variation.size, variation.flavor)
  if (key && variation[key] !== undefined && variation[key] !== null) {
    return String(variation[key]);
  }
  if (name && variation[name] !== undefined && variation[name] !== null) {
    return String(variation[name]);
  }

  // 2. Nested attributes object or Map
  if (variation.attributes && typeof variation.attributes === "object") {
    if (key && variation.attributes[key] !== undefined) {
      return String(variation.attributes[key]);
    }
    if (name && variation.attributes[name] !== undefined) {
      return String(variation.attributes[name]);
    }
  }

  // 3. Decomposed compound key handling (e.g. "Blue-S", "500g / Beef", etc.)
  const rawKey = variation.variantKey || variation.variant || variation.name || "";
  if (rawKey) {
    const delimiter = attribute?.delimiter || detectDelimiter([rawKey]) || (rawKey.includes("-") ? "-" : rawKey.includes("/") ? "/" : null);
    if (delimiter && rawKey.includes(delimiter)) {
      const parts = rawKey.split(delimiter).map((s) => s.trim());
      if (attribute?.partIndex !== undefined && parts[attribute.partIndex] !== undefined) {
        return parts[attribute.partIndex];
      }
    }
  }

  // 4. Fallback to whole variant key
  if (variation.variantKey) return String(variation.variantKey);
  if (variation.variant) return String(variation.variant);
  if (variation.name) return String(variation.name);

  return "";
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
*/
export function getInitialSelectedAttributes(product) {
  const defaultVariation = getDefaultVariation(product?.variations);
  if (!defaultVariation) {
    return {};
  }

  const attributes = getNormalizedAttributes(product);

  return attributes.reduce((result, attribute) => {
    const key = getAttributeKey(attribute);
    result[key] = getVariationAttributeValue(defaultVariation, attribute);
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
  if (!Array.isArray(variations) || !variations.length) return null;

  const activeAttrs =
    Array.isArray(attributes) && attributes.length > 0
      ? attributes
      : [{ name: "Variant", slug: "variant" }];

  const matched = variations.find((variation) =>
    activeAttrs.every((attribute) => {
      const key = getAttributeKey(attribute);
      const expected = selectedAttributes?.[key];
      if (!expected) return true;
      return getVariationAttributeValue(variation, attribute) === expected;
    }),
  );

  return matched || variations[0] || null;
}

/*
|--------------------------------------------------------------------------
| Get unique options for an attribute
|--------------------------------------------------------------------------
*/
export function getAttributeOptions(variations = [], attribute) {
  if (!Array.isArray(variations)) return [];

  return [
    ...new Set(
      variations
        .map((variation) => getVariationAttributeValue(variation, attribute))
        .filter(Boolean),
    ),
  ];
}

/*
|--------------------------------------------------------------------------
| Check whether attribute value has any in-stock combination
|--------------------------------------------------------------------------
*/
export function isAttributeOptionAvailable({
  variations = [],
  attributes = [],
  selectedAttributes = {},
  attribute,
  value,
}) {
  const attrKey = getAttributeKey(attribute);

  return variations.some((variation) => {
    if (Number(variation?.stock) <= 0) {
      return false;
    }

    if (getVariationAttributeValue(variation, attribute) !== value) {
      return false;
    }

    const attrKeys = attributes.map(getAttributeKey);
    const attributeIndex = attrKeys.indexOf(attrKey);

    if (attributeIndex <= 0) {
      return true;
    }

    return attributes.slice(0, attributeIndex).every((previousAttribute) => {
      const prevKey = getAttributeKey(previousAttribute);
      const selectedValue = selectedAttributes?.[prevKey];

      if (!selectedValue) {
        return true;
      }

      return (
        getVariationAttributeValue(variation, previousAttribute) ===
        selectedValue
      );
    });
  });
}

/*
|--------------------------------------------------------------------------
| Find first available variation after changing one attribute
|--------------------------------------------------------------------------
*/
export function findBestVariationForAttribute({
  variations = [],
  attributes = [],
  selectedAttributes = {},
  changedAttribute,
  value,
}) {
  const changedKey = getAttributeKey(changedAttribute);

  const nextAttributes = {
    ...selectedAttributes,
    [changedKey]: value,
  };

  // 1. Try exact combination first
  const exactVariation = findSelectedVariation(
    variations,
    nextAttributes,
    attributes,
  );

  if (exactVariation && Number(exactVariation.stock) > 0) {
    return exactVariation;
  }

  // 2. Otherwise find first available variation with this attribute value
  return (
    variations.find((variation) => {
      return (
        Number(variation?.stock) > 0 &&
        getVariationAttributeValue(variation, changedAttribute) === value
      );
    }) || null
  );
}
