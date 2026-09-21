"use client";

import { LuFilter, LuRotateCcw } from "react-icons/lu";

const SearchSidebar = ({
  categories = [],
  categoryParam = "",
  brands = [],
  brandParam = "",
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  handlePriceApply,
  inStockParam,
  onSaleParam,
  updateParams,
  clearAllFilters,
  hasActiveFilters,
}) => {
  return (
    <aside className="drawer-side z-40 lg:z-auto">
      <label
        htmlFor="search-filter-drawer"
        aria-label="close sidebar"
        className="drawer-overlay lg:hidden"
      ></label>
      <div className="bg-base-100 border border-base-200 rounded-3xl p-5 w-80 space-y-6 shadow-xs max-lg:min-h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-3 border-b border-base-200">
          <h3 className="font-bold text-base text-base-content flex items-center gap-2">
            <LuFilter className="size-4 text-main" /> Filters
          </h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-error hover:underline flex items-center gap-1 font-medium"
            >
              <LuRotateCcw className="size-3" /> Reset
            </button>
          )}
        </div>

        {/* 1. Categories Filter */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-base-content/70 uppercase tracking-wider">
            Categories
          </h4>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => updateParams({ category: undefined, page: 1 })}
              className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                !categoryParam
                  ? "bg-main text-white"
                  : "hover:bg-base-200 text-base-content"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const isSelected = categoryParam === cat.slug;
              return (
                <button
                  key={cat.slug || cat._id}
                  type="button"
                  onClick={() =>
                    updateParams({
                      category: isSelected ? undefined : cat.slug,
                      page: 1,
                    })
                  }
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-main text-white"
                      : "hover:bg-base-200 text-base-content"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Price Range Filter */}
        <div className="space-y-2.5 pt-4 border-t border-base-200">
          <h4 className="text-xs font-bold text-base-content/70 uppercase tracking-wider">
            Price Range ($)
          </h4>
          <form onSubmit={handlePriceApply} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-base-content/50 block mb-1">
                  Min ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="input input-bordered input-sm w-full rounded-xl text-xs focus:border-main"
                />
              </div>
              <div>
                <label className="text-[10px] text-base-content/50 block mb-1">
                  Max ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="100+"
                  className="input input-bordered input-sm w-full rounded-xl text-xs focus:border-main"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-sm w-full rounded-xl font-semibold hover:bg-main hover:border-main hover:text-white"
            >
              Apply Price
            </button>
          </form>
        </div>

        {/* 3. Brands Filter */}
        {brands.length > 0 && (
          <div className="space-y-2.5 pt-4 border-t border-base-200">
            <h4 className="text-xs font-bold text-base-content/70 uppercase tracking-wider">
              Brands
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {brands.map((b) => {
                const isSelected = brandParam === b.name;
                return (
                  <label
                    key={b._id || b.name}
                    className="flex items-center gap-2 text-xs text-base-content hover:text-main cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        updateParams({
                          brand: isSelected ? undefined : b.name,
                          page: 1,
                        })
                      }
                      className="checkbox checkbox-xs checkbox-primary rounded-xs"
                    />
                    <span className="truncate">{b.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Stock & Sale Toggles */}
        <div className="space-y-3 pt-4 border-t border-base-200">
          <label className="flex items-center justify-between text-xs font-medium cursor-pointer">
            <span>In Stock Only</span>
            <input
              type="checkbox"
              checked={inStockParam}
              onChange={(e) =>
                updateParams({
                  inStock: e.target.checked ? "true" : undefined,
                  page: 1,
                })
              }
              className="toggle toggle-sm toggle-primary"
            />
          </label>

          <label className="flex items-center justify-between text-xs font-medium cursor-pointer">
            <span>On Sale / Discounted</span>
            <input
              type="checkbox"
              checked={onSaleParam}
              onChange={(e) =>
                updateParams({
                  onSale: e.target.checked ? "true" : undefined,
                  page: 1,
                })
              }
              className="toggle toggle-sm toggle-primary"
            />
          </label>
        </div>
      </div>
    </aside>
  );
};

export default SearchSidebar;
