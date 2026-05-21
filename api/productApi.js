export const createProduct = async (productData) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/createProduct`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    },
  );
  return res.json();
};

export const getAllProducts = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getAllProducts`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
};

export const getNewArrivals = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/getNewArrivals`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return res.json();
};

export const deleteProduct = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/products/deleteProduct/?id=${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!res.ok) {
    throw new Error("Deleting Failed");
  }

  return res.json();
};
