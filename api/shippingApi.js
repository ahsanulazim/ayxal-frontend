import api from "@/axios/axiosInstance";

export const createShippingRate = async (shippingData) => {
  const res = await api.post("/shippingRates/createShippingRate", shippingData);
  return res.data;
};

export const getShippingRateByDistrict = async (district) => {
  const res = await api.get(
    `/shippingRates/getShippingRateByDistrict/?district=${district}`,
  );
  return res.data;
};

export const deleteShippingRate = async (id) => {
  const res = await api.delete(`/shippingRates/deleteShippingRate/?id=${id}`);
  return res.data;
};

// CJ product search
export const searchCjProducts = async ({ queryKey }) => {
  try {
    const [_key, keyWord, page, size] = queryKey;
    const res = await api.get(`/products/cj/search`, {
      params: {
        keyWord,
        page,
        size,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
};

/**
 * Real-time CJ Dropshipping Freight Calculation via Axios
 */
export const calculateDynamicShipping = async ({
  countryCode = "US",
  province = "",
  city = "",
  zip = "",
  items = [],
}) => {
  const res = await api.post("/cj-dropship/calculate-shipping", {
    countryCode,
    province,
    city,
    zip,
    items,
  });
  return res.data;
};
