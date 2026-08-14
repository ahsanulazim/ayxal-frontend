import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import ProductForm from "@/components/dashboard/products/add-product/components/ProductForm";

const page = () => {
  return (
    <>
      <Breadcrumbs title="Products" subtitle="Add-Product" />

      <section>
        <div className="">
          <ProductForm />
        </div>
      </section>
    </>
  );
};

export default page;
