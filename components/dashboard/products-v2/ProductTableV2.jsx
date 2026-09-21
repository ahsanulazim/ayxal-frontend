"use client";

import React, { useState } from "react";
import Link from "next/link";
import moment from "moment";
import {
  LuCopy,
  LuCheck,
  LuPencil,
  LuTrash2,
  LuExternalLink,
  LuLayers,
  LuPackageOpen,
  LuArrowUpDown,
  LuTriangleAlert,
  LuCircleCheck,
  LuCircleX,
  LuShoppingBag,
} from "react-icons/lu";

const ProductTableV2 = ({
  products = [],
  isLoading = false,
  isError = false,
  selectedIds = [],
  onToggleSelectAll,
  onToggleSelectRow,
  onOpenDeleteModal,
  onResetFilters,
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyId = (e, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const isAllSelected =
    products.length > 0 && products.every((p) => selectedIds.includes(p._id));
  const isPartiallySelected = selectedIds.length > 0 && !isAllSelected;

  return (
    <div className="overflow-x-auto rounded-2xl border border-base-content/10 bg-base-100 shadow-xs">
      <table className="table table-zebra w-full">
        {/* Table Header */}
        <thead>
          <tr className="bg-base-200/80 text-base-content/80 text-xs uppercase tracking-wider font-semibold border-b border-base-content/10">
            <th className="w-12 text-center">
              <label className="cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm rounded-md checkbox-primary"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={onToggleSelectAll}
                  disabled={isLoading || products.length === 0}
                />
              </label>
            </th>
            <th className="min-w-70">Product</th>
            <th className="w-32">Product ID</th>
            <th className="w-36">Category</th>
            <th className="w-32">Price</th>
            <th className="w-36">Stock Status</th>
            <th className="w-32">Created</th>
            <th className="w-32">Updated</th>
            <th className="w-28 text-right pr-5">Actions</th>
          </tr>
        </thead>

        <tbody>
          {/* 1. Loading Skeleton */}
          {isLoading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <tr key={idx} className="border-b border-base-content/5">
                <td className="text-center">
                  <div className="skeleton size-5 rounded mx-auto"></div>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="skeleton size-12 rounded-xl shrink-0"></div>
                    <div className="space-y-2 flex-1">
                      <div className="skeleton h-4 w-44 rounded"></div>
                      <div className="skeleton h-3 w-20 rounded"></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="skeleton h-4 w-20 rounded"></div>
                </td>
                <td>
                  <div className="skeleton h-5 w-24 rounded-full"></div>
                </td>
                <td>
                  <div className="skeleton h-4 w-16 rounded"></div>
                </td>
                <td>
                  <div className="skeleton h-6 w-24 rounded-full"></div>
                </td>
                <td>
                  <div className="skeleton h-4 w-20 rounded"></div>
                </td>
                <td>
                  <div className="skeleton h-4 w-20 rounded"></div>
                </td>
                <td>
                  <div className="flex justify-end gap-1.5 pr-2">
                    <div className="skeleton size-8 rounded-lg"></div>
                    <div className="skeleton size-8 rounded-lg"></div>
                  </div>
                </td>
              </tr>
            ))
          ) : isError ? (
            /* 2. Error State */
            <tr>
              <td colSpan={9} className="py-16 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-3 rounded-full bg-error/10 text-error">
                    <LuCircleX className="size-8" />
                  </div>
                  <h4 className="text-base font-bold text-base-content">
                    Failed to Load Products
                  </h4>
                  <p className="text-xs text-base-content/60 max-w-sm">
                    There was an issue retrieving the catalog from the server.
                    Please check your network connection and try again.
                  </p>
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="btn btn-sm btn-outline btn-error mt-2"
                  >
                    Retry Loading
                  </button>
                </div>
              </td>
            </tr>
          ) : products.length === 0 ? (
            /* 3. Empty State */
            <tr>
              <td colSpan={9} className="py-20 text-center">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="p-4 rounded-full bg-base-200 text-base-content/50">
                    <LuPackageOpen className="size-10" />
                  </div>
                  <h4 className="text-base font-bold text-base-content">
                    No Products Found
                  </h4>
                  <p className="text-xs text-base-content/60 max-w-sm">
                    No products matched your active filters or search criteria.
                    Try resetting filters or adding new items to your catalog.
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="btn btn-sm btn-outline"
                    >
                      Reset Filters
                    </button>
                    <Link
                      href="/dashboard/products/add-product"
                      className="btn btn-sm btn-main"
                    >
                      Add New Product
                    </Link>
                  </div>
                </div>
              </td>
            </tr>
          ) : (
            /* 4. Products Rows */
            products.map((product) => {
              const isSelected = selectedIds.includes(product._id);
              const stockNum =
                typeof product.stock === "number"
                  ? product.stock
                  : parseInt(product.stock, 10);
              const isOutOfStock = isNaN(stockNum) || stockNum <= 0;
              const isLowStock = !isOutOfStock && stockNum <= 5;
              const isVariable = !!product.hasVariations;

              const imageUrl =
                product?.thumbnail?.url ||
                (typeof product?.thumbnail === "string" &&
                  product?.thumbnail) ||
                "/default-product.jpg";

              return (
                <tr
                  key={product._id}
                  className={`hover:bg-base-200/50 transition-colors border-b border-base-content/5 ${
                    isSelected ? "bg-main/5" : ""
                  }`}
                >
                  {/* Selection Checkbox */}
                  <td className="text-center">
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm rounded-md checkbox-primary"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(product._id)}
                      />
                    </label>
                  </td>

                  {/* Product Media & Title */}
                  <td>
                    <div className="flex items-center gap-3.5">
                      <div className="avatar">
                        <div className="mask mask-squircle size-12 border border-base-content/10 bg-base-200/50 relative overflow-hidden group">
                          <img
                            src={imageUrl}
                            alt={product.title}
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=150&auto=format&fit=crop&q=60";
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Link
                          href={`/dashboard/products/${product._id}`}
                          className="font-bold text-sm text-base-content hover:text-main line-clamp-1 transition-colors"
                          title={product.title}
                        >
                          {product.title}
                        </Link>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isVariable ? (
                            <span className="badge badge-xs font-semibold badge-soft badge-secondary gap-1">
                              <LuLayers className="size-3" />
                              Variable
                            </span>
                          ) : (
                            <span className="badge badge-xs font-semibold badge-soft">
                              Single
                            </span>
                          )}
                          {product.isDropshipped && (
                            <span
                              className="badge badge-xs font-semibold badge-soft badge-info gap-1"
                              title={`Sourced from CJ Dropshipping (PID: ${product.cjProductId || "N/A"})`}
                            >
                              <LuShoppingBag className="size-3" />
                              CJ Dropship
                            </span>
                          )}
                          {product.brand && (
                            <span className="text-[11px] text-base-content/50">
                              • {product.brand}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Product ID with copy button */}
                  <td>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs text-base-content/70">
                        #{product._id.slice(-6)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyId(e, product._id)}
                        className="btn btn-ghost btn-xs btn-circle text-base-content/50 hover:text-base-content"
                        title={
                          copiedId === product._id ? "Copied!" : "Copy Full ID"
                        }
                      >
                        {copiedId === product._id ? (
                          <LuCheck className="size-3 text-success" />
                        ) : (
                          <LuCopy className="size-3" />
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Category */}
                  <td>
                    <span className="badge badge-sm badge-soft badge-neutral whitespace-nowrap">
                      {product.category || "Uncategorized"}
                    </span>
                  </td>

                  {/* Price */}
                  <td>
                    <div className="font-semibold text-sm text-base-content">
                      ${product.price}
                    </div>
                  </td>

                  {/* Stock Status Pill */}
                  <td>
                    {isOutOfStock ? (
                      <span className="badge badge-sm badge-error">
                        <LuCircleX className="size-3" />
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="badge badge-sm badge-warning">
                        <LuTriangleAlert className="size-3" />
                        Low ({stockNum})
                      </span>
                    ) : (
                      <span className="badge badge-sm badge-success badge-soft whitespace-nowrap">
                        <LuCircleCheck className="size-3" />
                        {stockNum} In Stock
                      </span>
                    )}
                  </td>

                  {/* Created Date */}
                  <td>
                    <div className="text-xs text-base-content/80 whitespace-nowrap">
                      {moment(product.createdAt).format("MMM D, YYYY")}
                    </div>
                    <div className="text-[10px] text-base-content/50">
                      {moment(product.createdAt).fromNow()}
                    </div>
                  </td>

                  {/* Updated Date */}
                  <td>
                    <div className="text-xs text-base-content/80 whitespace-nowrap">
                      {moment(product.updatedAt || product.createdAt).format(
                        "MMM D, YYYY",
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="text-right pr-4">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Storefront Link */}
                      <Link
                        href={`/products/${product.categorySlug}/${product.slug || product._id}`}
                        target="_blank"
                        className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-base-content"
                        title="View on Storefront"
                      >
                        <LuExternalLink className="size-3.5" />
                      </Link>

                      {/* Edit Product */}
                      <Link
                        href={`/dashboard/products/${product._id}`}
                        className="btn btn-soft btn-primary btn-xs btn-circle"
                        title="Edit Product"
                      >
                        <LuPencil className="size-3.5" />
                      </Link>

                      {/* Delete Product */}
                      <button
                        type="button"
                        onClick={() => onOpenDeleteModal(product)}
                        className="btn btn-soft btn-error btn-xs btn-circle"
                        title="Delete Product"
                      >
                        <LuTrash2 className="size-3.5" />
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
  );
};

export default ProductTableV2;
