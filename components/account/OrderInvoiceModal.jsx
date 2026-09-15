"use client";

import { LuCheck, LuPrinter, LuX } from "react-icons/lu";

const OrderInvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.orderNumber || order._id?.slice(-6)}`;
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-base-100 rounded-3xl w-full max-w-2xl shadow-2xl border border-base-200 overflow-hidden my-8">
        {/* Top Control Bar (Hidden on print) */}
        <div className="p-4 border-b border-base-200 flex items-center justify-between bg-base-200/50 print:hidden">
          <span className="text-xs font-bold text-base-content uppercase tracking-wider">
            Order Invoice Preview
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="btn btn-main btn-xs rounded-lg gap-1"
            >
              <LuPrinter className="size-3.5" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              type="button"
              className="btn btn-ghost btn-xs btn-circle"
            >
              <LuX className="size-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div id="printable-invoice" className="p-8 space-y-6 text-base-content bg-white">
          {/* Invoice Header */}
          <div className="flex items-start justify-between border-b border-base-200 pb-6">
            <div>
              <h2 className="text-2xl font-black text-main tracking-tight">
                PretyPet 🐾
              </h2>
              <p className="text-xs text-base-content/60 mt-0.5">
                Premium Pet Supplies & Nutrition
              </p>
              <p className="text-xs text-base-content/60">support@pretypet.com</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-base-content/60 uppercase">
                Invoice
              </span>
              <h3 className="font-mono font-bold text-lg text-base-content">
                {invoiceNumber}
              </h3>
              <p className="text-xs text-base-content/60">{orderDate}</p>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  <LuCheck className="size-3" /> PAID
                </span>
              </div>
            </div>
          </div>

          {/* Billed To / Shipping Address */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-bold uppercase text-base-content/50 tracking-wider text-[10px] mb-1">
                Delivery Recipient
              </p>
              <p className="font-semibold text-sm">{order.customer?.name || "Customer"}</p>
              <p className="text-base-content/70 mt-0.5">{order.customer?.address}</p>
              <p className="text-base-content/70">
                {[order.customer?.city, order.customer?.state, order.customer?.zip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-base-content/70">
                {order.customer?.country || "United States"}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold uppercase text-base-content/50 tracking-wider text-[10px] mb-1">
                Payment Details
              </p>
              <p className="font-medium">
                Method: {order.paymentMethod || "Credit Card (Stripe)"}
              </p>
              <p className="text-base-content/70">
                Order ID: #{order.orderNumber || order._id}
              </p>
              <p className="text-base-content/70">
                Status: {order.orderStatus || "Completed"}
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-base-200 rounded-2xl overflow-hidden">
            <table className="table table-xs w-full">
              <thead className="bg-base-200/60 text-xs">
                <tr>
                  <th className="py-2.5">Item Description</th>
                  <th className="text-center py-2.5">Qty</th>
                  <th className="text-right py-2.5">Unit Price</th>
                  <th className="text-right py-2.5">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-xs">
                {(order.products || []).map((item, idx) => {
                  const unitPrice = Number(item.finalPrice || item.price || 0);
                  const qty = Number(item.quantity || 1);
                  const lineTotal = unitPrice * qty;

                  return (
                    <tr key={idx}>
                      <td className="py-2.5 font-medium">
                        {item.title}
                        {item.selectedAttributes &&
                          Object.keys(item.selectedAttributes).length > 0 && (
                            <span className="text-base-content/50 text-[10px] block">
                              {Object.entries(item.selectedAttributes)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ")}
                            </span>
                          )}
                      </td>
                      <td className="text-center py-2.5">{qty}</td>
                      <td className="text-right py-2.5">${unitPrice.toFixed(2)}</td>
                      <td className="text-right py-2.5 font-semibold">
                        ${lineTotal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-base-content/70">
                <span>Subtotal:</span>
                <span>
                  ${Number(order.subtotal || order.total || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base-content/70">
                <span>Shipping:</span>
                <span>
                  {Number(order.shippingCost || 0) > 0
                    ? `$${Number(order.shippingCost).toFixed(2)}`
                    : "Free"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-base-content pt-2 border-t border-base-200">
                <span>Total:</span>
                <span className="text-main">
                  ${Number(order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer message */}
          <div className="pt-6 border-t border-base-200 text-center text-xs text-base-content/60">
            <p className="font-semibold text-main">
              Thank you for trusting PretyPet with your companion&apos;s happiness! 🐾
            </p>
            <p className="mt-0.5 text-[11px]">
              If you have any questions regarding this invoice, contact support@pretypet.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoiceModal;
