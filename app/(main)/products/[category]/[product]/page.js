import api from "@/axios/axiosInstance";
import ShopNav from "@/components/product/ShopNav";
import ProductDetails from "@/components/single-product/ProductDetails";
import { notFound } from "next/navigation";

export const generateMetadata = async ({ params }) => {
  try {
    const { product } = await params;

    const res = await api.get("/products/getProductBySlug", {
      params: { slug: product },
    });

    const productData = res?.data;
    if (!productData?.product) {
      return { title: "Product Not Found | PretyPet" };
    }

    const { product: item } = productData;
    const title = `${item.title} | PretyPet`;
    const rawDesc =
      typeof item.description === "string" && !item.description.startsWith("{")
        ? item.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
        : `Buy ${item.title} at the best price online at PretyPet.`;

    const imageUrl =
      item.thumbnail?.url ||
      item.thumbnail ||
      (Array.isArray(item.images) && item.images[0]?.url) ||
      "/default-product.jpg";

    return {
      title,
      description: rawDesc,
      openGraph: {
        title,
        description: rawDesc,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: item.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: rawDesc,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return { title: "Product Details | PretyPet" };
  }
};

const page = async ({ params }) => {
  const { product, category } = await params;

  let productData = null;
  try {
    const res = await api.get("/products/getProductBySlug", {
      params: { slug: product },
    });
    productData = res?.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }

  if (!productData?.product) {
    notFound();
  }

  const currentProduct = productData.product;
  const currentCategory = productData.category;

  const categoryName =
    currentCategory?.name ||
    (typeof currentProduct.category === "string"
      ? currentProduct.category
      : category) ||
    "Shop";

  const categorySlug =
    currentCategory?.slug ||
    (typeof currentProduct.category === "string"
      ? currentProduct.category
      : category) ||
    "";

  // Fetch related products from the same category
  let relatedProducts = [];
  try {
    const catQuery =
      currentCategory?.slug || currentProduct.category || category;
    if (catQuery) {
      const relatedRes = await api.get("/products/getProductsByCategory", {
        params: { category: catQuery, limit: 8 },
      });
      const currentId = currentProduct._id?.toString() || currentProduct._id;
      const list = relatedRes?.data?.products || [];
      relatedProducts = list
        .filter((p) => (p._id?.toString() || p._id) !== currentId)
        .slice(0, 4);
    }
  } catch (error) {
    console.error("Error fetching related products:", error);
  }

  return (
    <>
      <section className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ShopNav
          category={categoryName}
          slug={categorySlug}
          product={currentProduct}
        />
      </section>

      <ProductDetails
        product={currentProduct}
        categoryInfo={{ name: categoryName, slug: categorySlug }}
        relatedProducts={relatedProducts}
      />
    </>
  );
};

export default page;
