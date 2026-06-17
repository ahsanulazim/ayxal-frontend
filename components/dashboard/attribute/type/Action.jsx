"use client";

import { useRef } from "react";
import { LuPlus } from "react-icons/lu";
import TypeModal from "./TypeModal";

const Action = ({ attributeSlug, attribute, attributeData }) => {
  const variationRef = useRef();

  return (
    <section className="mb-5">
      <TypeModal attributeSlug={attributeSlug} attributeData={attributeData} ref={variationRef} />
      <div className="flex justify-between items-center gap-5">
        <h2 className="font-bold text-2xl w-1/2">Variations</h2>
        <button
          className="btn btn-main"
          onClick={() => variationRef.current?.showModal()}
        >
          <LuPlus /> Add Variations
        </button>
      </div>
    </section>
  );
};

export default Action;
