"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  LuSparkles,
  LuX,
  LuMapPin,
  LuTruck,
  LuPackage,
  LuTriangleAlert,
} from "react-icons/lu";
import { fulfillOrderWithCj } from "@/api/orderApi";

const CjFulfillConfirmModal = ({ ref, order, onSuccess }) => {
  const queryClient = useQueryClient();

  const orderId = order?._id;
  const orderNumber = order?.orderNumber || orderId || "";

  const fulfillMutation = useMutation({
    mutationFn: () => fulfillOrderWithCj(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStats"] });
      toast.success(
        data?.message || `Order #${orderNumber} fulfilled with CJ!`,
      );
      if (onSuccess) onSuccess(data);
      ref.current?.close();
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fulfill order with CJ Dropshipping",
      );
    },
  });

  const handleClose = () => {
    ref.current?.close();
  };

  const customer = order?.customer || {};
  const isPaid = (order?.paymentStatus || "").toLowerCase() === "paid";
  const items = order?.products || [];
  const logisticName =
    order?.shipping?.logisticName ||
    order?.shipping?.name ||
    "CJPacket Ordinary";

  return (
    <dialog ref={ref} className="modal bg-black/40 backdrop-blur-xs z-50">
      <div className="modal-box max-w-lg p-0 rounded-3xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-main">
              <LuSparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-sm sm:text-base">
                Fulfill Order #{order?.orderNumber}
              </h3>
              <p className="text-[11px] text-zinc-500">
                Submit this order directly to CJ Dropshipping for fulfillment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={fulfillMutation.isPending}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          {/* Payment Status Warning if not paid */}
          {!isPaid && (
            <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-amber-800">
              <LuTriangleAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs">
                  Payment is {order?.paymentStatus || "unpaid"}
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  This order has not been marked as paid yet. If you proceed, CJ
                  Dropshipping will process the order.
                </p>
              </div>
            </div>
          )}

          {/* Shipping Details */}
          <div className="p-3.5 bg-zinc-50/80 rounded-2xl border border-zinc-200/70 space-y-2">
            <div className="flex items-center justify-between text-zinc-700 font-semibold border-b border-zinc-200/60 pb-1.5">
              <span className="flex items-center gap-1.5">
                <LuMapPin className="w-3.5 h-3.5 text-main" /> Customer Shipping
                Info
              </span>
              <span className="text-[11px] font-mono text-zinc-500">
                {customer.country || "US"}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-600">
              <div>
                <span className="text-zinc-400 block">Recipient:</span>
                <span className="font-medium text-zinc-800">
                  {customer.name ||
                    `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
                    "Customer"}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block">Contact Phone:</span>
                <span className="font-mono text-zinc-800">
                  {customer.phone || "None provided"}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-zinc-400 block">Delivery Address:</span>
                <span className="font-medium text-zinc-800">
                  {[
                    customer.address,
                    customer.city,
                    customer.state,
                    customer.zip,
                  ]
                    .filter(Boolean)
                    .join(", ") || "No street address found"}
                </span>
              </div>
            </div>
          </div>

          {/* Carrier Method */}
          <div className="p-3 bg-zinc-50/80 rounded-2xl border border-zinc-200/70 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-zinc-600">
              <LuTruck className="w-3.5 h-3.5 text-primary" /> Shipping Carrier:
            </span>
            <span className="font-semibold text-zinc-800">{logisticName}</span>
          </div>

          {/* Items Summary */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LuPackage className="w-3.5 h-3.5 text-zinc-400" /> Items to
                Fulfill ({items.length})
              </span>
              <span className="text-[11px] text-zinc-400">
                Total Units:{" "}
                {items.reduce((s, p) => s + (Number(p.quantity) || 1), 0)}
              </span>
            </label>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 divide-y divide-zinc-100 border border-zinc-200/70 rounded-2xl p-2.5 bg-zinc-50/40">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="pt-1.5 first:pt-0 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-7 h-7 rounded-md object-cover border border-zinc-200 shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-md bg-zinc-200 flex items-center justify-center text-zinc-400 shrink-0">
                        <LuPackage className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-800 truncate text-[11px]">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-zinc-400">
                        VID:{" "}
                        {item.vid || item.cjVid || (
                          <span className="text-amber-600">Auto-resolved</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-zinc-700 text-xs shrink-0">
                    x{item.quantity || 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-action m-0 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-end gap-2.5">
          <form method="dialog">
            <button
              type="submit"
              disabled={fulfillMutation.isPending}
              className="btn btn-sm btn-ghost rounded-xl text-xs font-semibold text-zinc-600"
            >
              Cancel
            </button>
          </form>
          <button
            type="button"
            onClick={() => orderId && fulfillMutation.mutate()}
            disabled={fulfillMutation.isPending || !orderId}
            className="btn btn-main btn-sm rounded-xl text-xs font-bold gap-1.5 shadow-sm px-5"
          >
            {fulfillMutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Submitting to CJ...
              </>
            ) : (
              <>
                <LuSparkles className="w-4 h-4" />
                Confirm & Fulfill with CJ
              </>
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button disabled={fulfillMutation.isPending}>close</button>
      </form>
    </dialog>
  );
};

export default CjFulfillConfirmModal;
