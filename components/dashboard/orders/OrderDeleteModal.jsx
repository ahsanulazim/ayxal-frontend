"use client";

import { deleteOrder } from "@/api/orderApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuTrash2, LuTriangleAlert, LuX } from "react-icons/lu";

const OrderDeleteModal = ({ isOpen, onClose, order }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStats"] });
      toast.success("Order deleted successfully");
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete order");
    },
  });

  if (!isOpen || !order) return null;

  return (
    <dialog className="modal modal-open bg-black/40 backdrop-blur-xs z-50">
      <div className="modal-box max-w-md p-6 rounded-3xl border border-zinc-200 bg-white shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5 text-rose-600">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
              <LuTriangleAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-zinc-900">Delete Order?</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost text-zinc-400 hover:text-zinc-700"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-2 text-sm text-zinc-600">
          <p>
            Are you sure you want to permanently delete order{" "}
            <span className="font-semibold text-zinc-900 font-mono">
              #{order.orderNumber || order._id}
            </span>
            ?
          </p>
          <p className="text-xs text-zinc-400">
            This action cannot be undone. All associated customer and order
            records will be removed.
          </p>
        </div>

        <div className="modal-action mt-4 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            className="btn btn-ghost rounded-xl px-4 text-zinc-600"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error text-white rounded-xl px-5 gap-2"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(order._id)}
          >
            {mutation.isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                <LuTrash2 className="w-4 h-4" /> Delete Order
              </>
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default OrderDeleteModal;
