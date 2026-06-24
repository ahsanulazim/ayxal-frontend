import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import ProductAddForm from "@/components/dashboard/products/add-product/ProductAddForm";

const page = () => {
  return (
    <>
      <Breadcrumbs title="Products" subtitle="Add-Product" />
      <section className="mb-5">
        <h2 className="font-bold text-2xl">Add Product</h2>
      </section>
      <section>
        <div className="">
          <ProductAddForm />
        </div>
      </section>
    </>
  );
};

export default page;
