"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import moment from "moment";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LuArrowLeft,
  LuMail,
  LuPhone,
  LuMapPin,
  LuUser,
  LuTruck,
  LuCalendar,
  LuCreditCard,
  LuCopy,
  LuCheck,
  LuPrinter,
  LuTrash2,
  LuPackageCheck,
  LuFileText,
  LuClock,
  LuCircleAlert,
  LuCircleCheck,
  LuBoxes,
  LuRefreshCw,
  LuSparkles,
  LuExternalLink,
} from "react-icons/lu";
import OrderItems from "./OrderItems";
import OrderSummary from "./OrderSummary";
import {
  updateOrderStatus,
  deleteOrder,
  fulfillOrderWithCj,
  syncCjOrderStatus,
} from "@/api/orderApi";
import OrderDeleteModal from "../OrderDeleteModal";

const TIMELINE_STEPS = [
  { key: "pending", label: "Order Placed", icon: LuClock },
  { key: "processing", label: "Processing", icon: LuPackageCheck },
  { key: "shipped", label: "Shipped", icon: LuTruck },
  { key: "delivered", label: "Delivered", icon: LuCircleCheck },
];

const ORDER_STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-sky-50 text-sky-700 border-sky-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};

const OrderDetailsView = ({ initialOrder }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [order, setOrder] = useState(initialOrder);
  const [selectedStatus, setSelectedStatus] = useState(
    order.orderStatus || order.status || "pending",
  );
  const [trackingNumber, setTrackingNumber] = useState(
    order.shipping?.trackingNumber || "",
  );
  const deleteModalRef = useRef(null);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (val, fieldKey) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const updateMutation = useMutation({
    mutationFn: (payload) => updateOrderStatus(order._id, payload),
    onSuccess: (data) => {
      if (data?.order) {
        setOrder(data.order);
        setSelectedStatus(data.order.orderStatus || data.order.status);
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStats"] });
      toast.success("Order status successfully updated");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to update order status",
      );
    },
  });

  const fulfillCjMutation = useMutation({
    mutationFn: () => fulfillOrderWithCj(order._id),
    onSuccess: (data) => {
      if (data?.order) {
        setOrder(data.order);
        setSelectedStatus(data.order.orderStatus || data.order.status);
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStats"] });
      toast.success(data?.message || "Order sent to CJ Dropshipping!");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to fulfill with CJ",
      );
    },
  });

  const syncCjStatusMutation = useMutation({
    mutationFn: () => syncCjOrderStatus(order._id),
    onSuccess: (data) => {
      if (data?.order) {
        setOrder(data.order);
        setSelectedStatus(data.order.orderStatus || data.order.status);
        if (data.trackingNumber) {
          setTrackingNumber(data.trackingNumber);
        }
      }
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(data?.message || "CJ status synced!");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || err.message || "Failed to sync CJ status",
      );
    },
  });

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      orderStatus: selectedStatus,
      trackingNumber,
    });
  };

  // Timeline step calculation
  const statusOrder = ["pending", "processing", "shipped", "delivered"];
  const currentStepIndex = statusOrder.indexOf(
    (order.orderStatus || order.status || "pending").toLowerCase(),
  );
  const isCancelled =
    (order.orderStatus || order.status || "").toLowerCase() === "cancelled";

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header with navigation and quick actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <Link
            href="/dashboard/orders"
            className="w-10 h-10 rounded-2xl bg-zinc-100 hover:bg-zinc-200/80 flex items-center justify-center text-zinc-700 transition-colors shrink-0"
            title="Back to Orders"
          >
            <LuArrowLeft className="w-5 h-5" />
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-mono">
                #{order.orderNumber}
              </h1>
              <button
                type="button"
                onClick={() => handleCopy(order.orderNumber, "orderNumber")}
                className="text-zinc-400 hover:text-zinc-700 p-1"
                title="Copy Order Number"
              >
                {copiedField === "orderNumber" ? (
                  <LuCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <LuCopy className="w-4 h-4" />
                )}
              </button>

              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize ${
                  ORDER_STATUS_COLORS[order.orderStatus?.toLowerCase()] ||
                  ORDER_STATUS_COLORS.pending
                }`}
              >
                {order.orderStatus || order.status || "Pending"}
              </span>

              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  order.paymentStatus?.toLowerCase() === "paid"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {order.paymentStatus?.toLowerCase() === "paid"
                  ? "Paid (Stripe)"
                  : "Payment Pending"}
              </span>
            </div>

            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
              <LuCalendar className="w-3.5 h-3.5" />
              Placed on{" "}
              {moment(order.createdAt).format("MMMM Do, YYYY · h:mm A")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="btn btn-sm btn-outline rounded-xl text-xs gap-1.5 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
          >
            <LuPrinter className="w-4 h-4" /> Print Invoice
          </button>

          <button
            type="button"
            onClick={() => deleteModalRef.current?.showModal()}
            className="btn btn-sm btn-outline btn-error rounded-xl text-xs gap-1.5"
          >
            <LuTrash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* 2. Visual Progress Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-5">
          Fulfillment Timeline
        </h3>

        {isCancelled ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-3">
            <LuCircleAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Order Cancelled</p>
              <p className="text-xs text-rose-600/80">
                This order has been marked as cancelled. No further fulfillment
                actions are required.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
            {TIMELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = currentStepIndex >= idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.key}
                  className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                    isCompleted
                      ? "bg-teal-50/50 border-teal-200/70"
                      : "bg-zinc-50 border-zinc-200/50 opacity-60"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all ${
                      isCompleted
                        ? "bg-main text-white shadow-xs"
                        : "bg-zinc-200 text-zinc-500"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      isCompleted ? "text-zinc-900" : "text-zinc-500"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCurrent && (
                    <span className="text-[10px] text-main font-semibold mt-0.5">
                      Current Stage
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Items & Receipt) */}
        <div className="lg:col-span-2 space-y-6">
          <OrderItems order={order} />
          <OrderSummary order={order} />
        </div>

        {/* Right Column (Status manager, Customer & Shipping) */}
        <div className="space-y-6">
          {/* CJ Dropshipping Fulfillment Card */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="font-bold text-sm text-zinc-900 flex items-center gap-2">
                <LuBoxes className="w-4 h-4 text-primary" /> CJ Dropshipping
              </h3>
              {order.cjOrder?.cjOrderId ? (
                <span className="badge badge-success badge-soft text-[10px] font-semibold gap-1">
                  <LuCheck className="w-3 h-3" /> Sent to CJ
                </span>
              ) : (
                <span className="badge badge-warning badge-soft text-[10px] font-semibold">
                  Awaiting Fulfillment
                </span>
              )}
            </div>

            {order.cjOrder?.cjOrderId ? (
              <div className="space-y-3">
                <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">CJ Order ID:</span>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-zinc-800">
                      <span>{order.cjOrder.cjOrderId}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(order.cjOrder.cjOrderId, "cjOrderId")}
                        className="text-zinc-400 hover:text-zinc-700"
                        title="Copy CJ Order ID"
                      >
                        {copiedField === "cjOrderId" ? (
                          <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <LuCopy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Supplier Status:</span>
                    <span className="font-semibold text-zinc-700 uppercase font-mono text-[11px]">
                      {order.cjOrder.status || "SUBMITTED"}
                    </span>
                  </div>

                  {order.cjOrder.logisticName && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Shipping Line:</span>
                      <span className="font-semibold text-zinc-700 truncate max-w-[150px]">
                        {order.cjOrder.logisticName}
                      </span>
                    </div>
                  )}

                  {order.shipping?.trackingNumber && (
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60">
                      <span className="text-zinc-500">Tracking Number:</span>
                      <a
                        href={`https://t.17track.net/en#nums=${order.shipping.trackingNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono font-bold text-primary hover:underline flex items-center gap-1 text-[11px]"
                        title="Track parcel online"
                      >
                        {order.shipping.trackingNumber}
                        <LuExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => syncCjStatusMutation.mutate()}
                    disabled={syncCjStatusMutation.isPending}
                    className="btn btn-sm btn-outline w-full rounded-xl text-xs gap-1.5 font-semibold"
                  >
                    <LuRefreshCw
                      className={`w-3.5 h-3.5 ${
                        syncCjStatusMutation.isPending ? "animate-spin text-primary" : ""
                      }`}
                    />
                    {syncCjStatusMutation.isPending
                      ? "Checking CJ..."
                      : "Sync CJ Status & Tracking"}
                  </button>

                  {order.cjOrder.cjPayUrl && (
                    <a
                      href={order.cjOrder.cjPayUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary w-full rounded-xl text-xs gap-1.5 font-semibold text-center"
                    >
                      <LuExternalLink className="w-3.5 h-3.5" /> Pay on CJ Portal
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Automatically submit customer address and ordered items to CJ Dropshipping for fulfillment.
                </p>

                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl space-y-1 text-xs">
                  <p className="text-zinc-600">
                    <strong>Shipping to:</strong>{" "}
                    {order.customer?.city || "Unknown City"},{" "}
                    {order.customer?.country || "US"}
                  </p>
                  <p className="text-zinc-600 truncate">
                    <strong>Courier:</strong>{" "}
                    {order.shipping?.name || order.shipping?.logisticName || "CJPacket Ordinary"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => fulfillCjMutation.mutate()}
                  disabled={fulfillCjMutation.isPending}
                  className="btn btn-main btn-sm w-full rounded-xl text-xs font-bold gap-1.5 shadow-sm"
                >
                  {fulfillCjMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Sending to CJ Dropshipping...
                    </>
                  ) : (
                    <>
                      <LuSparkles className="w-4 h-4" />
                      Fulfill Order with CJ
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Status & Courier Update Card */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-zinc-900 mb-3 pb-3 border-b border-zinc-100 flex items-center gap-2">
              <LuTruck className="w-4 h-4 text-main" /> Order Management
            </h3>

            <form onSubmit={handleStatusSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Change Fulfillment Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="select select-bordered select-sm w-full rounded-xl text-xs bg-zinc-50 focus:border-main"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Tracking Number (Optional)
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. CJ123456789US"
                  className="input input-bordered input-sm w-full rounded-xl text-xs bg-zinc-50 focus:border-main font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="btn btn-main btn-sm w-full rounded-xl font-bold text-xs shadow-xs"
              >
                {updateMutation.isPending ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Save Status"
                )}
              </button>
            </form>
          </div>

          {/* Customer Profile Card */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-zinc-900 mb-3 pb-3 border-b border-zinc-100 flex items-center gap-2">
              <LuUser className="w-4 h-4 text-teal-600" /> Customer Information
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-teal-50 text-main font-bold flex items-center justify-center text-sm shrink-0 border border-teal-100">
                  {(
                    order.customer?.name?.[0] ||
                    order.customer?.firstName?.[0] ||
                    "C"
                  ).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-zinc-900 text-sm">
                    {order.customer?.name ||
                      `${order.customer?.firstName || ""} ${
                        order.customer?.lastName || ""
                      }`.trim() ||
                      "Guest Customer"}
                  </p>
                  <span className="text-[11px] text-zinc-400">Customer</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <LuMail className="w-3.5 h-3.5 text-zinc-400" /> Email:
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-zinc-800">
                      {order.customer?.email || "None"}
                    </span>
                    {order.customer?.email && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(order.customer.email, "email")
                        }
                        className="text-zinc-400 hover:text-zinc-700 p-0.5"
                      >
                        {copiedField === "email" ? (
                          <LuCheck className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <LuCopy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-500 flex items-center gap-1.5">
                    <LuPhone className="w-3.5 h-3.5 text-zinc-400" /> Phone:
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-zinc-800">
                      {order.customer?.phone || "None"}
                    </span>
                    {order.customer?.phone && (
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(order.customer.phone, "phone")
                        }
                        className="text-zinc-400 hover:text-zinc-700 p-0.5"
                      >
                        {copiedField === "phone" ? (
                          <LuCheck className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <LuCopy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Delivery Card */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
            <h3 className="font-bold text-sm text-zinc-900 mb-3 pb-3 border-b border-zinc-100 flex items-center gap-2">
              <LuMapPin className="w-4 h-4 text-emerald-600" /> Shipping &
              Delivery
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <p className="text-zinc-400 text-[11px]">Street Address:</p>
                <p className="font-semibold text-zinc-800 text-sm mt-0.5">
                  {order.customer?.address || "No address provided"}
                </p>
                <p className="text-zinc-600 mt-0.5">
                  {[
                    order.customer?.city,
                    order.customer?.state,
                    order.customer?.zip,
                    order.customer?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>

              {order.shipping?.name && (
                <div className="pt-2 border-t border-zinc-100">
                  <p className="text-zinc-400 text-[11px]">Selected Courier:</p>
                  <p className="font-semibold text-zinc-800 mt-0.5">
                    {order.shipping.name}{" "}
                    {order.shipping.aging && (
                      <span className="text-zinc-400 font-normal">
                        ({order.shipping.aging})
                      </span>
                    )}
                  </p>
                </div>
              )}

              {order.customer?.comment && (
                <div className="pt-2 border-t border-zinc-100">
                  <p className="text-zinc-400 text-[11px] flex items-center gap-1">
                    <LuFileText className="w-3 h-3" /> Delivery Notes:
                  </p>
                  <p className="text-zinc-700 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/60 mt-1 italic">
                    &ldquo;{order.customer.comment}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <OrderDeleteModal
        ref={deleteModalRef}
        order={order}
        onClose={() => {
          router.push("/dashboard/orders");
        }}
      />
    </div>
  );
};

export default OrderDetailsView;
