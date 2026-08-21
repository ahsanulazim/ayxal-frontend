import api from "@/axios/axiosInstance";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ShopNav from "@/components/product/ShopNav";
import ProductDetails from "@/components/single-product/ProductDetails";

export const generateMetaData = async ({ params }) => {
  const { product } = await params;

  const res = await api.get("/products/getProductBySlug", {
    params: { slug: product },
  });

  if (!res.data) return { title: "Product Not Found" };
  const productData = res.data;

  console.log(productData);

  // Search Engine Meta Headers setup Injection
  return {
    title: `${productData?.product.title} | PretyPet`,
    description:
      productData?.product.description ||
      `Buy ${productData?.product.title} at the best price online.`,
    openGraph: {
      title: productData?.product.title,
      description: productData?.product?.description,
      images: [
        {
          url:
            productData?.product?.thumbnail?.url ||
            productData?.product?.thumbnail ||
            "/default-product.jpg",
          width: 800,
          height: 600,
        },
      ],
    },
  };
};

const page = async ({ params }) => {
  const { product } = await params;

  const res = await api.get("/products/getProductBySlug", {
    params: { slug: product },
  });

  const productData = res.data;

  if (!productData) {
    return <div>Product not found</div>;
  }
  console.log(productData);

  return (
    <>
      {/* <ShopNav category={productData?.category} product={productData} /> */}
      {/* <ProductInfo product={productData.product} /> */}
      <section className="max-w-360 mx-auto px-5">
        <ShopNav
          category={productData?.category?.name}
          slug={productData?.category?.slug}
          product={productData?.product}
        />
      </section>
      <ProductDetails product={productData.product} />
      {/* <ProductTabs product={productData} /> */}
    </>
  );
};

export default page;
