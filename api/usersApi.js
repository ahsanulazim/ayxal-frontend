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
