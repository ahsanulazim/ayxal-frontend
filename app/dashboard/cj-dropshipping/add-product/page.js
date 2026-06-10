import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CjSearch from "@/components/dashboard/cj-dropshipping/add-product/CjSearch";

const page = () => {
  return (
    <>
      <Breadcrumbs title="CJ Dropshipping" subtitle="Add Product" />
      <section className="mb-5">
        <CjSearch />
      </section>
    </>
  );
};

export default page;
