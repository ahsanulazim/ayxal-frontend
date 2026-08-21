"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createQueryString } from "./utils/updateSearchParams";
import { LuFilter } from "react-icons/lu";

const ProductToolbar = ({ total = 0, isFetching }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "newest";

  const handleSort = (value) => {
    const query = createQueryString(searchParams, {
      sort: value,
      page: 1,
    });

    router.push(`?${query}`, {
      scroll: false,
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-box border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4 items-center">
        <div className="lg:hidden">
          <label
            htmlFor="filter"
            aria-label="open sidebar"
            className="btn btn-square drawer-button"
          >
            <LuFilter className="inline-block stroke-current" />
          </label>
        </div>
        <div>
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{total}</span>{" "}
            Products found
            {isFetching && (
              <span className="ml-2 text-xs text-gray-400">Updating...</span>
            )}
          </p>
        </div>
      </div>

      {/* Sort */}
      <select
        value={currentSort}
        onChange={(e) => handleSort(e.target.value)}
        className="select max-w-50"
      >
        <option value="newest">Newest</option>

        <option value="price_asc">Price: Low to High</option>

        <option value="price_desc">Price: High to Low</option>

        <option value="name_asc">Name: A - Z</option>

        <option value="name_desc">Name: Z - A</option>
      </select>
    </div>
  );
};

export default ProductToolbar;
