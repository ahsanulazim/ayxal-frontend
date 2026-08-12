export const productDefaultValues = {
  basic: {
    title: "",
    categoryId: "",
    brandId: "",
    noBrand: false,
    type: "simple",
  },

  vital: {
    barcode: "",
    material: "",
    weight: null,
    unit: "kg",
  },

  simple: {
    sku: "",
    price: null,
    compareAtPrice: null,
    stock: null,
  },

  variations: {
    attributes: [],
    variants: [
      {
        id: "",
        attributes: {},
        sku: "",
        barcode: "",
        price: null,
        compareAtPrice: null,
        stock: null,
        trackInventory: true,
        images: [],
      },
    ],
  },

  images: {
    product: [],
    byAttribute: {},
  },

  description: {
    keywords: [],
    content: null,
  },

  shipping: {
    method: "",
    package: {
      weight: null,
      length: null,
      width: null,
      height: null,
    },
    freeShipping: false,
  },

  returns: {
    policy: "",
  },
};
