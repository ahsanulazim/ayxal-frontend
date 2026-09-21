"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchProducts } from "@/api/productApi";
import { getAllCategories } from "@/api/categoryApi";
import { getAllBrands } from "@/api/brandApi";
import { createQueryString } from "@/components/shop/utils/updateSearchParams";

// Modular Search Components
import SearchHeader from "@/components/search/SearchHeader";
import SearchToolbar from "@/components/search/SearchToolbar";
import SearchSidebar from "@/components/search/SearchSidebar";
import SearchGrid from "@/components/search/SearchGrid";
import SearchEmptyState from "@/components/search/SearchEmptyState";
import SearchPagination from "@/components/search/SearchPagination";

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Search & Filter Query Parameters
  const searchQuery = searchParams.get("q") || searchParams.get("search") || "";
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
    queryKey: ["searchProducts", queryParams],
    queryFn: searchProducts,
    placeholderData: keepPreviousData,
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

  // Actions
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({
      q: localSearch.trim(),
      search: localSearch.trim(),
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
    setMinPrice("");
    setMaxPrice("");
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    router.push(params.toString() ? `?${params.toString()}` : "?");
  };

  const hasActiveFilters = Boolean(
    categoryParam ||
      brandParam ||
      minPriceParam ||
      maxPriceParam ||
      inStockParam ||
      onSaleParam
  );

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Header & Active Filter Badges */}
      <SearchHeader
        searchQuery={searchQuery}
        totalProducts={totalProducts}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        localSearch={localSearch}
        setLocalSearch={setLocalSearch}
        handleSearchSubmit={handleSearchSubmit}
        categoryParam={categoryParam}
        brandParam={brandParam}
        minPriceParam={minPriceParam}
        maxPriceParam={maxPriceParam}
        inStockParam={inStockParam}
        onSaleParam={onSaleParam}
        updateParams={updateParams}
        clearAllFilters={clearAllFilters}
      />

      {/* 2. Main Filter Drawer & Content */}
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

        {/* 3. Filter Sidebar */}
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

function SearchPageWrapper() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || searchParams.get("search") || "";
  const min = searchParams.get("minPrice") || "";
  const max = searchParams.get("maxPrice") || "";
  return <SearchPageContent key={`${q}_${min}_${max}`} />;
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-360 mx-auto px-4 py-12 text-center">
          <span className="loading loading-spinner loading-lg text-main"></span>
        </div>
      }
    >
      <SearchPageWrapper />
    </Suspense>
  );
}
