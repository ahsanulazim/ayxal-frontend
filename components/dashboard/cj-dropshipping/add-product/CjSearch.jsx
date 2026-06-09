"use client";

import { searchCjProducts } from "@/api/shippingApi";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { toast } from "react-toastify";

const CjSearch = ({ setProducts }) => {
  const [keyword, setKeyword] = useState("");

  const { refetch, isFetching } = useQuery({
    queryKey: ["searchProducts", keyword],
    queryFn: searchCjProducts,
    enabled: false, // Disable automatic query on mount
    onError: (err) =>
      toast.error("❌ Error searching products: " + err.message),
  });

  const handleSearch = async () => {
    if (!keyword.trim()) {
      toast.error("Please enter a search keyword.");
      return;
    }
    const result = await refetch();
    if (result.data) {
      setProducts(result.data);
    }
  };

  return (
    <div className="text-center">
      <h1 className="font-bold text-xl mb-3">Search in CJ</h1>
      <div className="join max-w-250 mx-auto w-full">
        <label className="input flex-1 join-item focus:outline-none focus-within:outline-none">
          <LuSearch className="h-[1em] opacity-50" />
          <input
            type="search"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
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
  );
};

export default CjSearch;
