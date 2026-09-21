import api from "@/axios/axiosInstance";

/**
 * Creates order and generates Stripe payment session
 */
export const createOrder = async (data) => {
  const res = await api.post("/orders/createOrder", data);
  return res.data;
};

/**
 * Verifies Stripe payment status on return (Checkout Session or PaymentIntent)
 */
export const verifyOrderPayment = async (param1, orderId) => {
  let params = {};
  if (typeof param1 === "object" && param1 !== null) {
    params = { ...param1 };
  } else if (typeof param1 === "string") {
    if (param1.startsWith("pi_") || param1.startsWith("sim_pi")) {
      params.payment_intent_id = param1;
    } else {
      params.session_id = param1;
    }
    if (orderId) params.order_id = orderId;
  }

  const res = await api.get("/orders/verify-payment", { params });
  return res.data;
};

/**
 * Get all orders for admin dashboard with filters and search
 */
export const getAllOrderData = async (params = {}) => {
  const res = await api.get("/orders/getAllOrderData", { params });
  return res.data;
};

/**
 * Get single order details by ID or order number
 */
export const getOrderDetails = async (orderId) => {
  const res = await api.get("/orders/getOrderDetails", {
    params: { orderId },
  });
  return res.data;
};

/**
 * Update order status, payment status, or courier tracking info
 */
export const updateOrderStatus = async (orderId, updateData = {}) => {
  const res = await api.patch("/orders/updateOrderStatus", {
    orderId,
    ...updateData,
  });
  return res.data;
};

/**
 * Get aggregated dashboard statistics (total, revenue, pending, delivered)
 */
export const getOrderStats = async () => {
  const res = await api.get("/orders/getOrderStats");
  return res.data;
};

/**
 * Delete order by ID
 */
export const deleteOrder = async (id) => {
  const res = await api.delete("/orders/deleteOrder", {
    params: { id },
  });
  return res.data;
};

/**
 * Get customer orders with pagination & status filter
 */
export const getMyOrders = async (params = {}) => {
  const res = await api.get("/orders/my-orders", { params });
  return res.data;
};

/**
 * Cancel customer pending order
 */
export const cancelMyOrder = async (orderId, email) => {
  const res = await api.post("/orders/cancel-my-order", { orderId, email });
  return res.data;
};

/**
 * Fulfill dropshipped order with CJ Dropshipping (createOrderV2)
 */
export const fulfillOrderWithCj = async (orderId) => {
  const res = await api.post(`/orders/${orderId}/fulfill-cj`);
  return res.data;
};

/**
 * Sync CJ order status and auto-fetch courier tracking number
 */
export const syncCjOrderStatus = async (orderId) => {
  const res = await api.post(`/orders/${orderId}/sync-cj-status`);
  return res.data;
};

/**
 * Bulk fulfill multiple orders with CJ Dropshipping
 */
export const bulkFulfillOrdersWithCj = async (orderIds) => {
  const res = await api.post("/orders/bulk-fulfill-cj", { orderIds });
  return res.data;
};

