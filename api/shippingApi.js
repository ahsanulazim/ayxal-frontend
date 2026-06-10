import api from "@/axios/axiosInstance";

export const getAllShippingRates = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/shippingRates/getAllShippingRates`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  const data = await res.json();
  return data;
};

export const createShippingRate = async (shippingData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/shippingRates/createShippingRate`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(shippingData),
    },
  );
  const data = await res.json();
  return data;
};

export const getShippingRateByDistrict = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/shippingRates/getShippingRateByDistrict/?district=${district}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );
  const data = await res.json();
  return data;
};

// export const updateShippingRate = async (id, data) => {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/shippingRates/updateShippingRate/${id}`,
//     {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     },
//   );
//   const data = await res.json();
//   return data;
// };

export const deleteShippingRate = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/shippingRates/deleteShippingRate/?id=${id}`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    },
  );
  const data = await res.json();
  return data;
};

//cj product search
export const searchCjProducts = async ({ queryKey }) => {
  try {
    const [_key, keyWord, page, size] = queryKey;
    const res = await api.get(`/products/cj/search`, {
      params: {
        keyWord,
        page,
        size,
      },
    });
    // Extract productList from the first content item
    const products = res.data;
    return products;
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
};
