"use client";

import { getOrderDetails } from "@/api/orderApi";
import OrderInvoiceModal from "@/components/account/OrderInvoiceModal";
import OrderTimeline from "@/components/account/OrderTimeline";
import Spinner from "@/components/skeleton/Spinner";
import { MyContext } from "@/context/MyProvider";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useContext, useState } from "react";
import {
  LuArrowLeft,
  LuCreditCard,
  LuFileText,
  LuMapPin,
  LuPackage,
  LuPhone,
  LuRotateCcw,
  LuStar,
  LuUser,
} from "react-icons/lu";
import { toast } from "react-toastify";

const OrderDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(MyContext);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["orderDetails", id],
    queryFn: () => getOrderDetails(id),
    enabled: !!id,
  });

  const order = data?.order;

  const handleBuyAgain = () => {
    if (!order?.products || !order.products.length) return;
    let addedCount = 0;
    order.products.forEach((p) => {
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
    toast.success(`Added ${addedCount} item(s) back to your cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-200 space-y-4">
        <h3 className="text-lg font-bold text-base-content">Order Not Found</h3>
        <p className="text-xs text-base-content/60">
          The requested order does not exist or you do not have permission to
          view it.
        </p>
        <Link href="/account/orders" className="btn btn-main btn-sm rounded-xl">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Title bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/account/orders"
            className="btn btn-ghost btn-sm btn-circle text-base-content/70 hover:text-base-content"
          >
            <LuArrowLeft className="size-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-base-content">
                Order {order.orderNumber}
              </h2>
              <span className="badge badge-sm font-semibold capitalize badge-primary">
                {order.orderStatus || "Pending"}
              </span>
            </div>
            <p className="text-xs text-base-content/60 mt-0.5">
              Placed on{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsInvoiceOpen(true)}
            className="btn btn-outline btn-sm rounded-xl gap-1.5 text-xs"
          >
            <LuFileText className="size-3.5 text-main" /> View Invoice
          </button>

          <button
            type="button"
            onClick={handleBuyAgain}
            className="btn btn-main btn-sm rounded-xl gap-1.5 text-xs"
          >
            <LuRotateCcw className="size-3.5" /> Buy Again
          </button>
        </div>
      </div>

      {/* Visual Tracking Stepper */}
      <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-3">
        <h3 className="font-bold text-base text-base-content">
          Shipment Progress
        </h3>
        <OrderTimeline
          orderStatus={order.orderStatus}
          trackingNumber={order.trackingNumber || order.courierTrackingId}
          carrier={order.carrier || order.courierName}
          createdAt={order.createdAt}
        />
      </div>

      {/* 2-Column Info: Items vs Shipping & Payment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Product Items */}
        <div className="lg:col-span-2 bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-4">
          <h3 className="font-bold text-base text-base-content flex items-center gap-2">
            <LuPackage className="size-5 text-main" /> Order Items (
            {(order.products || []).length})
          </h3>

          <div className="divide-y divide-base-200">
            {(order.products || []).map((item, idx) => {
              const itemTotal =
                (Number(item.finalPrice || item.price) || 0) *
                (Number(item.quantity) || 1);
              return (
                <div
                  key={idx}
                  className="py-4 flex items-center justify-between gap-4 first:pt-2 last:pb-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-base-200 overflow-hidden shrink-0 border border-base-300">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <LuPackage className="size-6 text-base-content/40" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-base-content line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-base-content/60 mt-1">
                        Qty: {item.quantity || 1} × $
                        {Number(item.finalPrice || item.price || 0).toFixed(2)}
                      </p>
                      {item.selectedAttributes &&
                        Object.keys(item.selectedAttributes).length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {Object.entries(item.selectedAttributes).map(
                              ([k, v]) => (
                                <span
                                  key={k}
                                  className="badge badge-xs badge-ghost text-[10px]"
                                >
                                  {k}: {v}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="font-bold text-sm text-base-content whitespace-nowrap">
                      ${itemTotal.toFixed(2)}
                    </span>
                    {(order.orderStatus || "").toLowerCase() === "delivered" && (
                      <Link
                        href="/account/reviews"
                        className="btn btn-ghost btn-xs text-amber-600 hover:bg-amber-500/10 rounded-lg gap-1 mt-1 text-[11px]"
                      >
                        <LuStar className="size-3 fill-amber-400 text-amber-400" /> Review
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="pt-4 border-t border-base-200 space-y-2 text-xs">
            <div className="flex justify-between text-base-content/70">
              <span>Subtotal</span>
              <span>
                ${Number(order.subtotal || order.total || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-base-content/70">
              <span>Shipping</span>
              <span>
                {Number(order.shippingCost || 0) > 0
                  ? `$${Number(order.shippingCost).toFixed(2)}`
                  : "Free"}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-base-content pt-2 border-t border-base-200">
              <span>Total Paid</span>
              <span className="text-main">
                ${Number(order.total || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Shipping & Customer Details */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
              <LuMapPin className="size-4 text-main" /> Delivery Address
            </h3>
            <div className="text-xs text-base-content/80 space-y-1">
              <p className="font-semibold text-sm text-base-content flex items-center gap-1.5">
                <LuUser className="size-3.5 text-main" />
                {order.customer?.name || "Recipient"}
              </p>
              {order.customer?.phone && (
                <p className="flex items-center gap-1.5 text-base-content/70">
                  <LuPhone className="size-3 text-base-content/50" />
                  {order.customer.phone}
                </p>
              )}
              <p className="pt-1">{order.customer?.address}</p>
              <p>
                {[
                  order.customer?.city,
                  order.customer?.state,
                  order.customer?.zip,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-base-content/50">
                {order.customer?.country || "United States"}
              </p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
              <LuCreditCard className="size-4 text-main" /> Payment Info
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Payment Method:</span>
                <span className="font-semibold text-base-content">
                  {order.paymentMethod || "Stripe / Card"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/70">Payment Status:</span>
                <span
                  className={`badge badge-sm font-semibold capitalize ${
                    order.paymentStatus === "paid"
                      ? "badge-success text-white"
                      : "badge-warning text-white"
                  }`}
                >
                  {order.paymentStatus || "Pending"}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex items-center justify-between text-base-content/60">
                  <span>Paid At:</span>
                  <span>{new Date(order.paidAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Print & PDF Modal */}
      <OrderInvoiceModal
        order={order}
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />
    </div>
  );
};

export default OrderDetailPage;
