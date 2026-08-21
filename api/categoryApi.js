import api from "@/axios/axiosInstance";

export const createCategory = async (categoryData) => {
  const res = await api.post("/categories/createCategory", categoryData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getCategory = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const res = await api.get("/categories/getCategory", {
    params: { id },
  });
  return res.data;
};

export const getAllCategories = async () => {
  const res = await api.get("/categories/getAllCategories");
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await api.delete("/categories/deleteCategory", {
    params: { id },
  });
  return res.data;
};

export const updateCategory = async ({ categoryId, values }) => {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("slug", values.slug);
  formData.append("description", values.description);

  if (values.thumbnail) {
    formData.append("thumbnail", values.thumbnail);
  }

  const { data } = await api.put("/categories/updateCategory", formData, {
    params: { id: categoryId },
  });

  return data;
};
