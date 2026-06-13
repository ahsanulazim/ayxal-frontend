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
  const size = Number(searchParams.get("size")) || 24;

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
      <div className="text-center">
        <h1 className="font-bold text-xl mb-3">Search in CJ</h1>
        <div className="join max-w-250 mx-auto w-full">
          <label className="input flex-1 join-item focus:outline-none focus-within:outline-none">
            <LuSearch className="h-[1em] opacity-50" />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              required
              placeholder="Search for products"
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
