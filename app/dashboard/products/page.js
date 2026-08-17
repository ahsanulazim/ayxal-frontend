"use client";

import { getAllProducts } from "@/api/productApi";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import ProductData from "@/components/dashboard/products/ProductData";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuPlus, LuSearch } from "react-icons/lu";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products", page, search, limit],
    queryFn: getAllProducts,
  });

  const [searchValue, setSearchValue] = useState(search);

  // Search debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      } else {
        params.delete("search");
      }

      // New search হলে page 1 থেকে শুরু
      params.set("page", "1");

      router.replace(`?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const goToPage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", newPage.toString());

    router.push(`?${params.toString()}`);
  };

  return (
    <>
      <Breadcrumbs title="Products" />
      <section className="mb-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-2xl w-1/2">Products</h2>
          <div className="flex items-center gap-5 w-1/2">
            <label className="input rounded-full w-full">
              <input
                type="search"
                placeholder="Search products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <LuSearch className="h-[1em] opacity-50" />
            </label>
            <select defaultValue="filter" className="select">
              <option value="filter" disabled={true}>
                Filter
              </option>
              <option>Out of Stock</option>
              <option>New Items</option>
              <option>Featured</option>
            </select>
            <Link
              href="/dashboard/products/add-product"
              className="btn btn-main"
            >
              <LuPlus /> Add Products
            </Link>
          </div>
        </div>
      </section>
      <section>
        <ProductData
          products={products}
          productsLoading={productsLoading}
          productsError={productsError}
        />
      </section>
      <section>
        {productsLoading ? (
          <span>Loading...</span>
        ) : productsError ? (
          <span>Error</span>
        ) : (
          products.products?.length > 0 &&
          products.totalPages > 1 && (
            <div className="join mt-5 flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                className="join-item btn"
              >
                «
              </button>
              {Array.from({ length: products?.totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === products?.totalPages ||
                    (p >= page - 2 && p <= page + 2),
                )
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  return (
                    <React.Fragment key={p}>
                      {prev && p - prev > 1 && (
                        <button className="join-item btn btn-disabled" disabled>
                          ...
                        </button>
                      )}
                      <button
                        className={`join-item btn ${Number(page) === p ? "btn-main" : ""}`}
                        disabled={Number(page) === p}
                        onClick={() => goToPage(p)}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
              <button
                disabled={page >= products?.totalPages}
                onClick={() => goToPage(page + 1)}
                className="join-item btn"
              >
                »
              </button>
            </div>
          )
        )}
      </section>
    </>
  );
};

export default page;
