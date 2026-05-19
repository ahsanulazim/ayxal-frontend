"use client";

import AddAttributeModal from "@/components/dashboard/attribute/AddAttributeModal";
import AttributeTable from "@/components/dashboard/attribute/AttributeTable";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import { useRef } from "react";
import { LuPlus } from "react-icons/lu";

const page = () => {
  const attributeRef = useRef();

  return (
    <>
      <AddAttributeModal ref={attributeRef} />
      <Breadcrumbs title="Attributes" />
      <section className="mb-5">
        <div className="flex justify-between items-center gap-5">
          <h2 className="font-bold text-2xl w-1/2">Attributes</h2>
          <button
            className="btn btn-main"
            onClick={() => attributeRef.current.showModal()}
          >
            <LuPlus /> Add Attribute
          </button>
        </div>
      </section>
      <section>
        <AttributeTable />
      </section>
    </>
  );
};

export default page;
