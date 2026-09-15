import api from "@/axios/axiosInstance";

/**
 * Fetch CJ shortlisted products with MongoDB import status
 */
export const getCjImportList = async ({ queryKey }) => {
  const [, page = 1, pageSize = 10, keyword = ""] = queryKey;
  const res = await api.get("/cj-dropship/import-list", {
    params: {
      page,
      pageSize,
      keyword,
    },
  });
  return res.data;
};

/**
 * Fetch full CJ product details and store categories for the import customizer
 */
export const getCjProductForImport = async (pid) => {
  if (!pid) throw new Error("Product ID is required");
  const res = await api.get("/cj-dropship/product-details", {
    params: { pid },
  });
  return res.data;
};

/**
 * Import and save customized CJ product to MongoDB
 */
export const importProductToStore = async (productData) => {
  const res = await api.post("/cj-dropship/import", productData);
  return res.data;
};

/**
 * Sync inventory and cost price with CJ for an imported product
 */
export const syncCjProduct = async (productId) => {
  const res = await api.post(`/cj-dropship/sync/${productId}`);
  return res.data;
};

/**
 * Update an existing store product via the unified customizer
 */
export const updateStoreProduct = async ({ id, data }) => {
  const res = await api.put(`/cj-dropship/update/${id}`, data);
  return res.data;
};
