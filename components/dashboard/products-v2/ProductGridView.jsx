"use client";

import React, { useState } from "react";
import Link from "next/link";
import moment from "moment";
import {
  LuPencil,
  LuTrash2,
  LuExternalLink,
  LuLayers,
  LuCheckCircle2,
  LuAlertTriangle,
  LuCopy,
  LuCheck,
  LuPackageOpen,
  LuCircleX,
} from "react-icons/lu";

const ProductGridView = ({
  products = [],
  isLoading = false,
  isError = false,
  selectedIds = [],
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="card bg-base-100 border border-base-content/10 shadow-xs rounded-2xl overflow-hidden animate-pulse"
          >
            <div className="skeleton aspect-square w-full"></div>
            <div className="p-4 space-y-2.5">
              <div className="skeleton h-4 w-3/4 rounded"></div>
              <div className="skeleton h-3 w-1/2 rounded"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="skeleton h-5 w-16 rounded"></div>
                <div className="skeleton h-5 w-20 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 text-center bg-base-100 rounded-2xl border border-base-content/10">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-error/10 text-error">
            <LuCircleX className="size-8" />
          </div>
          <h4 className="text-base font-bold text-base-content">
            Failed to Load Products
          </h4>
          <button
            type="button"
            onClick={onResetFilters}
            className="btn btn-sm btn-outline btn-error mt-2"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center bg-base-100 rounded-2xl border border-base-content/10">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-4 rounded-full bg-base-200 text-base-content/50">
            <LuPackageOpen className="size-10" />
          </div>
          <h4 className="text-base font-bold text-base-content">
            No Products Found
          </h4>
          <p className="text-xs text-base-content/60 max-w-sm">
            No products matched your active filters or search criteria.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="btn btn-sm btn-outline mt-2"
          >
            Reset Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => {
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
          (typeof product?.thumbnail === "string" && product?.thumbnail) ||
          "/default-product.jpg";

        return (
          <div
            key={product._id}
            className={`card bg-base-100 border transition-all duration-200 shadow-xs hover:shadow-md rounded-2xl overflow-hidden relative group ${
              isSelected
                ? "border-main ring-2 ring-main/20"
                : "border-base-content/10"
            }`}
          >
            {/* Top Bar on Image: Selection checkbox & product type badge */}
            <div className="relative aspect-square w-full bg-base-200 overflow-hidden">
              <img
                src={imageUrl}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&auto=format&fit=crop&q=60";
                }}
              />

              {/* Selection Checkbox */}
              <div className="absolute top-2.5 left-2.5 z-10">
                <label className="cursor-pointer bg-base-100/90 backdrop-blur-xs p-1.5 rounded-lg flex items-center justify-center shadow-xs border border-base-content/10">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-xs rounded checkbox-primary"
                    checked={isSelected}
                    onChange={() => onToggleSelectRow(product._id)}
                  />
                </label>
              </div>

              {/* Product Type & Stock Badge on image */}
              <div className="absolute top-2.5 right-2.5 z-10 flex flex-col items-end gap-1">
                {isVariable && (
                  <span className="badge badge-xs font-semibold badge-secondary shadow-xs gap-1">
                    <LuLayers className="size-3" /> Variable
                  </span>
                )}
                {product.isDropshipped && (
                  <span className="badge badge-xs font-semibold badge-info text-white shadow-xs">
                    CJ Dropship
                  </span>
                )}
                {isOutOfStock ? (
                  <span className="badge badge-xs badge-error text-white font-medium shadow-xs">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="badge badge-xs badge-warning font-medium shadow-xs">
                    Low Stock ({stockNum})
                  </span>
                ) : (
                  <span className="badge badge-xs badge-success text-white font-medium shadow-xs">
                    {stockNum} In Stock
                  </span>
                )}
              </div>

              {/* Quick overlay buttons on hover */}
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 via-black/20 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1.5">
                <Link
                  href={`/products/${product.slug || product._id}`}
                  target="_blank"
                  className="btn btn-circle btn-xs bg-white text-black hover:bg-white/90 border-none shadow-sm"
                  title="View Storefront"
                >
                  <LuExternalLink className="size-3.5" />
                </Link>
                <Link
                  href={`/dashboard/products/${product._id}`}
                  className="btn btn-circle btn-xs btn-main shadow-sm"
                  title="Edit Product"
                >
                  <LuPencil className="size-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => onOpenDeleteModal(product)}
                  className="btn btn-circle btn-xs btn-error text-white shadow-sm"
                  title="Delete Product"
                >
                  <LuTrash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-1 text-[11px] text-base-content/60">
                <span className="truncate max-w-30">
                  {product.category || "General"}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleCopyId(e, product._id)}
                  className="font-mono text-[10px] hover:text-base-content flex items-center gap-0.5"
                  title="Click to copy full ID"
                >
                  #{product._id.slice(-6)}
                  {copiedId === product._id ? (
                    <LuCheck className="size-2.5 text-success" />
                  ) : (
                    <LuCopy className="size-2.5" />
                  )}
                </button>
              </div>

              <Link
                href={`/dashboard/products/${product._id}`}
                className="font-bold text-sm text-base-content hover:text-main line-clamp-1 transition-colors block"
                title={product.title}
              >
                {product.title}
              </Link>

              <div className="flex items-center justify-between pt-1 border-t border-base-content/5">
                <span className="text-base font-bold text-base-content">
                  ${product.price}
                </span>
                <span className="text-[11px] text-base-content/50">
                  {moment(product.createdAt).format("MMM D, YY")}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGridView;
