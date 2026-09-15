"use client";

import React from "react";
import Link from "next/link";
import {
  LuSearch,
  LuX,
  LuFilter,
  LuDownload,
  LuLayoutGrid,
  LuTable,
  LuPlus,
  LuSparkles,
  LuRotateCw,
  LuArrowUpDown,
} from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/api/categoryApi";

const STATUS_TABS = [
  { id: "all", label: "All Products" },
  { id: "in-stock", label: "In Stock" },
  { id: "low-stock", label: "Low Stock" },
  { id: "out-of-stock", label: "Out of Stock" },
  { id: "variable", label: "Variable" },
  { id: "single", label: "Single" },
];

const ProductToolbar = ({
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
  onClearSearch,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  limit,
  onLimitChange,
  viewMode,
  onViewModeChange,
  onExportCSV,
  onRefresh,
  isRefreshing,
  totalProductsCount = 0,
}) => {
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : categoriesData?.categories || [];

  return (
    <div className="space-y-4 mb-6">
      {/* Top row: Title, quick actions, Add buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-base-content">
              Products Catalog
            </h1>
            <span className="badge badge-neutral badge-sm font-semibold">
              {totalProductsCount} total
            </span>
          </div>
          <p className="text-xs text-base-content/60 mt-0.5">
            Manage inventory, pricing, variations, and catalog visibility
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onRefresh}
            className={`btn btn-sm btn-ghost btn-circle border border-base-content/10 ${
              isRefreshing ? "animate-spin" : ""
            }`}
            title="Refresh Products"
          >
            <LuRotateCw className="size-4" />
          </button>

          <button
            type="button"
            onClick={onExportCSV}
            className="btn btn-sm btn-outline border-base-content/20 hover:border-base-content/40 gap-1.5"
            title="Export to CSV"
          >
            <LuDownload className="size-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          {/* View Mode Switcher */}
          <div className="join border border-base-content/20 rounded-lg p-0.5 bg-base-200/50">
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`join-item btn btn-xs border-none ${
                viewMode === "table" ? "btn-main shadow-xs" : "btn-ghost"
              }`}
              title="Table View"
            >
              <LuTable className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`join-item btn btn-xs border-none ${
                viewMode === "grid" ? "btn-main shadow-xs" : "btn-ghost"
              }`}
              title="Grid View"
            >
              <LuLayoutGrid className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Second row: Quick Filter Tabs */}
      <div className="border-b border-base-content/10 flex items-center overflow-x-auto no-scrollbar gap-1 py-1">
        {STATUS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                isActive
                  ? "bg-main text-white shadow-xs font-semibold"
                  : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Third row: Search input, Category Filter, Sort, Limit */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-base-100 p-3 rounded-xl border border-base-content/10 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-60">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, SKU, or tags..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input input-sm w-full pl-9 pr-8 bg-base-200/60 focus:bg-base-100 rounded-lg border-base-content/15 text-xs transition"
          />
          {searchValue && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40 hover:text-base-content rounded-full flex items-center justify-center"
            >
              <LuX className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filters and controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="select select-sm text-xs rounded-lg border-base-content/15 pr-7"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option
                  key={cat._id || cat.slug || cat.name}
                  value={cat.name || cat.slug}
                >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="select select-sm text-xs rounded-lg border-base-content/15 pr-7"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title-asc">Title: A to Z</option>
              <option value="title-desc">Title: Z to A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
            </select>
          </div>

          {/* Rows per page */}
          <div className="flex items-center gap-1.5 text-xs text-base-content/60">
            <span className="hidden md:inline">Show</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="select select-sm text-xs rounded-lg border-base-content/15"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
