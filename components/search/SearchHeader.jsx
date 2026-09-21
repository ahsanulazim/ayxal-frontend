"use client";

import Link from "next/link";
import { LuHouse, LuSearch, LuX, LuRotateCcw } from "react-icons/lu";
import { FaPaw } from "react-icons/fa6";

const SearchHeader = ({
  searchQuery,
  totalProducts,
  isLoading,
  hasActiveFilters,
  localSearch,
  setLocalSearch,
  handleSearchSubmit,
  categoryParam,
  brandParam,
  minPriceParam,
  maxPriceParam,
  inStockParam,
  onSaleParam,
  updateParams,
  clearAllFilters,
}) => {
  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumbs text-xs text-base-content/60">
        <ul>
          <li>
            <Link href="/" className="hover:text-main flex items-center gap-1">
              <LuHouse className="size-3.5" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/products" className="hover:text-main">
              Products
            </Link>
          </li>
          <li className="font-semibold text-base-content truncate max-w-xs">
            {searchQuery ? `Search: "${searchQuery}"` : "All Products Search"}
          </li>
        </ul>
      </nav>

      {/* Header Banner */}
      <section className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-main/10 text-main text-xs font-semibold">
              <FaPaw className="size-3" />
              <span>Product Search</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-base-content tracking-tight">
              {searchQuery ? (
                <span>
                  Results for{" "}
                  <span className="text-main">&quot;{searchQuery}&quot;</span>
                </span>
              ) : (
                "Search All Pet Supplies"
              )}
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60">
              {isLoading ? (
                "Searching pet catalog..."
              ) : (
                <>
                  Found{" "}
                  <strong className="text-base-content">{totalProducts}</strong>{" "}
                  {totalProducts === 1 ? "product" : "products"}
                  {hasActiveFilters && " matching your filters"}
                </>
              )}
            </p>
          </div>

          {/* Inline Quick Search Input */}
          <form onSubmit={handleSearchSubmit} className="w-full md:max-w-md">
            <label className="flex items-center gap-2 border border-base-300 focus-within:border-main focus-within:ring-2 focus-within:ring-main/15 rounded-2xl bg-base-200/40 px-3.5 py-2 transition-all">
              <LuSearch className="size-4 text-base-content/40 shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search dog treats, grooming, toys..."
                className="w-full text-xs sm:text-sm bg-transparent outline-hidden text-base-content placeholder:text-base-content/40"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => setLocalSearch("")}
                  className="text-base-content/40 hover:text-base-content p-1"
                  aria-label="Clear input"
                >
                  <LuX className="size-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="btn btn-main btn-xs rounded-xl px-3 font-semibold shrink-0"
              >
                Search
              </button>
            </label>
          </form>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-base-200 text-xs">
            <span className="text-base-content/50 font-medium">
              Active filters:
            </span>

            {categoryParam && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-main/10 text-main font-medium">
                Category: {categoryParam}
                <button
                  onClick={() => updateParams({ category: undefined, page: 1 })}
                  className="hover:opacity-75"
                >
                  <LuX className="size-3" />
                </button>
              </span>
            )}

            {brandParam && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-main/10 text-main font-medium">
                Brand: {brandParam}
                <button
                  onClick={() => updateParams({ brand: undefined, page: 1 })}
                  className="hover:opacity-75"
                >
                  <LuX className="size-3" />
                </button>
              </span>
            )}

            {(minPriceParam || maxPriceParam) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-main/10 text-main font-medium">
                Price: ${minPriceParam || "0"} - ${maxPriceParam || "∞"}
                <button
                  onClick={() =>
                    updateParams({
                      minPrice: undefined,
                      maxPrice: undefined,
                      page: 1,
                    })
                  }
                  className="hover:opacity-75"
                >
                  <LuX className="size-3" />
                </button>
              </span>
            )}

            {inStockParam && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                In Stock Only
                <button
                  onClick={() => updateParams({ inStock: undefined, page: 1 })}
                  className="hover:opacity-75"
                >
                  <LuX className="size-3" />
                </button>
              </span>
            )}

            {onSaleParam && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">
                On Sale
                <button
                  onClick={() => updateParams({ onSale: undefined, page: 1 })}
                  className="hover:opacity-75"
                >
                  <LuX className="size-3" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-error hover:underline flex items-center gap-1 ml-auto font-medium"
            >
              <LuRotateCcw className="size-3" /> Clear all
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default SearchHeader;
