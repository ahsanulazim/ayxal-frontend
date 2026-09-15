"use client";

import { cancelMyOrder, getMyOrders } from "@/api/orderApi";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useContext, useState } from "react";
import {
  LuArrowRight,
  LuCircleX,
  LuClock,
  LuExternalLink,
  LuFilter,
  LuPackage,
  LuRotateCcw,
  LuShoppingBag,
  LuXCircle,
} from "react-icons/lu";
import { toast } from "react-toastify";

const filterTabs = [
  { key: "all", label: "All Orders" },
  { key: "processing", label: "In Progress" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

const OrdersPage = () => {
  const { newUser, addToCart } = useContext(MyContext);
  const email = newUser?.user?.email;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);

  const { data: ordersResp, isLoading } = useQuery({
    queryKey: ["myOrders", email, { status: activeTab, page }],
    queryFn: () =>
      getMyOrders({
        email,
        status: activeTab === "all" ? undefined : activeTab,
        page,
        limit: 10,
      }),
    enabled: !!email,
  });

  const cancelMutation = useMutation({
    mutationFn: (orderId) => cancelMyOrder(orderId, email),
    onSuccess: () => {
      toast.success("Order has been cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["myOrders"] });
      setCancelModalOrder(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    },
  });

  const orders = ordersResp?.orders || [];
  const pagination = ordersResp?.pagination || { total: 0, totalPages: 1 };

  const getStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "badge-success text-white";
      case "shipped":
        return "badge-info text-white";
      case "processing":
      case "paid":
        return "badge-warning text-white";
      case "cancelled":
        return "badge-error text-white";
      default:
        return "badge-ghost";
    }
  };

  const handleBuyAgain = (products) => {
    if (!products || !products.length) return;
    let addedCount = 0;
    products.forEach((p) => {
      if (addToCart) {
        addToCart(
          {
            pid: p.productId,
            productNameEn: p.title,
            sellPrice: String(p.price || p.finalPrice),
            bigImage: p.thumbnail,
          },
          p.vid || "default",
          1,
        );
        addedCount++;
      }
    });
    toast.success(`Added ${addedCount} item(s) to your cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <LuPackage className="size-6 text-main" /> My Orders
          </h2>
          <p className="text-xs text-base-content/60 mt-1">
            Track shipments, review purchases, and easily reorder your
            pet&apos;s favorites.
          </p>
        </div>

        {/* Filter Badges / Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 bg-base-100 p-1.5 rounded-2xl border border-base-200">
          {filterTabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-main text-white shadow-xs"
                    : "text-base-content/70 hover:bg-base-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-44 bg-base-100 rounded-3xl border border-base-200 animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-base-200 text-base-content/40 flex items-center justify-center mx-auto">
            <LuPackage className="size-8" />
          </div>
          <h3 className="font-bold text-lg text-base-content">
            No orders found
          </h3>
          <p className="text-xs text-base-content/60 max-w-sm mx-auto">
            {activeTab === "all"
              ? "You haven't placed any pet supplies orders yet."
              : `You have no ${activeTab} orders at this moment.`}
          </p>
          <Link href="/" className="btn btn-main btn-sm rounded-xl px-6 mt-2">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isPending =
              (order.orderStatus || "").toLowerCase() === "pending";
            const productCount = (order.products || []).reduce(
              (sum, p) => sum + (p.quantity || 1),
              0,
            );

            return (
              <div
                key={order._id}
                className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm hover:border-main/40 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-base-200">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-base text-base-content">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`badge badge-sm font-semibold capitalize ${getStatusBadge(
                        order.orderStatus,
                      )}`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>
                    {order.paymentStatus === "paid" && (
                      <span className="badge badge-sm badge-outline badge-success font-medium">
                        Paid
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-base-content/60 flex items-center gap-1.5">
                    <LuClock className="size-3.5" />
                    <span>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )
                        : "Recent"}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="flex flex-wrap items-center gap-2">
                    {(order.products || []).slice(0, 4).map((p, idx) => (
                      <div
                        key={idx}
                        className="w-14 h-14 rounded-2xl bg-base-200 overflow-hidden shrink-0 border border-base-300 relative group"
                        title={p.title}
                      >
                        {p.thumbnail ? (
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">
                            <LuPackage className="size-5 text-base-content/40" />
                          </div>
                        )}
                        {p.quantity > 1 && (
                          <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[10px] font-bold px-1 rounded-sm">
                            x{p.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {(order.products || []).length > 4 && (
                      <div className="w-14 h-14 rounded-2xl bg-base-200 flex items-center justify-center text-xs font-bold text-base-content/60 border border-base-300">
                        +{(order.products || []).length - 4}
                      </div>
                    )}
                    <div className="ml-2 text-xs">
                      <p className="font-semibold text-base-content line-clamp-1">
                        {order.products?.[0]?.title || "Pet Supply Product"}
                      </p>
                      <p className="text-base-content/60">
                        Total {productCount} item{productCount > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-2 md:pt-0">
                    <div className="text-right">
                      <span className="text-xs text-base-content/60 block">
                        Total Amount
                      </span>
                      <span className="text-lg font-bold text-base-content">
                        ${Number(order.total || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleBuyAgain(order.products)}
                        className="btn btn-ghost btn-sm text-main hover:bg-main/10 rounded-xl gap-1 text-xs"
                      >
                        <LuRotateCcw className="size-3.5" /> Buy Again
                      </button>

                      <Link
                        href={`/account/orders/${order._id}`}
                        className="btn btn-main btn-sm rounded-xl px-4 gap-1 text-xs"
                      >
                        Track & Details <LuArrowRight className="size-3.5" />
                      </Link>

                      {isPending && (
                        <button
                          type="button"
                          onClick={() => setCancelModalOrder(order)}
                          className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-xl text-xs"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn btn-sm btn-outline rounded-xl"
              >
                Previous
              </button>
              <span className="btn btn-sm btn-ghost pointer-events-none">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-sm btn-outline rounded-xl"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-base-100 rounded-3xl max-w-md w-full p-6 space-y-4 border border-base-200 shadow-2xl">
            <div className="flex items-center gap-3 text-error">
              <LuCircleX className="size-8" />
              <h3 className="font-bold text-lg text-base-content">
                Cancel Order?
              </h3>
            </div>
            <p className="text-xs text-base-content/70">
              Are you sure you want to cancel order{" "}
              <strong>{cancelModalOrder.orderNumber}</strong>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOrder(null)}
                className="btn btn-ghost btn-sm rounded-xl"
                disabled={cancelMutation.isPending}
              >
                Nevermind
              </button>
              <button
                type="button"
                onClick={() => cancelMutation.mutate(cancelModalOrder._id)}
                className="btn btn-error btn-sm text-white rounded-xl"
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
