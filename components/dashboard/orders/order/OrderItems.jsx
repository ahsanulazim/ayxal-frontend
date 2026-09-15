"use client";

import { LuPackage, LuTag } from "react-icons/lu";

const OrderItems = ({ order }) => {
  const products = order?.products || [];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-50 text-main border border-teal-100">
            <LuPackage className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-base text-zinc-900">
            Purchased Items ({products.length})
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
          {products.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0)} Total Units
        </span>
      </div>

      <div className="divide-y divide-zinc-100">
        {products.map((product, idx) => {
          const itemPrice = Number(product.finalPrice || product.price || 0);
          const itemQty = Number(product.quantity || 1);
          const itemTotal = itemPrice * itemQty;
          const thumbnail = product.thumbnail || product.image;
          const title = product.title || product.productName || product.name || "Pet Product";

          // Selected attributes / variants
          const attributes = product.selectedAttributes || {};
          const attrEntries = Object.entries(attributes);

          return (
            <div
              key={product.productId || product.vid || idx}
              className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-zinc-50/50 transition-colors"
            >
              {/* Image & Title */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={title}
                    className="w-14 h-14 rounded-xl object-cover border border-zinc-200 bg-zinc-50 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400 shrink-0">
                    <LuPackage className="w-6 h-6" />
                  </div>
                )}

                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-zinc-900 leading-snug truncate">
                    {title}
                  </h4>

                  {/* Attributes Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    {attrEntries.length > 0 ? (
                      attrEntries.map(([key, val]) => (
                        <span
                          key={key}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 text-[11px] font-medium text-zinc-600"
                        >
                          <LuTag className="w-2.5 h-2.5 text-zinc-400" />
                          <span className="capitalize">{key}:</span>
                          <span className="font-semibold text-zinc-800">{String(val)}</span>
                        </span>
                      ))
                    ) : (
                      (product.size || product.color) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 text-[11px] font-medium text-zinc-600">
                          {product.size && `Size: ${product.size}`}
                          {product.size && product.color && " · "}
                          {product.color && `Color: ${product.color}`}
                        </span>
                      )
                    )}

                    {product.sku && (
                      <span className="text-[10px] text-zinc-400 font-mono">
                        SKU: {product.sku}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Quantity Breakdown */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                <div className="text-left sm:text-right">
                  <p className="text-xs text-zinc-400">Price per unit</p>
                  <p className="text-sm font-semibold text-zinc-800">
                    ${itemPrice.toFixed(2)} × {itemQty}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-zinc-400">Line total</p>
                  <p className="text-base font-black text-zinc-900">
                    ${itemTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderItems;
