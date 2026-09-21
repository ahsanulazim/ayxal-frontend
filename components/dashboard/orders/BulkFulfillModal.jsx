"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  LuSparkles,
  LuX,
  LuPackage,
  LuCircleCheck,
  LuCircleAlert,
  LuTriangleAlert,
  LuClock,
  LuLayers,
  LuCopy,
  LuCheck,
} from "react-icons/lu";
import { bulkFulfillOrdersWithCj } from "@/api/orderApi";

const BulkFulfillModal = ({ ref, selectedOrders = [], onSuccess }) => {
  const queryClient = useQueryClient();

  const [stage, setStage] = useState("preview"); // "preview" | "processing" | "completed"
  const [results, setResults] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const readyOrders = selectedOrders.filter((o) => !o.cjOrder?.cjOrderId);
  const alreadyFulfilledOrders = selectedOrders.filter((o) =>
    Boolean(o.cjOrder?.cjOrderId),
  );
  const unpaidOrders = readyOrders.filter(
    (o) => (o.paymentStatus || "").toLowerCase() !== "paid",
  );

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartBulkFulfillment = async () => {
    if (readyOrders.length === 0) {
      toast.info("No unfulfilled orders selected.");
      return;
    }

    setStage("processing");

    try {
      const orderIds = readyOrders.map((o) => o._id);
      const res = await bulkFulfillOrdersWithCj(orderIds);

      // Combine already fulfilled orders (marked as skipped) with server results
      const skippedFromSelection = alreadyFulfilledOrders.map((o) => ({
        orderId: o._id,
        orderNumber: o.orderNumber,
        success: true,
        skipped: true,
        message: `Already fulfilled with CJ (ID: ${o.cjOrder.cjOrderId})`,
        cjOrderId: o.cjOrder.cjOrderId,
      }));

      const combinedResults = [...(res.results || []), ...skippedFromSelection];

      setResults({
        total: selectedOrders.length,
        fulfilledCount: res.fulfilledCount || 0,
        failedCount: res.failedCount || 0,
        skippedCount: (res.skippedCount || 0) + alreadyFulfilledOrders.length,
        items: combinedResults,
      });

      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStats"] });
      setStage("completed");

      if (res.fulfilledCount > 0) {
        toast.success(
          `Successfully fulfilled ${res.fulfilledCount} order(s) with CJ!`,
        );
      }
      if (res.failedCount > 0) {
        toast.warn(`${res.failedCount} order(s) could not be fulfilled.`);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Bulk fulfillment failed.",
      );
      setStage("preview");
    }
  };

  const handleClose = () => {
    if (stage === "processing") return;
    if (stage === "completed" && onSuccess) {
      onSuccess();
    }
    setStage("preview");
    setResults(null);
    ref.current?.close();
  };

  return (
    <dialog ref={ref} className="modal bg-black/40 backdrop-blur-xs z-50">
      <div className="modal-box max-w-2xl p-0 rounded-3xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <LuLayers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-sm sm:text-base flex items-center gap-2">
                Bulk CJ Fulfillment
                <span className="badge badge-sm badge-outline text-purple-700 border-purple-200 text-[10px] font-semibold">
                  {selectedOrders.length} selected
                </span>
              </h3>
              <p className="text-[11px] text-zinc-500">
                Batch fulfill dropshipped orders with CJ Dropshipping
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={stage === "processing"}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors disabled:opacity-40"
          >
            <LuX className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
          {/* STAGE 1: PREVIEW */}
          {stage === "preview" && (
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80 text-center">
                  <p className="text-[10px] uppercase font-bold text-zinc-400">
                    Total Selected
                  </p>
                  <p className="text-xl font-black text-zinc-900 mt-0.5">
                    {selectedOrders.length}
                  </p>
                </div>
                <div className="p-3 bg-teal-50/60 rounded-2xl border border-teal-200/60 text-center">
                  <p className="text-[10px] uppercase font-bold text-teal-700">
                    Ready to Fulfill
                  </p>
                  <p className="text-xl font-black text-teal-700 mt-0.5">
                    {readyOrders.length}
                  </p>
                </div>
                <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-center">
                  <p className="text-[10px] uppercase font-bold text-amber-700">
                    Already Sent
                  </p>
                  <p className="text-xl font-black text-amber-700 mt-0.5">
                    {alreadyFulfilledOrders.length}
                  </p>
                </div>
              </div>

              {/* Unpaid Warning */}
              {unpaidOrders.length > 0 && (
                <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-2.5 text-amber-800">
                  <LuTriangleAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-xs">
                      {unpaidOrders.length} order(s) are pending payment
                    </p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      These orders will still be submitted to CJ Dropshipping if
                      you proceed. You can review them in the list below.
                    </p>
                  </div>
                </div>
              )}

              {/* Orders List Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-zinc-600 font-semibold px-1">
                  <span>Selected Orders Review ({selectedOrders.length})</span>
                  <span className="text-[11px] text-zinc-400 font-normal">
                    {readyOrders.length} will be submitted,{" "}
                    {alreadyFulfilledOrders.length} will be skipped
                  </span>
                </div>

                <div className="border border-zinc-200/80 rounded-2xl overflow-hidden divide-y divide-zinc-100 max-h-56 overflow-y-auto bg-zinc-50/30">
                  {selectedOrders.map((order) => {
                    const isFulfilled = Boolean(order.cjOrder?.cjOrderId);
                    const isPaid =
                      (order.paymentStatus || "").toLowerCase() === "paid";

                    return (
                      <div
                        key={order._id}
                        className={`p-3 flex items-center justify-between gap-3 text-xs transition-colors ${
                          isFulfilled ? "bg-zinc-100/40 opacity-70" : "bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono font-bold text-zinc-800 shrink-0">
                            #{order.orderNumber}
                          </span>
                          <span className="text-zinc-300">·</span>
                          <span className="text-zinc-600 truncate max-w-[150px]">
                            {order.customer?.name || "Customer"}
                          </span>
                          <span className="text-zinc-300">·</span>
                          <span className="text-zinc-400 text-[11px] shrink-0">
                            {order.products?.length || 1} items
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Payment tag */}
                          <span
                            className={`badge badge-xs text-[10px] font-semibold ${
                              isPaid
                                ? "badge-success badge-soft"
                                : "badge-warning badge-soft"
                            }`}
                          >
                            {order.paymentStatus || "unpaid"}
                          </span>

                          {/* Fulfillment Tag */}
                          {isFulfilled ? (
                            <span className="badge badge-xs badge-neutral text-[10px] font-medium">
                              Already CJ: {order.cjOrder.cjOrderId}
                            </span>
                          ) : (
                            <span className="badge badge-xs badge-primary badge-soft text-[10px] font-semibold">
                              Ready
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: PROCESSING */}
          {stage === "processing" && (
            <div className="py-12 px-4 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-main relative">
                <LuSparkles className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-zinc-900">
                  Processing Bulk Fulfillment...
                </h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Submitting {readyOrders.length} order(s) to CJ Dropshipping
                  API sequentially. Please keep this modal open.
                </p>
              </div>

              <div className="w-full max-w-xs">
                <progress className="progress progress-primary w-full"></progress>
              </div>
            </div>
          )}

          {/* STAGE 3: COMPLETED */}
          {stage === "completed" && results && (
            <div className="space-y-4">
              {/* Result KPI summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-emerald-700">
                    Fulfilled
                  </p>
                  <p className="text-2xl font-black text-emerald-700 mt-0.5">
                    {results.fulfilledCount}
                  </p>
                </div>
                <div className="p-3.5 bg-zinc-100 border border-zinc-200 rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-zinc-600">
                    Skipped
                  </p>
                  <p className="text-2xl font-black text-zinc-700 mt-0.5">
                    {results.skippedCount}
                  </p>
                </div>
                <div className="p-3.5 bg-rose-50/70 border border-rose-200/70 rounded-2xl text-center">
                  <p className="text-[10px] uppercase font-bold text-rose-700">
                    Failed
                  </p>
                  <p className="text-2xl font-black text-rose-700 mt-0.5">
                    {results.failedCount}
                  </p>
                </div>
              </div>

              {/* Items Result List */}
              <div className="space-y-2">
                <span className="font-semibold text-zinc-700 block px-1">
                  Fulfillment Status Log
                </span>

                <div className="border border-zinc-200/80 rounded-2xl overflow-hidden divide-y divide-zinc-100 max-h-64 overflow-y-auto bg-zinc-50/30">
                  {results.items?.map((item, idx) => {
                    const isSuccess = item.success && !item.skipped;
                    const isSkipped = item.skipped;
                    const isFailed = !item.success && !item.skipped;

                    return (
                      <div
                        key={idx}
                        className="p-3 flex items-center justify-between gap-3 text-xs bg-white"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isSuccess && (
                            <LuCircleCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isSkipped && (
                            <LuClock className="w-4 h-4 text-zinc-400 shrink-0" />
                          )}
                          {isFailed && (
                            <LuCircleAlert className="w-4 h-4 text-rose-500 shrink-0" />
                          )}

                          <div className="min-w-0">
                            <span className="font-mono font-bold text-zinc-900">
                              #{item.orderNumber}
                            </span>
                            <p className="text-[11px] text-zinc-500 truncate max-w-sm">
                              {item.message ||
                                (isSuccess
                                  ? "Sent to CJ Dropshipping"
                                  : "Error")}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {item.cjOrderId ? (
                            <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded-md">
                              <span>{item.cjOrderId}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(item.cjOrderId, item.orderId)
                                }
                                className="text-zinc-400 hover:text-zinc-700"
                                title="Copy CJ ID"
                              >
                                {copiedId === item.orderId ? (
                                  <LuCheck className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <LuCopy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          ) : isFailed ? (
                            <span className="badge badge-xs badge-error badge-soft text-[10px]">
                              Failed
                            </span>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-action m-0 px-6 py-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-end gap-2.5">
          {stage === "preview" && (
            <>
              <form method="dialog">
                <button
                  type="submit"
                  onClick={handleClose}
                  className="btn btn-sm btn-ghost rounded-xl text-xs font-semibold text-zinc-600"
                >
                  Cancel
                </button>
              </form>
              <button
                type="button"
                onClick={handleStartBulkFulfillment}
                disabled={readyOrders.length === 0}
                className="btn btn-main btn-sm rounded-xl text-xs font-bold gap-1.5 shadow-sm px-5"
              >
                <LuSparkles className="w-4 h-4" />
                Start Bulk Fulfillment ({readyOrders.length})
              </button>
            </>
          )}

          {stage === "completed" && (
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-main btn-sm rounded-xl text-xs font-bold gap-1.5 shadow-sm px-6"
            >
              <LuCircleCheck className="w-4 h-4" />
              Done & Refresh Orders
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button disabled={stage === "processing"}>close</button>
      </form>
    </dialog>
  );
};

export default BulkFulfillModal;
