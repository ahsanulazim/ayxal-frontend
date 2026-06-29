import api from "@/axios/axiosInstance";

export const createAttribute = async (attributeData) => {
  const res = await api.post("/attributes/createAttribute", attributeData);

  return res.data;
};

export const updateAttribute = async ({ attributeData, id }) => {
  const res = await api.patch("/attributes/updateAttribute", attributeData, {
    params: { id },
  });
  return res.data;
};

export const getAllAttribute = async () => {
  const res = await api.get("/attributes/getAllAttributes");

  return res.data;
};

export const deleteAttribute = async (slug) => {
  const res = await api.delete("/attributes/deleteAttribute", {
    params: { slug },
  });

  return res.data;
};

export const getAttribute = async (slug) => {
  const res = await api.get("/attributes/getAttribute", {
    params: { slug },
  });

  return res.data;
};
