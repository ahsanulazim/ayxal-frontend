import api from "@/axios/axiosInstance";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import ProductForm from "@/components/dashboard/products/add-product/components/ProductForm";
import { mapCjProductToForm } from "@/components/dashboard/products/add-product/helper/mapCjProductToForm";

const page = async ({ params }) => {
  const { store } = await params;

  const res = await api.get(`/products/cj/getProduct`, {
    params: { pid: store },
  });

  if (!res.data) return { title: "Product Not Found" };
  const productData = res.data;

  const convertedProductData = mapCjProductToForm(productData.product);

  console.log(convertedProductData);

  return (
    <>
      <Breadcrumbs title="CJ Dropshipping" subtitle="Add-Product" />

      <section>
        <div className="">
          <ProductForm intitialData={convertedProductData} />
        </div>
      </section>
    </>
  );
};

export default page;
