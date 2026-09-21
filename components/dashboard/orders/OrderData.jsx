"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { toast } from "react-toastify";
import {
  LuSearch,
  LuEye,
  LuTrash2,
  LuShoppingBag,
  LuCircleDollarSign,
  LuClock,
  LuPackage,
  LuX,
  LuRefreshCw,
  LuChevronLeft,
  LuChevronRight,
  LuCopy,
  LuCheck,
  LuCreditCard,
  LuTruck,
  LuSparkles,
  LuCircleCheck,
  LuExternalLink,
  LuLayers,
} from "react-icons/lu";
import {
  getAllOrderData,
  getOrderStats,
  updateOrderStatus,
  syncCjOrderStatus,
} from "@/api/orderApi";
import OrderDeleteModal from "./OrderDeleteModal";
import CjFulfillConfirmModal from "./CjFulfillConfirmModal";
import BulkFulfillModal from "./BulkFulfillModal";

const CJ_STATUS_CONFIG = {
  submitted: {
    label: "Submitted",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
  },
  processing: {
    label: "Processing",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
  },
  shipped: {
    label: "Shipped",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    dotClass: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
  },
};

const ORDER_STATUS_CONFIG = {
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  processing: {
    label: "Processing",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
  },
  shipped: {
    label: "Shipped",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    dotClass: "bg-purple-500",
  },
  delivered: {
    label: "Delivered",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  cancelled: {
    label: "Cancelled",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
  },
};

const PAYMENT_STATUS_CONFIG = {
  paid: {
    label: "Paid",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  pending: {
    label: "Pending",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  failed: {
    label: "Failed",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
  },
  refunded: {
    label: "Refunded",
    badgeClass: "bg-zinc-100 text-zinc-700 border-zinc-300",
    dotClass: "bg-zinc-500",
  },
};

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
  { key: "unpaid", label: "Unpaid" },
];

const OrderData = () => {
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [orderToFulfillCj, setOrderToFulfillCj] = useState(null);
  const [syncingOrderId, setSyncingOrderId] = useState(null);

  // Dialog modal refs
  const deleteModalRef = useRef(null);
  const cjFulfillModalRef = useRef(null);
  const bulkFulfillModalRef = useRef(null);

  const handleOpenSingleFulfill = (order) => {
    setOrderToFulfillCj(order);
    cjFulfillModalRef.current?.showModal();
  };

  const handleOpenBulkFulfill = () => {
    bulkFulfillModalRef.current?.showModal();
  };

  const handleOpenDelete = (order) => {
    setOrderToDelete(order);
    deleteModalRef.current?.showModal();
  };

  // Clear selection when filters or page change (React 19 pattern)
  const [prevFilterKey, setPrevFilterKey] = useState("");
  const currentFilterKey = `${currentPage}-${activeTab}-${searchTerm}-${paymentFilter}`;
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    if (selectedOrderIds.length > 0) {
      setSelectedOrderIds([]);
    }
  }

  // Fetch KPI Stats
  const { data: statsData } = useQuery({
    queryKey: ["orderStats"],
    queryFn: getOrderStats,
    staleTime: 30000,
  });

  // Fetch Orders
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["orders", currentPage, activeTab, searchTerm, paymentFilter],
    queryFn: () =>
      getAllOrderData({
        page: currentPage,
        limit: 15,
        search: searchTerm,
        orderStatus:
          activeTab !== "all" && activeTab !== "unpaid" ? activeTab : undefined,
        paymentStatus:
          activeTab === "unpaid"
            ? "pending"
            : paymentFilter !== "all"
              ? paymentFilter
              : undefined,
      }),
  });

  // Inline status updater
  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, orderStatus, paymentStatus }) =>
      updateOrderStatus(orderId, { orderStatus, paymentStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStats"] });
      toast.success("Order status updated");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
  });

  // Sync CJ Status Mutation
  const syncCjMutation = useMutation({
    mutationFn: (orderId) => syncCjOrderStatus(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(data?.message || "CJ status updated");
      setSyncingOrderId(null);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to sync CJ status",
      );
      setSyncingOrderId(null);
    },
  });

  const handleSyncCj = (orderId) => {
    setSyncingOrderId(orderId);
    syncCjMutation.mutate(orderId);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const stats = statsData?.stats || {
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    deliveredOrders: 0,
  };

  const orders = data?.orders || [];
  const pagination = data?.pagination || {
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 15,
  };

  const isAllSelected =
    orders.length > 0 && orders.every((o) => selectedOrderIds.includes(o._id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(orders.map((o) => o._id));
    }
  };

  const handleToggleSelectRow = (orderId) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const handleSelectUnfulfilled = () => {
    const unfulfilledOnPage = orders
      .filter((o) => !o.cjOrder?.cjOrderId)
      .map((o) => o._id);
    setSelectedOrderIds(unfulfilledOnPage);
    if (unfulfilledOnPage.length === 0) {
      toast.info("No unfulfilled orders found on this page.");
    }
  };

  const selectedOrders = useMemo(() => {
    return orders.filter((o) => selectedOrderIds.includes(o._id));
  }, [orders, selectedOrderIds]);

  const unfulfilledSelectedCount = useMemo(() => {
    return selectedOrders.filter((o) => !o.cjOrder?.cjOrderId).length;
  }, [selectedOrders]);

  return (
    <div className="space-y-6">
      {/* 1. Executive Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-2xl font-black text-zinc-900 mt-1">
              {stats.totalOrders}
            </h3>
            <span className="text-xs text-zinc-400 mt-0.5 inline-block">
              All time orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-main">
            <LuShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-black text-zinc-900 mt-1">
              $
              {Number(stats.totalRevenue || 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
            <span className="text-xs text-emerald-600 font-medium mt-0.5 inline-block">
              Verified paid sales
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <LuCircleDollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Needs Action / In-progress */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Pending / Processing
            </p>
            <h3 className="text-2xl font-black text-zinc-900 mt-1">
              {(stats.pendingOrders || 0) + (stats.processingOrders || 0)}
            </h3>
            <span className="text-xs text-amber-600 font-medium mt-0.5 inline-block">
              Awaiting fulfillment
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <LuClock className="w-6 h-6" />
          </div>
        </div>

        {/* Completed / Delivered */}
        <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              Delivered
            </p>
            <h3 className="text-2xl font-black text-zinc-900 mt-1">
              {stats.deliveredOrders || 0}
            </h3>
            <span className="text-xs text-zinc-400 mt-0.5 inline-block">
              Fulfilled orders
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <LuCircleCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Controls, Filters & Live Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`btn btn-sm rounded-full ${activeTab === tab.key ? "btn-active btn-success " : "btn-soft"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn btn-sm btn-ghost text-zinc-500 hover:text-zinc-900 gap-1 text-xs"
            title="Refresh orders"
          >
            <LuRefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search & Extra Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Live Search */}
          <div className="relative w-full sm:w-80">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search order #, customer, email, phone..."
              className="w-full pl-10 pr-9 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:border-main focus:ring-1 focus:ring-main transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                <LuX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Payment Status Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-zinc-500 font-medium">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="select select-bordered select-xs rounded-xl text-xs bg-zinc-50 border-zinc-200 focus:border-main"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Floating / Sticky Bulk Action Bar */}
      {selectedOrderIds.length > 0 && (
        <div className="sticky top-20 z-20 bg-zinc-900 text-white p-3.5 sm:px-5 sm:py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 flex-wrap animate-fade-in border border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="badge badge-sm badge-success font-mono font-bold text-xs">
              {selectedOrderIds.length}
            </span>
            <span className="text-xs font-semibold text-zinc-100">
              order{selectedOrderIds.length > 1 ? "s" : ""} selected
            </span>
            <span className="text-zinc-600 hidden sm:inline">·</span>
            <span className="text-xs text-zinc-400 hidden sm:inline">
              <span className="font-semibold text-teal-400">
                {unfulfilledSelectedCount}
              </span>{" "}
              unfulfilled with CJ
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectUnfulfilled}
              className="btn btn-xs btn-ghost text-zinc-300 hover:text-white rounded-lg text-xs"
            >
              Select Unfulfilled Only
            </button>

            <button
              type="button"
              onClick={handleOpenBulkFulfill}
              className="btn btn-xs btn-main rounded-xl text-xs font-bold gap-1.5 shadow-sm px-3"
            >
              <LuSparkles className="w-3.5 h-3.5" />
              Bulk Fulfill with CJ ({unfulfilledSelectedCount})
            </button>

            <button
              type="button"
              onClick={() => setSelectedOrderIds([])}
              className="btn btn-xs btn-ghost text-zinc-400 hover:text-rose-400 rounded-lg text-xs"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* 3. Orders Table */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-zinc-50/80 border-b border-zinc-200/80 text-zinc-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="checkbox checkbox-xs rounded border-zinc-300 focus:ring-main"
                    title={
                      isAllSelected
                        ? "Deselect all"
                        : "Select all orders on page"
                    }
                  />
                </th>
                <th className="py-3.5 px-4">Order Details</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items Preview</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4">CJ Dropshipping</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-3 text-center">
                      <div className="h-4 w-4 bg-zinc-200 rounded mx-auto"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-zinc-200 rounded-md w-24 mb-1"></div>
                      <div className="h-3 bg-zinc-100 rounded-md w-16"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-zinc-200 rounded-md w-28 mb-1"></div>
                      <div className="h-3 bg-zinc-100 rounded-md w-36"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-8 w-8 bg-zinc-200 rounded-lg"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-zinc-200 rounded-full w-20"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-zinc-200 rounded-full w-24"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-6 bg-zinc-200 rounded-full w-24"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-4 bg-zinc-200 rounded-md w-16 ml-auto"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-7 bg-zinc-200 rounded-lg w-16 mx-auto"></div>
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-rose-500">
                    <p className="font-semibold">Failed to load orders.</p>
                    <button
                      onClick={() => refetch()}
                      className="btn btn-sm btn-outline btn-error mt-2 rounded-xl"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center text-zinc-400">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-400">
                      <LuPackage className="w-7 h-7" />
                    </div>
                    <p className="text-sm font-semibold text-zinc-600">
                      No orders found
                    </p>
                    <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                      {searchTerm
                        ? `No orders matching "${searchTerm}". Try a different keyword.`
                        : "Orders will appear here when customers complete checkout."}
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const orderConf =
                    ORDER_STATUS_CONFIG[order.orderStatus?.toLowerCase()] ||
                    ORDER_STATUS_CONFIG.pending;
                  const payConf =
                    PAYMENT_STATUS_CONFIG[order.paymentStatus?.toLowerCase()] ||
                    PAYMENT_STATUS_CONFIG.pending;

                  const totalItems = (order.products || []).reduce(
                    (sum, p) => sum + (Number(p.quantity) || 1),
                    0,
                  );
                  const firstProduct = order.products?.[0];

                  const customerInitials =
                    (order.customer?.firstName?.[0] || "") +
                    (order.customer?.lastName?.[0] ||
                      order.customer?.name?.[0] ||
                      "U");

                  return (
                    <tr
                      key={order._id}
                      className={`hover:bg-zinc-50/70 transition-colors group ${
                        selectedOrderIds.includes(order._id)
                          ? "bg-teal-50/30"
                          : ""
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <td className="py-3.5 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.includes(order._id)}
                          onChange={() => handleToggleSelectRow(order._id)}
                          className="checkbox checkbox-xs rounded border-zinc-300 focus:ring-main"
                        />
                      </td>

                      {/* Order Details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-zinc-900 text-xs">
                            #{order.orderNumber}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(order.orderNumber, order._id)
                            }
                            className="text-zinc-300 hover:text-zinc-600 transition-colors p-0.5"
                            title="Copy Order ID"
                          >
                            {copiedId === order._id ? (
                              <LuCheck className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <LuCopy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {moment(order.createdAt).format(
                            "MMM DD, YYYY · h:mm A",
                          )}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-teal-600 to-emerald-400 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                            {customerInitials.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-zinc-900 truncate">
                              {order.customer?.name ||
                                `${order.customer?.firstName || ""} ${
                                  order.customer?.lastName || ""
                                }`.trim() ||
                                "Customer"}
                            </p>
                            <p className="text-[11px] text-zinc-400 truncate">
                              {order.customer?.email ||
                                order.customer?.phone ||
                                "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Items Preview */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {firstProduct?.thumbnail ? (
                            <img
                              src={firstProduct.thumbnail}
                              alt={firstProduct.title}
                              className="w-9 h-9 rounded-lg object-cover border border-zinc-200/70 bg-zinc-50 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 shrink-0">
                              <LuPackage className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-zinc-800 truncate max-w-[160px]">
                              {firstProduct?.title || "Item"}
                            </p>
                            <span className="text-[11px] text-zinc-400 font-medium">
                              {totalItems} {totalItems === 1 ? "unit" : "units"}
                              {order.products?.length > 1 &&
                                ` (${order.products.length} items)`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Payment Status (Stripe Only - No COD) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${payConf.badgeClass}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${payConf.dotClass}`}
                            />
                            {payConf.label}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-medium flex items-center gap-1">
                            <LuCreditCard className="w-3 h-3 text-zinc-400" />
                            {order?.paymentDetails ? (
                              <span>
                                {order.paymentDetails.wallet
                                  ? `${order.paymentDetails.wallet === "apple_pay" ? "Apple Pay" : order.paymentDetails.wallet === "google_pay" ? "Google Pay" : order.paymentDetails.wallet}`
                                  : `${order.paymentDetails.brand ? order.paymentDetails.brand.toUpperCase() : "Card"} ••${order.paymentDetails.last4 || ""}`}
                              </span>
                            ) : (
                              <span>Stripe Card</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Store Order Status & Quick Changer */}
                      <td className="py-3.5 px-4">
                        <div className="relative group/status">
                          <select
                            value={order.orderStatus || "pending"}
                            onChange={(e) =>
                              updateStatusMutation.mutate({
                                orderId: order._id,
                                orderStatus: e.target.value,
                              })
                            }
                            className={`text-[11px] font-semibold rounded-full px-2.5 py-1 border cursor-pointer focus:outline-none focus:ring-1 focus:ring-main transition-colors ${orderConf.badgeClass}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>

                      {/* CJ Dropshipping Fulfillment Status & Action */}
                      <td className="py-3.5 px-4">
                        {order.cjOrder?.cjOrderId ? (
                          <div className="flex flex-col gap-1.5 items-start">
                            {/* CJ Status Badge & Sync */}
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                                  (
                                    CJ_STATUS_CONFIG[
                                      (
                                        order.cjOrder.status || "submitted"
                                      ).toLowerCase()
                                    ] || CJ_STATUS_CONFIG.submitted
                                  ).badgeClass
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    (
                                      CJ_STATUS_CONFIG[
                                        (
                                          order.cjOrder.status || "submitted"
                                        ).toLowerCase()
                                      ] || CJ_STATUS_CONFIG.submitted
                                    ).dotClass
                                  }`}
                                />
                                {order.cjOrder.status || "SUBMITTED"}
                              </span>

                              <button
                                type="button"
                                onClick={() => handleSyncCj(order._id)}
                                disabled={syncingOrderId === order._id}
                                className="p-1 text-zinc-400 hover:text-main rounded-md hover:bg-zinc-100 transition-colors"
                                title="Sync CJ Tracking & Status"
                              >
                                <LuRefreshCw
                                  className={`w-3 h-3 ${
                                    syncingOrderId === order._id
                                      ? "animate-spin text-main"
                                      : ""
                                  }`}
                                />
                              </button>
                            </div>

                            {/* CJ Order ID */}
                            <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-600 bg-zinc-100/80 border border-zinc-200/80 px-1.5 py-0.5 rounded">
                              <span>CJ: {order.cjOrder.cjOrderId}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleCopy(
                                    order.cjOrder.cjOrderId,
                                    `cj-${order._id}`,
                                  )
                                }
                                className="text-zinc-400 hover:text-zinc-700 p-0.5"
                                title="Copy CJ ID"
                              >
                                {copiedId === `cj-${order._id}` ? (
                                  <LuCheck className="w-2.5 h-2.5 text-emerald-600" />
                                ) : (
                                  <LuCopy className="w-2.5 h-2.5" />
                                )}
                              </button>
                            </div>

                            {/* Tracking Number if available */}
                            {(order.cjOrder.trackingNumber ||
                              order.shipping?.trackingNumber) && (
                              <a
                                href={`https://t.17track.net/en#nums=${order.cjOrder.trackingNumber || order.shipping?.trackingNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-[10px] text-primary hover:underline"
                                title="Track parcel online"
                              >
                                <LuTruck className="w-3 h-3 text-zinc-400" />
                                <span>
                                  {order.cjOrder.trackingNumber ||
                                    order.shipping?.trackingNumber}
                                </span>
                                <LuExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Unfulfilled
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Total Price */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-bold text-zinc-900 text-sm">
                          ${Number(order.total || 0).toFixed(2)}
                        </span>
                        {order.shippingCost > 0 && (
                          <p className="text-[10px] text-zinc-400">
                            incl. ${Number(order.shippingCost).toFixed(2)} shp
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {/* Fulfill Button with Truck Icon (if not fulfilled) */}
                          {!order.cjOrder?.cjOrderId ? (
                            <button
                              type="button"
                              onClick={() => handleOpenSingleFulfill(order)}
                              className="btn btn-sm btn-square btn-ghost text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl"
                              title="Fulfill Order with CJ Dropshipping"
                            >
                              <LuTruck className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              disabled
                              type="button"
                              className="btn btn-sm btn-square btn-ghost rounded-xl"
                              title="Fulfill Order with CJ Dropshipping"
                            >
                              <LuTruck className="w-4 h-4" />
                            </button>
                          )}

                          <Link
                            href={`/dashboard/orders/${order._id}`}
                            className="btn btn-sm btn-square btn-ghost text-zinc-500 hover:text-main hover:bg-main/10 rounded-xl"
                            title="View Order Details"
                          >
                            <LuEye className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenDelete(order)}
                            className="btn btn-sm btn-square btn-ghost text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                            title="Delete Order"
                          >
                            <LuTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-100 bg-zinc-50/50 text-xs text-zinc-500">
            <div>
              Showing page{" "}
              <span className="font-semibold text-zinc-800">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-zinc-800">
                {pagination.totalPages}
              </span>{" "}
              ({pagination.total} total orders)
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="btn btn-xs btn-outline rounded-lg text-xs"
              >
                <LuChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                disabled={currentPage >= pagination.totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                className="btn btn-xs btn-outline rounded-lg text-xs"
              >
                Next <LuChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controlled Delete Modal */}
      <OrderDeleteModal
        ref={deleteModalRef}
        order={orderToDelete}
        onClose={() => setOrderToDelete(null)}
      />

      {/* Single CJ Fulfill Confirmation Modal */}
      <CjFulfillConfirmModal
        ref={cjFulfillModalRef}
        order={orderToFulfillCj}
        onSuccess={() => {
          setSelectedOrderIds((prev) =>
            orderToFulfillCj
              ? prev.filter((id) => id !== orderToFulfillCj?._id)
              : prev,
          );
        }}
      />

      {/* Bulk CJ Fulfill Modal */}
      <BulkFulfillModal
        ref={bulkFulfillModalRef}
        selectedOrders={selectedOrders}
        onSuccess={() => {
          setSelectedOrderIds([]);
        }}
      />
    </div>
  );
};

export default OrderData;
