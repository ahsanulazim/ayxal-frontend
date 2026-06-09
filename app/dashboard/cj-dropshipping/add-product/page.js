"use client";
import CjResults from "@/components/dashboard/cj-dropshipping/add-product/CjResults";
import CjSearch from "@/components/dashboard/cj-dropshipping/add-product/CjSearch";
import { useState } from "react";

const page = () => {
  const [products, setProducts] = useState([]);

  console.log(products);

  return (
    <>
      <section className="mb-5">
        <CjSearch setProducts={setProducts} />
      </section>
      <section>
        <CjResults />
      </section>
    </>
  );
};

export default page;
