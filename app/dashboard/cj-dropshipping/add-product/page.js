"use client";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CjResults from "@/components/dashboard/cj-dropshipping/add-product/CjResults";
import CjSearch from "@/components/dashboard/cj-dropshipping/add-product/CjSearch";
import { useState } from "react";

const page = () => {
  const [products, setProducts] = useState([]);

  return (
    <>
      <Breadcrumbs title="CJ Dropshipping" subtitle="Add Product" />
      <section className="mb-5">
        <CjSearch setProducts={setProducts} />
      </section>
      <section className="@container">
        <CjResults products={products} />
      </section>
    </>
  );
};

export default page;
