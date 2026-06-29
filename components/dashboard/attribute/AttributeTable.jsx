"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuPlus, LuSlidersHorizontal, LuTrash2 } from "react-icons/lu";
import { useContext, useRef, useState } from "react";
import AttributeCard from "./AttributeCard";
import { MyContext } from "@/context/MyProvider";
import AttributeDeleteModal from "./AttributeDeleteModal";

export default function AttributeTable() {
  const queryClient = useQueryClient();
  const deleteAttributeModalRef = useRef(null);
  const [attributeSlug, setAttributeSlug] = useState(null);

  const { attributes, attributesError, attributesLoading } =
    useContext(MyContext);

  const deleteAttributeMutation = useMutation({
    mutationFn: () => console.log("delete"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.warn("Catalog attribute definition has been removed.");
    },
  });

  return (
    <div className="space-y-6" id="admin-attributes-tab">
      {/* List rendering */}
      {attributesLoading ? (
        <div className="flex justify-center p-12">
          <span className="loading loading-spinner text-indigo-600"></span>
        </div>
      ) : attributesError ? (
        <div>Error fetching</div>
      ) : attributes?.length === 0 ? (
        <div className="p-8 text-center bg-base-100 rounded-2x">
          <LuSlidersHorizontal className="size-8 text-main mx-auto" />
          <p className="text-xs text-slate-500 mt-2">
            No product variation attributes found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {attributes.map((attr) => (
            <AttributeCard
              key={attr.slug}
              attribute={attr}
              setAttributeSlug={setAttributeSlug}
              ref={deleteAttributeModalRef}
            />
          ))}
        </div>
      )}
      <AttributeDeleteModal
        ref={deleteAttributeModalRef}
        slug={attributeSlug}
      />
    </div>
  );
}
