import api from "@/axios/axiosInstance";

export const uploadCarousel = async (data) => {
  const res = await api.post("/carousel/upload", data);
  return res.data;
};

export const getCarousels = async (params = {}) => {
  const res = await api.get("/carousel/get-all", { params });
  return res.data;
};

export const updateCarousel = async ({ id, data }) => {
  const res = await api.put(`/carousel/update/${id}`, data);
  return res.data;
};

export const toggleCarouselStatus = async (id) => {
  const res = await api.patch(`/carousel/toggle-status/${id}`);
  return res.data;
};

export const deleteCarousel = async (id) => {
  const res = await api.delete(`/carousel/delete/${id}`);
  return res.data;
};
