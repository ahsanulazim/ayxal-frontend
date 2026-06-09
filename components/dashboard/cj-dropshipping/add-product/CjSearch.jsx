"use client";

import api from "@/axios/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { toast } from "react-toastify";

const CjSearch = ({ setProducts }) => {
  const [keyword, setKeyword] = useState("");

  const { refetch } = useQuery({
    queryKey: ["searchProducts", keyword],
    queryFn: async () => {
      const res = await api.get(`/products/cj/search?keyword=${keyword}`);
      return res.data.products;
    },
    enabled: false,
    onSuccess: (data) => setProducts(data),
    onError: (err) =>
      toast.error("❌ Error searching products: " + err.message),
  });

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
        <button className="btn btn-main join-item" onClick={() => refetch()}>
          Search
        </button>
      </div>
    </div>
  );
};

export default CjSearch;
