"use client";

import { useState } from "react";
import Link from "next/link";
import { addProductToImportList } from "@/api/productApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuCheck, LuListPlus, LuSparkles, LuWarehouse } from "react-icons/lu";
import { toast } from "react-toastify";

const CjProductCard = ({ product }) => {
  const productId = product.id;
  const [isAdded, setIsAdded] = useState(false);

  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: (id) => addProductToImportList(id),
    onSuccess: () => {
      setIsAdded(true);
      queryClient.invalidateQueries({ queryKey: ["cjImportList"] });
      queryClient.invalidateQueries({ queryKey: ["cjStoreProducts"] });
      toast.success("Added to your CJ Import List!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add product to Import List");
    },
  });

  return (
    <div className="card bg-base-100 border border-base-200/80 hover:border-primary/30 transition-all shadow-xs hover:shadow-md rounded-xl overflow-hidden flex flex-col justify-between">
      <div>
        <figure className="relative overflow-hidden bg-base-200">
          <img
            src={product.bigImage}
            alt={product.nameEn}
            className="aspect-square object-cover w-full hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.warehouseInventoryNum > 0 && (
            <div className="absolute top-2 right-2 badge badge-neutral badge-sm gap-1 bg-black/70 text-white border-0 backdrop-blur-xs font-mono text-[10px]">
              <LuWarehouse className="size-3 text-success" />
              {Number(product.warehouseInventoryNum).toLocaleString()}
            </div>
          )}
        </figure>

        <div className="p-3 space-y-2">
          <h2
            className="font-semibold text-xs text-base-content line-clamp-2 leading-tight"
            title={product.nameEn}
          >
            {product.nameEn}
          </h2>

          <div className="flex items-baseline gap-2">
            <span className="font-bold text-sm text-primary">
              ${product.sellPrice || product.nowPrice}
            </span>
            {product.nowPrice && product.nowPrice < product.sellPrice && (
              <span className="line-through text-xs text-base-content/40">
                ${product.sellPrice}
              </span>
            )}
            <span className="text-[10px] text-base-content/50 ml-auto">
              Supplier Cost
            </span>
          </div>

          <div className="flex justify-between items-center text-[11px] text-base-content/60 pt-1 border-t border-base-200/60">
            <span>Lists: <strong className="font-mono">{product.listedNum || 0}</strong></span>
            <span className="font-mono text-[10px] text-base-content/40">ID: {productId}</span>
          </div>
        </div>
      </div>

      <div className="p-3 pt-0">
        {isAdded ? (
          <div className="space-y-1.5">
            <div className="badge badge-success badge-soft w-full py-2 text-xs font-semibold gap-1">
              <LuCheck className="size-3.5" /> In Import List
            </div>
            <Link
              href={`/dashboard/cj-dropshipping/${productId}`}
              className="btn btn-primary btn-xs w-full gap-1 shadow-xs font-medium"
            >
              <LuSparkles className="size-3" /> Customize & Push
            </Link>
          </div>
        ) : (
          <button
            className="btn btn-main btn-sm w-full gap-1.5 text-xs font-medium"
            onClick={() => mutate(productId)}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span> Shortlisting...
              </>
            ) : (
              <>
                <LuListPlus className="size-3.5" /> Add to Import List
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default CjProductCard;
