import api from "@/axios/axiosInstance";

export const uploadCarousel = async (data) => {
  const res = await api.post("/carousel/upload", data);
  return res.data;
};

export const getCarousels = async () => {
  const res = await api.get("/carousel/get-all");
  return res.data;
};
