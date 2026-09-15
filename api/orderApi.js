import api from "@/axios/axiosInstance";

/**
 * Creates order and generates Stripe payment session
 */
export const createOrder = async (data) => {
  const res = await api.post("/orders/createOrder", data);
  return res.data;
};

/**
 * Verifies Stripe session payment status on return
 */
export const verifyOrderPayment = async (sessionId, orderId) => {
  const res = await api.get("/orders/verify-payment", {
    params: {
      session_id: sessionId,
      order_id: orderId,
    },
  });
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

