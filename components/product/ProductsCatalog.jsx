"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchProducts } from "@/api/productApi";
import { getAllCategories } from "@/api/categoryApi";
import { getAllBrands } from "@/api/brandApi";
import { createQueryString } from "@/components/shop/utils/updateSearchParams";

// Icons
import {
  LuHouse,
  LuSearch,
  LuFilter,
  LuRotateCcw,
  LuX,
  LuSparkles,
} from "react-icons/lu";
import { FaPaw } from "react-icons/fa6";

// UI Components
import SearchToolbar from "@/components/search/SearchToolbar";
import SearchSidebar from "@/components/search/SearchSidebar";
import SearchGrid from "@/components/search/SearchGrid";
import SearchEmptyState from "@/components/search/SearchEmptyState";
import SearchPagination from "@/components/search/SearchPagination";

export default function ProductsCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Query Parameters
  const searchQuery = searchParams.get("search") || searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;
  const sort = searchParams.get("sort") || "newest";
  const categoryParam = searchParams.get("category") || "";
  const brandParam = searchParams.get("brand") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const inStockParam = searchParams.get("inStock") === "true";
  const onSaleParam = searchParams.get("onSale") === "true";

  // Controlled states for inline inputs
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  const queryParams = {
    search: searchQuery,
    page,
    limit,
    sort,
    category: categoryParam,
    brand: brandParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    inStock: inStockParam || undefined,
    onSale: onSaleParam || undefined,
  };

  // Queries
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["catalogProducts", queryParams],
    queryFn: searchProducts,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["allCategories"],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 10,
  });

  const { data: brandsData } = useQuery({
    queryKey: ["allBrands"],
    queryFn: getAllBrands,
    staleTime: 1000 * 60 * 10,
  });

  const products = data?.products || [];
  const totalProducts = data?.totalProducts || 0;
  const totalPages = data?.totalPages || 1;
  const categories = categoriesData?.categories || [];
  const brands = brandsData?.brands || [];

  // Helper to update query string parameters
  const updateParams = (updates) => {
    const nextQuery = createQueryString(searchParams, updates);
    router.push(`?${nextQuery}`, { scroll: false });
  };

  // Handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({
      search: localSearch.trim() || undefined,
      q: localSearch.trim() || undefined,
      page: 1,
    });
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    updateParams({
      minPrice: minPrice.trim() || undefined,
      maxPrice: maxPrice.trim() || undefined,
      page: 1,
    });
  };

  const clearAllFilters = () => {
    setLocalSearch("");
    setMinPrice("");
    setMaxPrice("");
    router.push("/products");
  };

  const hasActiveFilters = Boolean(
    categoryParam ||
      brandParam ||
      minPriceParam ||
      maxPriceParam ||
      inStockParam ||
      onSaleParam ||
      searchQuery
  );

  // Active Category Name
  const selectedCategoryObj = categories.find(
    (c) => c.slug === categoryParam || c.name === categoryParam
  );
  const activeCategoryTitle = selectedCategoryObj?.name || categoryParam;

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Breadcrumb Navigation */}
      <nav className="breadcrumbs text-xs text-base-content/60">
        <ul>
          <li>
            <Link href="/" className="hover:text-main flex items-center gap-1">
              <LuHouse className="size-3.5" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/products"
              className={activeCategoryTitle ? "hover:text-main" : "font-semibold text-base-content"}
            >
              All Products
            </Link>
          </li>
          {activeCategoryTitle && (
            <li className="font-semibold text-base-content capitalize">
              {activeCategoryTitle}
            </li>
          )}
        </ul>
      </nav>

      {/* 2. Hero / Header Banner with Quick Search */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-main text-white p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
              <FaPaw className="size-3" />
              <span>PrettyPet Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              {activeCategoryTitle ? (
                <span className="capitalize">{activeCategoryTitle} Collection</span>
              ) : searchQuery ? (
                <span>
                  Results for <span className="text-emerald-300">&quot;{searchQuery}&quot;</span>
                </span>
              ) : (
                "All Pet Supplies & Essentials"
              )}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Explore our wide assortment of high-grade pet food, cozy beds, engaging toys, and grooming gear crafted with love for cats and dogs.
            </p>
          </div>

          {/* Inline Search Bar */}
          <div className="w-full lg:max-w-md">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search dog food, cat toys, collars..."
                className="w-full h-11 pl-10 pr-24 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:bg-white focus:text-zinc-900 focus:outline-0 text-xs sm:text-sm backdrop-blur-xs transition-all"
              />
              <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/70 pointer-events-none" />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setLocalSearch("");
                    updateParams({ search: undefined, q: undefined, page: 1 });
                  }}
                  className="absolute right-20 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                  title="Clear search"
                >
                  <LuX className="size-4" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 btn btn-xs sm:btn-sm btn-main rounded-xl px-3"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Quick Category Filter Pills */}
        {categories.length > 0 && (
          <div className="mt-6 pt-5 border-t border-white/15 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => updateParams({ category: undefined, page: 1 })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                !categoryParam
                  ? "bg-white text-main shadow-sm font-bold"
                  : "bg-white/10 text-white/90 hover:bg-white/20"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => {
              const isSelected = categoryParam === cat.slug || categoryParam === cat.name;
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    isSelected
                      ? "bg-white text-main shadow-sm font-bold"
                      : "bg-white/10 text-white/90 hover:bg-white/20"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Active Filters Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-base-100 rounded-2xl border border-base-200">
          <span className="text-xs font-semibold text-base-content/60 mr-1 flex items-center gap-1">
            <LuSparkles className="size-3 text-main" /> Active Filters:
          </span>

          {searchQuery && (
            <span className="badge badge-sm badge-outline gap-1.5 text-xs py-2.5">
              Search: &quot;{searchQuery}&quot;
              <button
                type="button"
                onClick={() => {
                  setLocalSearch("");
                  updateParams({ search: undefined, q: undefined, page: 1 });
                }}
                className="hover:text-error"
              >
                <LuX className="size-3" />
              </button>
            </span>
          )}

          {categoryParam && (
            <span className="badge badge-sm badge-outline gap-1.5 text-xs py-2.5 capitalize">
              Category: {activeCategoryTitle}
              <button
                type="button"
                onClick={() => updateParams({ category: undefined, page: 1 })}
                className="hover:text-error"
              >
                <LuX className="size-3" />
              </button>
            </span>
          )}

          {brandParam && (
            <span className="badge badge-sm badge-outline gap-1.5 text-xs py-2.5">
              Brand: {brandParam}
              <button
                type="button"
                onClick={() => updateParams({ brand: undefined, page: 1 })}
                className="hover:text-error"
              >
                <LuX className="size-3" />
              </button>
            </span>
          )}

          {(minPriceParam || maxPriceParam) && (
            <span className="badge badge-sm badge-outline gap-1.5 text-xs py-2.5">
              Price: ${minPriceParam || "0"} - ${maxPriceParam || "∞"}
              <button
                type="button"
                onClick={() => {
                  setMinPrice("");
                  setMaxPrice("");
                  updateParams({ minPrice: undefined, maxPrice: undefined, page: 1 });
                }}
                className="hover:text-error"
              >
                <LuX className="size-3" />
              </button>
            </span>
          )}

          {inStockParam && (
            <span className="badge badge-sm badge-outline gap-1.5 text-xs py-2.5">
              In Stock Only
              <button
                type="button"
                onClick={() => updateParams({ inStock: undefined, page: 1 })}
                className="hover:text-error"
              >
                <LuX className="size-3" />
              </button>
            </span>
          )}

          {onSaleParam && (
            <span className="badge badge-sm badge-outline gap-1.5 text-xs py-2.5">
              On Sale Only
              <button
                type="button"
                onClick={() => updateParams({ onSale: undefined, page: 1 })}
                className="hover:text-error"
              >
                <LuX className="size-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-error hover:underline flex items-center gap-1 ml-auto font-medium"
          >
            <LuRotateCcw className="size-3" /> Clear All
          </button>
        </div>
      )}

      {/* 4. Main Drawer / Layout with Sidebar and Grid */}
      <div className="drawer lg:drawer-open lg:gap-6 items-start">
        <input
          id="search-filter-drawer"
          type="checkbox"
          className="drawer-toggle"
        />

        {/* Content Section: Toolbar + Products Grid + Pagination */}
        <div className="drawer-content flex flex-col flex-1 min-w-0">
          <SearchToolbar
            productsCount={products.length}
            totalProducts={totalProducts}
            isFetching={isFetching}
            hasActiveFilters={hasActiveFilters}
            sort={sort}
            updateParams={updateParams}
          />

          {!isLoading && products.length === 0 ? (
            <SearchEmptyState
              searchQuery={searchQuery}
              setLocalSearch={setLocalSearch}
              updateParams={updateParams}
              clearAllFilters={clearAllFilters}
            />
          ) : (
            <SearchGrid isLoading={isLoading} products={products} />
          )}

          <SearchPagination
            page={page}
            totalPages={totalPages}
            updateParams={updateParams}
          />
        </div>

        {/* 5. Filter Sidebar */}
        <SearchSidebar
          categories={categories}
          categoryParam={categoryParam}
          brands={brands}
          brandParam={brandParam}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          handlePriceApply={handlePriceApply}
          inStockParam={inStockParam}
          onSaleParam={onSaleParam}
          updateParams={updateParams}
          clearAllFilters={clearAllFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
    </div>
  );
}
