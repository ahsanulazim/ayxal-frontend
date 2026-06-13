import api from "@/axios/axiosInstance";

export const createCategory = async (categoryData) => {
  const res = await api.post("/categories/createCategory", categoryData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getAllCategories = async () => {
  const res = await api.get("/categories/getAllCategories");
  return res.data;
};
