"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createQueryString } from "./utils/updateSearchParams";
import { LuRotateCcw } from "react-icons/lu";

const ProductFilter = ({ brands = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");

  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const currentBrand = searchParams.get("brand") || "";
  const inStock = searchParams.get("inStock") === "true";
  const onSale = searchParams.get("onSale") === "true";

  const updateFilter = (updates) => {
    const query = createQueryString(searchParams, {
      ...updates,
      page: 1,
    });

    router.push(`?${query}`, {
      scroll: false,
    });
  };

  const handlePrice = () => {
    updateFilter({
      minPrice,
      maxPrice,
    });
  };

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");

    const params = new URLSearchParams();

    const search = searchParams.get("search");
    const sort = searchParams.get("sort");

    if (search) {
      params.set("search", search);
    }

    if (sort) {
      params.set("sort", sort);
    }

    router.push(params.toString() ? `?${params.toString()}` : "?");
  };

  return (
    <div className="overflow-hidden rounded-box border border-gray-100 bg-white max-lg:min-h-full w-80">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="font-semibold text-gray-900">Filters</h2>

        <button
          onClick={resetFilters}
          className="btn btn-ghost btn-xs btn-error"
        >
          <LuRotateCcw size={14} />
          Reset
        </button>
      </div>

      {/* Price */}
      <div className="border-b border-gray-100 p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Price Range
        </h3>

        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min"
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
          />

          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max"
            className="h-10 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-gray-400"
          />
        </div>

        <button onClick={handlePrice} className="btn btn-main w-full mt-5">
          Apply
        </button>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div className="border-b border-gray-100 p-5">
          <h3 className="mb-4 text-sm font-semibold text-gray-900">Brand</h3>

          <div className="space-y-3">
            {brands.map((brand) => (
              <label
                key={brand.slug}
                className="flex cursor-pointer items-center gap-3 text-sm text-gray-600"
              >
                <input
                  type="radio"
                  name="brand"
                  checked={currentBrand === brand.slug}
                  onChange={() =>
                    updateFilter({
                      brand: brand.slug,
                    })
                  }
                  className="h-4 w-4"
                />

                <span>{brand.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="border-b border-gray-100 p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Availability
        </h3>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) =>
              updateFilter({
                inStock: e.target.checked ? "true" : "",
              })
            }
            className="h-4 w-4 rounded"
          />
          In stock only
        </label>
      </div>

      {/* Sale */}
      <div className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-gray-900">Offers</h3>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={onSale}
            onChange={(e) =>
              updateFilter({
                onSale: e.target.checked ? "true" : "",
              })
            }
            className="h-4 w-4 rounded"
          />
          On sale
        </label>
      </div>
    </div>
  );
};

export default ProductFilter;
