"use client";

import { LuPackageOpen } from "react-icons/lu";

const SUGGESTIONS = ["Food", "Toys", "Collars", "Beds", "Grooming", "Supplements"];

const SearchEmptyState = ({
  searchQuery,
  setLocalSearch,
  updateParams,
  clearAllFilters,
}) => {
  return (
    <div className="bg-base-100 rounded-3xl p-10 sm:p-16 text-center border border-base-200 space-y-5 my-4">
      <div className="size-20 rounded-3xl bg-main/10 text-main flex items-center justify-center mx-auto shadow-inner">
        <LuPackageOpen className="size-10" />
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <h2 className="text-xl sm:text-2xl font-black text-base-content">
          No matching pet items found
        </h2>
        <p className="text-xs sm:text-sm text-base-content/60">
          {searchQuery ? (
            <>
              We couldn&apos;t find any products matching &quot;{searchQuery}&quot;.
              Try checking for typos or searching for a broader term.
            </>
          ) : (
            "No products matched your selected filters. Try broadening your criteria."
          )}
        </p>
      </div>

      {/* Suggestion Keywords */}
      <div className="pt-2">
        <p className="text-xs font-semibold text-base-content/70 mb-2 uppercase tracking-wider">
          Popular Suggestions
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
          {SUGGESTIONS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setLocalSearch(term);
                updateParams({ q: term, search: term, page: 1 });
              }}
              className="btn btn-xs btn-outline rounded-full text-xs font-medium hover:bg-main hover:text-white hover:border-main"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={clearAllFilters}
          className="btn btn-main btn-sm rounded-xl px-6"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
};

export default SearchEmptyState;
