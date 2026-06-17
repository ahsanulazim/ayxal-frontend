import api from "@/axios/axiosInstance";

export const createVariation = async (variationData) => {
  console.log(variationData);

  const res = await api.post("variants/createVariant", variationData);
  return res.data;
};

export const getAllVariations = async ({ queryKey }) => {
  const [_, attributeSlug] = queryKey;
  const res = await api.get("/variants/getAllVariants", {
    params: { attributeSlug },
  });
  return res.data;
};

export const deleteVariation = async (slug) => {
  const res = await api.delete("/variants/deleteVariation", {
    params: { slug },
  });
  return res.data;
};
