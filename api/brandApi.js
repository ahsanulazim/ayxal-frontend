import api from "@/axios/axiosInstance";

export const getAllBrands = async () => {
  const res = await api.get("/brands/getAllBrands");
  return res.data;
};

export const deleteBrand = async (id) => {
  const res = await api.delete(`/brands/deleteBrand`, {
    params: { id },
  });
  return res.data;
};
