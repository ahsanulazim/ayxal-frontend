export const STEPPER_STEPS = [
  { id: "basic", label: "Basic Info", description: "Title, category & brand" },
  { id: "media", label: "Media & Assets", description: "Thumbnail & gallery" },
  { id: "pricing", label: "Pricing & Stock", description: "Price, inventory & variations" },
  { id: "vital", label: "Specifications", description: "Product attributes & specs" },
  { id: "description", label: "Description", description: "Tags & detailed content" },
  { id: "shipping", label: "Shipping & Review", description: "Dimensions, weight & submit" },
];

export const initialProductValues = {
  // Step 1: Basic
  title: "",
  category: "",
  brand: "",
  noBrand: false,
  hasVariations: false,
  attributes: [],

  // Step 2: Media
  thumbnail: null,
  images: [],

  // Step 3: Pricing & Stock
  baseStock: 0,
  basePrice: 0,
  baseDiscount: 0,
  variations: [],

  // Step 4: Specifications (Vital Info)
  vitalInformations: [
    { label: "", value: "" },
  ],

  // Step 5: Description & Tags
  tags: [],
  description: "",

  // Step 6: Shipping
  weight: 0,
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  freeShipping: false,
};
