import api from "@/axios/axiosInstance";

export const getAllUsers = async ({ queryKey }) => {
  const [page, limit] = queryKey;

  try {
    const response = await api.get("/users/getAllUsers", {
      params: {
        page,
        limit,
      },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return error;
  }
};

export const deleteUser = async (email) => {
  try {
    const response = await api.delete(`/users/deleteUser/?email=${email}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error deleting user:", error);
    return error;
  }
};

export const getUserData = async (email) => {
  const res = await api.get(`/users/getUser?email=${email}`);
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await api.put("/users/updateProfile", data);
  return res.data;
};

export const addPet = async (data) => {
  const res = await api.post("/users/addPet", data);
  return res.data;
};

export const deletePet = async (email, petId) => {
  const res = await api.delete(`/users/deletePet?email=${email}&petId=${petId}`);
  return res.data;
};

export const addAddress = async (data) => {
  const res = await api.post("/users/addAddress", data);
  return res.data;
};

export const deleteAddress = async (email, addressId) => {
  const res = await api.delete(`/users/deleteAddress?email=${email}&addressId=${addressId}`);
  return res.data;
};

export const setDefaultAddress = async (email, addressId) => {
  const res = await api.patch("/users/setDefaultAddress", { email, addressId });
  return res.data;
};

export const toggleWishlist = async (email, productId) => {
  const res = await api.post("/users/toggleWishlist", { email, productId });
  return res.data;
};

export const getWishlistProducts = async (email) => {
  const res = await api.get("/users/wishlist-products", {
    params: { email },
  });
  return res.data;
};


