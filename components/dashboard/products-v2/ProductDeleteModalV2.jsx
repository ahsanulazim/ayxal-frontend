"use client";

import React from "react";
import { deleteProduct } from "@/api/productApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuAlertTriangle, LuTrash2 } from "react-icons/lu";

const ProductDeleteModalV2 = ({
  modalRef,
  productToDelete,
  bulkIdsToDelete = [],
  onDeleted,
}) => {
  const queryClient = useQueryClient();

  const isBulk = bulkIdsToDelete && bulkIdsToDelete.length > 0;

  const mutation = useMutation({
    mutationFn: async () => {
      if (isBulk) {
        // Delete all selected products sequentially or in parallel
        await Promise.all(bulkIdsToDelete.map((id) => deleteProduct(id)));
        return bulkIdsToDelete.length;
      } else if (productToDelete?._id) {
        return await deleteProduct(productToDelete._id);
      }
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (isBulk) {
        toast.success(`${bulkIdsToDelete.length} products deleted successfully`);
      } else {
        toast.success(`"${productToDelete?.title || "Product"}" deleted`);
      }
      onDeleted?.();
      modalRef?.current?.close?.();
    },
    onError: (err) => {
      console.error("Delete error:", err);
      toast.error("Failed to delete product(s)");
    },
  });

  const handleConfirm = () => {
    mutation.mutate();
  };

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box rounded-2xl p-6 border border-base-content/10">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-error/10 text-error shrink-0">
            <LuTrash2 className="size-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h3 className="font-bold text-lg text-base-content">
              {isBulk
                ? `Delete ${bulkIdsToDelete.length} Selected Products?`
                : "Delete Product?"}
            </h3>
            <p className="text-sm text-base-content/70">
              {isBulk ? (
                <>
                  Are you sure you want to permanently delete{" "}
                  <strong className="text-base-content font-semibold">
                    {bulkIdsToDelete.length}
                  </strong>{" "}
                  products? This action cannot be undone.
                </>
              ) : (
                <>
                  Are you sure you want to delete{" "}
                  <strong className="text-base-content font-semibold">
                    &quot;{productToDelete?.title || "this product"}&quot;
                  </strong>
                  ? All associated media, variants, and stock records will be removed.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="modal-action mt-6 gap-2">
          <form method="dialog" className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="btn btn-ghost flex-1 sm:flex-initial"
              onClick={() => modalRef?.current?.close?.()}
              disabled={mutation.isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-error text-white flex-1 sm:flex-initial gap-2"
              disabled={mutation.isPending}
              onClick={handleConfirm}
            >
              {mutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Deleting...
                </>
              ) : (
                <>
                  <LuTrash2 className="size-4" />
                  Delete Permanently
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default ProductDeleteModalV2;
