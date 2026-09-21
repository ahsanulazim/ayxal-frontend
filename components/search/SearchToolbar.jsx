"use client";

import { LuFilter } from "react-icons/lu";

const SearchToolbar = ({
  productsCount,
  totalProducts,
  isFetching,
  hasActiveFilters,
  sort,
  updateParams,
}) => {
  return (
    <div className="bg-base-100 rounded-2xl p-4 border border-base-200 flex items-center justify-between gap-4 mb-6 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile Filter Trigger Button */}
        <label
          htmlFor="search-filter-drawer"
          className="btn btn-outline btn-sm rounded-xl lg:hidden gap-1.5 border-base-300"
        >
          <LuFilter className="size-3.5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="badge badge-main badge-xs text-white">Active</span>
          )}
        </label>

        {/* Counter */}
        <span className="text-xs sm:text-sm text-base-content/60 hidden sm:inline">
          Showing {productsCount} of {totalProducts} products
          {isFetching && (
            <span className="ml-2 text-xs text-main">Refreshing...</span>
          )}
        </span>
      </div>

      {/* Sort Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-base-content/60 font-medium hidden sm:inline">
          Sort by:
        </span>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value, page: 1 })}
          className="select select-bordered focus:border-main"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
};

export default SearchToolbar;
