import api from "@/axios/axiosInstance";

/**
 * 1. Get available promotional coupons
 */
export const getAvailableCoupons = async () => {
  const res = await api.get("/coupons/available");
  return res.data;
};

/**
 * 2. Validate coupon code for checkout
 */
export const validateCoupon = async (code, subtotal) => {
  const res = await api.post("/coupons/validate", { code, subtotal });
  return res.data;
};
