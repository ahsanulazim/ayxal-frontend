"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts } from "@/api/productApi";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import ProductMetrics from "@/components/dashboard/products-v2/ProductMetrics";
import ProductToolbar from "@/components/dashboard/products-v2/ProductToolbar";
import ProductTableV2 from "@/components/dashboard/products-v2/ProductTableV2";
import ProductGridView from "@/components/dashboard/products-v2/ProductGridView";
import ProductBulkBar from "@/components/dashboard/products-v2/ProductBulkBar";
import ProductDeleteModalV2 from "@/components/dashboard/products-v2/ProductDeleteModalV2";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const ProductsContentV2 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // URL query params
  const searchParam = searchParams.get("search") || "";
  const pageParam = Number(searchParams.get("page")) || 1;
  const limitParam = Number(searchParams.get("limit")) || 10;
  const tabParam = searchParams.get("tab") || "all";
  const categoryParam = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "newest";

  // Local state
  const [searchValue, setSearchValue] = useState(searchParam);
  const [viewMode, setViewMode] = useState("table");
  const [selectedIds, setSelectedIds] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);
  const [bulkIdsToDelete, setBulkIdsToDelete] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const deleteModalRef = useRef(null);

  // Fetch products
  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["products", pageParam, searchParam, limitParam],
    queryFn: getAllProducts,
  });

  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);
  if (prevSearchParam !== searchParam) {
    setPrevSearchParam(searchParam);
    setSearchValue(searchParam);
  }

  // Debounce search update to URL
  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    const trimmed = searchValue.trim();

    // If search hasn't changed from URL, do nothing to prevent infinite loops
    if (trimmed === currentSearch.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) {
        params.set("search", trimmed);
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      const nextQuery = params.toString();
      if (nextQuery !== searchParams.toString()) {
        router.replace(`?${nextQuery}`, { scroll: false });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchValue, router, searchParams]);

  // Param update helpers
  const updateUrlParam = (key, value, resetPage = true) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (resetPage) {
      params.set("page", "1");
    }
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (newPage) => {
    updateUrlParam("page", String(newPage), false);
    setSelectedIds([]);
  };

  const handleLimitChange = (newLimit) => {
    updateUrlParam("limit", String(newLimit), true);
    setSelectedIds([]);
  };

  const handleTabChange = (newTab) => {
    updateUrlParam("tab", newTab === "all" ? "" : newTab, true);
  };

  const handleCategoryChange = (cat) => {
    updateUrlParam("category", cat, true);
  };

  const handleSortChange = (newSort) => {
    updateUrlParam("sort", newSort === "newest" ? "" : newSort, false);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setSelectedIds([]);
    router.push("/dashboard/products");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["products"] });
    await refetch();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  // Filter & sort products on client side for responsive instant filtering
  const rawProducts = useMemo(
    () => productsData?.products || [],
    [productsData?.products],
  );
  const totalProducts = productsData?.totalProducts || rawProducts.length;
  const totalPages =
    productsData?.totalPages || Math.ceil(totalProducts / limitParam) || 1;

  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    // Status tabs filtering
    if (tabParam === "in-stock") {
      list = list.filter((p) => {
        const stock =
          typeof p.stock === "number" ? p.stock : parseInt(p.stock, 10);
        return !isNaN(stock) && stock > 0;
      });
    } else if (tabParam === "low-stock") {
      list = list.filter((p) => {
        const stock =
          typeof p.stock === "number" ? p.stock : parseInt(p.stock, 10);
        return !isNaN(stock) && stock > 0 && stock <= 5;
      });
    } else if (tabParam === "out-of-stock") {
      list = list.filter((p) => {
        const stock =
          typeof p.stock === "number" ? p.stock : parseInt(p.stock, 10);
        return isNaN(stock) || stock <= 0;
      });
    } else if (tabParam === "variable") {
      list = list.filter((p) => !!p.hasVariations);
    } else if (tabParam === "single") {
      list = list.filter((p) => !p.hasVariations);
    }

    // Category filtering
    if (categoryParam) {
      list = list.filter(
        (p) =>
          p.category &&
          p.category.toLowerCase().includes(categoryParam.toLowerCase()),
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortParam === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (sortParam === "title-asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortParam === "title-desc") {
        return (b.title || "").localeCompare(a.title || "");
      }
      if (sortParam === "price-asc") {
        const pA = parseFloat(String(a.price).split("-")[0]) || 0;
        const pB = parseFloat(String(b.price).split("-")[0]) || 0;
        return pA - pB;
      }
      if (sortParam === "price-desc") {
        const pA = parseFloat(String(a.price).split("-")[0]) || 0;
        const pB = parseFloat(String(b.price).split("-")[0]) || 0;
        return pB - pA;
      }
      if (sortParam === "stock-asc") {
        const sA = parseInt(a.stock, 10) || 0;
        const sB = parseInt(b.stock, 10) || 0;
        return sA - sB;
      }
      // default: newest
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return list;
  }, [rawProducts, tabParam, categoryParam, sortParam]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (
      selectedIds.length === filteredProducts.length &&
      filteredProducts.length > 0
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map((p) => p._id));
    }
  };

  const handleToggleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Delete modal handlers
  const handleOpenSingleDelete = (product) => {
    setProductToDelete(product);
    setBulkIdsToDelete([]);
    deleteModalRef.current?.showModal();
  };

  const handleOpenBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setProductToDelete(null);
    setBulkIdsToDelete(selectedIds);
    deleteModalRef.current?.showModal();
  };

  // CSV Export
  const handleExportCSV = (targetProducts = filteredProducts) => {
    if (!targetProducts || targetProducts.length === 0) return;

    const headers = [
      "ID",
      "Title",
      "Category",
      "Price",
      "Stock",
      "Has Variations",
      "Created At",
      "Updated At",
    ];

    const rows = targetProducts.map((p) => [
      `"${p._id}"`,
      `"${(p.title || "").replace(/"/g, '""')}"`,
      `"${p.category || ""}"`,
      `"${p.price || 0}"`,
      `"${p.stock || 0}"`,
      p.hasVariations ? "Yes" : "No",
      `"${p.createdAt || ""}"`,
      `"${p.updatedAt || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `products_catalog_${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSelectedCSV = () => {
    const selectedItems = filteredProducts.filter((p) =>
      selectedIds.includes(p._id),
    );
    handleExportCSV(selectedItems);
  };

  return (
    <div className="pb-24">
      {/* Top Breadcrumb & V1/V2 Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <Breadcrumbs title="Products" />
      </div>

      {/* 1. KPI Summary Cards */}
      <ProductMetrics
        products={rawProducts}
        totalProducts={totalProducts}
        isLoading={isLoading}
      />

      {/* 2. Control Toolbar */}
      <ProductToolbar
        activeTab={tabParam}
        onTabChange={handleTabChange}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onClearSearch={handleClearSearch}
        selectedCategory={categoryParam}
        onCategoryChange={handleCategoryChange}
        sortBy={sortParam}
        onSortChange={handleSortChange}
        limit={limitParam}
        onLimitChange={handleLimitChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExportCSV={() => handleExportCSV(filteredProducts)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        totalProductsCount={totalProducts}
      />

      {/* 3. Main Catalog View (Table or Grid) */}
      {viewMode === "table" ? (
        <ProductTableV2
          products={filteredProducts}
          isLoading={isLoading}
          isError={isError}
          selectedIds={selectedIds}
          onToggleSelectAll={handleToggleSelectAll}
          onToggleSelectRow={handleToggleSelectRow}
          onOpenDeleteModal={handleOpenSingleDelete}
          onResetFilters={handleResetFilters}
        />
      ) : (
        <ProductGridView
          products={filteredProducts}
          isLoading={isLoading}
          isError={isError}
          selectedIds={selectedIds}
          onToggleSelectRow={handleToggleSelectRow}
          onOpenDeleteModal={handleOpenSingleDelete}
          onResetFilters={handleResetFilters}
        />
      )}

      {/* 4. Pagination Footer */}
      {!isLoading && !isError && totalProducts > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1">
          <div className="text-xs text-base-content/60">
            Showing{" "}
            <span className="font-semibold text-base-content">
              {Math.min((pageParam - 1) * limitParam + 1, totalProducts)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-base-content">
              {Math.min(pageParam * limitParam, totalProducts)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-base-content">
              {totalProducts}
            </span>{" "}
            products
          </div>

          {totalPages > 1 && (
            <div className="join border border-base-content/10 shadow-2xs rounded-xl bg-base-100">
              <button
                type="button"
                disabled={pageParam <= 1}
                onClick={() => handlePageChange(pageParam - 1)}
                className="join-item btn btn-sm btn-ghost gap-1"
              >
                <LuChevronLeft className="size-4" />
                <span className="hidden sm:inline text-xs">Prev</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= pageParam - 1 && p <= pageParam + 1),
                )
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  return (
                    <Fragment key={p}>
                      {prev && p - prev > 1 && (
                        <button
                          type="button"
                          className="join-item btn btn-sm btn-disabled"
                          disabled
                        >
                          ...
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handlePageChange(p)}
                        className={`join-item btn btn-sm ${
                          pageParam === p
                            ? "btn-main font-bold"
                            : "btn-ghost font-normal"
                        }`}
                      >
                        {p}
                      </button>
                    </Fragment>
                  );
                })}

              <button
                type="button"
                disabled={pageParam >= totalPages}
                onClick={() => handlePageChange(pageParam + 1)}
                className="join-item btn btn-sm btn-ghost gap-1"
              >
                <span className="hidden sm:inline text-xs">Next</span>
                <LuChevronRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Floating Bulk Selection Bar */}
      <ProductBulkBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBulkDelete={handleOpenBulkDelete}
        onExportSelected={handleExportSelectedCSV}
      />

      {/* 6. Delete Confirmation Modal */}
      <ProductDeleteModalV2
        modalRef={deleteModalRef}
        productToDelete={productToDelete}
        bulkIdsToDelete={bulkIdsToDelete}
        onDeleted={() => setSelectedIds([])}
      />
    </div>
  );
};

const ProductsPageV2 = () => {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <span className="loading loading-spinner loading-lg text-main"></span>
        </div>
      }
    >
      <ProductsContentV2 />
    </Suspense>
  );
};

export default ProductsPageV2;
