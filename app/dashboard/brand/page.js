"use client";

import AddBrandModal from "@/components/dashboard/brand/AddBrandModal";
import BrandData from "@/components/dashboard/brand/BrandData";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const page = () => {
  const brandRef = useRef(null);

  return (
    <>
      <Breadcrumbs title="Brands" />
      <AddBrandModal ref={brandRef} />
      <section className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl">Brands</h2>
          <button
            className="btn btn-main"
            onClick={() => brandRef.current.showModal()}
          >
            <LuPlus /> Add Brand
          </button>
        </div>
      </section>
      <section>
        <BrandData />
      </section>
    </>
  );
};

export default page;
