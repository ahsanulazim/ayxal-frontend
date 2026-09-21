"use client";

import { searchCjProducts } from "@/api/shippingApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { toast } from "react-toastify";
import CjResults from "./CjResults";
import { useRouter, useSearchParams } from "next/navigation";

const CjSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // keyword, page, size সব URL-এ রাখা হয়েছে
  const keyword = searchParams.get("keyword") || "";
  const page = Number(searchParams.get("page")) || 1;
  const size = 24;

  // Input state শুধু typing এর জন্য, URL keyword থেকে initialize
  const [inputValue, setInputValue] = useState(keyword);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["searchProducts", keyword, page, size],
    queryFn: searchCjProducts,
    // keyword থাকলে auto-fetch হবে — page/size পরিবর্তনেও
    enabled: !!keyword,
    staleTime: 5 * 60 * 1000,
    onError: (err) =>
      toast.error("❌ Error searching products: " + err.message),
  });

  const handleSearch = () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a search keyword.");
      return;
    }
    // keyword URL-এ সেট করো, page 1 থেকে শুরু
    router.push(
      `?keyword=${encodeURIComponent(inputValue.trim())}&page=1&size=${size}`,
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <>
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="font-bold text-2xl mb-1 text-base-content">Search CJ Dropshipping Catalog</h1>
        <p className="text-xs text-base-content/60 mb-4">
          Discover products directly from CJ suppliers. Shortlist them to your <strong>Import List</strong> to customize titles, images, and profit margins.
        </p>
        <div className="join max-w-2xl mx-auto w-full shadow-sm">
          <label className="input flex-1 join-item focus:outline-none focus-within:outline-none border-base-300">
            <LuSearch className="h-[1em] opacity-50" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              placeholder="Search by keywords (e.g. dog harness, cat feeder, pet brush)..."
            />
          </label>
          <button
            className={`btn ${isFetching ? "" : "btn-main"} join-item`}
            onClick={handleSearch}
            disabled={isFetching}
          >
            {isFetching ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
      <section className="@container">
        <CjResults
          products={data}
          isFetching={isFetching}
          isError={isError}
          router={router}
          searchParams={searchParams}
          keyword={keyword}
          page={page}
          size={size}
        />
      </section>
    </>
  );
};

export default CjSearch;
