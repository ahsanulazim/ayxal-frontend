"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { LuHistory, LuSearch, LuX, LuArrowRight, LuSparkles } from "react-icons/lu";
import { getQuickSearchSuggestions } from "@/api/productApi";

const POPULAR_SEARCHES = ["Dog Food", "Cat Bed", "Collar", "Pet Toys", "Grooming", "Carrier"];

const Search = ({ isMobile = false, onCloseMobile }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // Lazy initializer for recent searches to avoid setState in effect
  const [recentSearches, setRecentSearches] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("pretypet_recent_searches");
        if (stored) {
          return JSON.parse(stored).slice(0, 6);
        }
      } catch (e) {
        console.error("Failed to read recent searches:", e);
      }
    }
    return [];
  });

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await getQuickSearchSuggestions(trimmed);
        setSuggestions(res?.products || []);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Save to recent searches
  const saveRecentSearch = (term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const filtered = recentSearches.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      const updated = [trimmed, ...filtered].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem("pretypet_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save recent search:", e);
    }
  };

  const removeRecentSearch = (e, termToRemove) => {
    e.stopPropagation();
    try {
      const updated = recentSearches.filter((item) => item !== termToRemove);
      setRecentSearches(updated);
      localStorage.setItem("pretypet_recent_searches", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to remove recent search:", e);
    }
  };

  const clearAllRecent = (e) => {
    e.stopPropagation();
    try {
      setRecentSearches([]);
      localStorage.removeItem("pretypet_recent_searches");
    } catch (e) {
      console.error("Failed to clear recent searches:", e);
    }
  };

  // Perform search navigation
  const executeSearch = (searchTerm) => {
    const term = (searchTerm !== undefined ? searchTerm : query).trim();
    if (!term) return;

    saveRecentSearch(term);
    setIsOpen(false);
    if (onCloseMobile) onCloseMobile();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`flex flex-col relative ${isMobile ? "w-full" : "w-full max-w-xl"}`}>
      {/* Search Input Form */}
      <form onSubmit={handleFormSubmit} className="relative w-full">
        <label
          className={`flex items-center w-full gap-3 border transition-all duration-200 ${
            isOpen ? "border-main ring-2 ring-main/15 shadow-sm" : "border-base-300 hover:border-main/50"
          } rounded-full bg-base-100 p-1.5 pl-4`}
        >
          <LuSearch className="size-4 text-base-content/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              if (val.trim().length < 2) {
                setSuggestions([]);
              }
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search dog food, cat trees, toys..."
            className="w-full text-xs sm:text-sm bg-transparent outline-hidden text-base-content placeholder:text-base-content/40"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSuggestions([]);
                inputRef.current?.focus();
              }}
              className="btn btn-circle btn-ghost btn-xs text-base-content/50 hover:text-base-content"
              aria-label="Clear search input"
            >
              <LuX className="size-3.5" />
            </button>
          )}

          {/* Submit Search Button */}
          <button
            type="submit"
            className="btn btn-main btn-sm rounded-full px-4 text-xs font-semibold shadow-xs shrink-0"
          >
            Search
          </button>
        </label>
      </form>

      {/* Dropdown Results / Autocomplete */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-base-100 rounded-2xl shadow-xl border border-base-200/80 overflow-hidden z-50 text-xs sm:text-sm">
          {/* 1. Live Product Suggestions */}
          {query.trim().length >= 2 ? (
            <div className="p-3">
              <div className="flex items-center justify-between pb-2 px-1 text-[11px] font-semibold text-base-content/50 uppercase tracking-wider">
                <span>Matching Products</span>
                {isLoading && <span className="loading loading-spinner loading-xs text-main"></span>}
              </div>

              {isLoading && suggestions.length === 0 ? (
                <div className="space-y-2 py-2">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-3 p-2 rounded-xl animate-pulse">
                      <div className="size-11 bg-base-200 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-base-200 rounded-sm w-3/4" />
                        <div className="h-2.5 bg-base-200 rounded-sm w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-1">
                  {suggestions.map((product) => {
                    const categorySlug = product.categorySlug || product.category || "all";
                    const productSlug = product.slug || product._id;
                    const price =
                      product.price ||
                      (product.hasVariations && product.variations?.[0]?.price) ||
                      product.basePrice ||
                      "0.00";
                    const img =
                      product.thumbnail?.url ||
                      product.thumbnail ||
                      (Array.isArray(product.images) && product.images[0]?.url) ||
                      "/default-product.jpg";

                    return (
                      <Link
                        key={product._id || product.slug}
                        href={`/products/${categorySlug}/${productSlug}`}
                        onClick={() => {
                          saveRecentSearch(product.title);
                          setIsOpen(false);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-200/60 transition-colors group"
                      >
                        <div className="size-11 rounded-lg bg-base-200 overflow-hidden shrink-0 border border-base-200">
                          <img
                            src={img}
                            alt={product.title}
                            className="size-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-base-content truncate group-hover:text-main">
                            {product.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {product.category && (
                              <span className="text-[10px] text-base-content/50 uppercase">
                                {product.category}
                              </span>
                            )}
                            <span className="text-xs font-bold text-main">
                              ${price}
                            </span>
                          </div>
                        </div>
                        <LuArrowRight className="size-3.5 text-base-content/30 group-hover:text-main group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                !isLoading && (
                  <div className="p-4 text-center text-xs text-base-content/60">
                    No products directly matching &quot;{query}&quot;. Press Enter to browse full catalog.
                  </div>
                )
              )}

              {/* View All Results Button */}
              <div className="pt-2 mt-2 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => executeSearch()}
                  className="w-full text-center py-2 px-3 rounded-xl bg-main/10 hover:bg-main text-main hover:text-white transition-colors font-medium text-xs flex items-center justify-center gap-1.5"
                >
                  <LuSearch className="size-3.5" />
                  View all results for &quot;{query}&quot;
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-4">
              {/* 2. Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between pb-2 px-1 text-[11px] font-semibold text-base-content/50 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <LuHistory className="size-3.5" /> Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearAllRecent}
                      className="text-[10px] hover:underline hover:text-error normal-case"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((term, index) => (
                      <span
                        key={index}
                        onClick={() => {
                          setQuery(term);
                          executeSearch(term);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-base-200/80 hover:bg-main/15 hover:text-main text-xs text-base-content cursor-pointer transition-colors"
                      >
                        <LuSearch className="size-3 opacity-50" />
                        <span>{term}</span>
                        <button
                          type="button"
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="hover:text-error rounded-full p-0.5 ml-0.5"
                          aria-label="Remove"
                        >
                          <LuX className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Popular Suggestions */}
              <div>
                <div className="flex items-center gap-1.5 pb-2 px-1 text-[11px] font-semibold text-base-content/50 uppercase tracking-wider">
                  <LuSparkles className="size-3.5 text-amber-500" /> Popular Searches
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEARCHES.map((term, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setQuery(term);
                        executeSearch(term);
                      }}
                      className="px-3 py-1.5 rounded-full bg-base-200 hover:bg-main hover:text-white text-xs text-base-content transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
