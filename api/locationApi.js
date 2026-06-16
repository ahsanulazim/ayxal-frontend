import api from "@/axios/axiosInstance";

export const getAllLocations = async () => {
  const res = await api.get("/locations/getAllLocations");
  return res.data;
};

export const getStates = async ({ queryKey }) => {
  const [_key, slug, page] = queryKey;

  const res = await api.get("/locations/getStates", {
    params: {
      slug,
      page,
    },
  });
  return res.data;
};
