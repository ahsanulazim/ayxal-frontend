import api from "@/axios/axiosInstance";
import ProductInfo from "@/components/product/ProductInfo";
import ProductTabs from "@/components/product/ProductTabs";
import ShopNav from "@/components/product/ShopNav";

export const generateMetaData = async ({ params }) => {
  const { product } = await params;

  const res = await api.get("/products/getProductByPid", {
    params: { pid: product },
  });

  if (!res.data) return { title: "Product Not Found" };
  const productData = res.data;

  console.log(productData);

  // Search Engine Meta Headers setup Injection
  return {
    title: `${productData?.product.productNameEn} | Oiki Lifestyle`,
    description:
      productData?.product.description ||
      `Buy ${productData?.product.productNameEn} at the best price online.`,
    openGraph: {
      title: productData?.product.productNameEn,
      description: productData?.product.description,
      images: [
        {
          url:
            productData?.variantDetails[0]?.imageGallery[0] ||
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

  const res = await api.get("/products/getProductByPid", {
    params: { pid: product },
  });

  const productData = res.data;

  if (!productData) {
    return <div>Product not found</div>;
  }
  console.log(productData.product);

  return (
    <>
      {/* <ShopNav category={productData?.category} product={productData} /> */}
      <ProductInfo product={productData.product} />
      {/* <ProductTabs product={productData} /> */}
    </>
  );
};

export default page;
