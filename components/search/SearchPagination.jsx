"use client";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const SearchPagination = ({ page, totalPages, updateParams }) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8 pb-10">
      {/* Previous Page */}
      <button
        disabled={page <= 1}
        onClick={() => updateParams({ page: page - 1 })}
        className="btn btn-sm btn-outline rounded-xl disabled:opacity-40"
        aria-label="Previous Page"
      >
        <LuChevronLeft className="size-4" /> Previous
      </button>

      {/* Page Numbers */}
      <div className="join">
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            Math.abs(pageNum - page) <= 1
          ) {
            return (
              <button
                key={pageNum}
                onClick={() => updateParams({ page: pageNum })}
                className={`join-item btn btn-sm rounded-lg ${
                  page === pageNum ? "btn-main font-bold" : "btn-ghost"
                }`}
              >
                {pageNum}
              </button>
            );
          } else if (pageNum === page - 2 || pageNum === page + 2) {
            return (
              <button
                key={pageNum}
                disabled
                className="join-item btn btn-sm btn-disabled"
              >
                ...
              </button>
            );
          }
          return null;
        })}
      </div>

      {/* Next Page */}
      <button
        disabled={page >= totalPages}
        onClick={() => updateParams({ page: page + 1 })}
        className="btn btn-sm btn-outline rounded-xl disabled:opacity-40"
        aria-label="Next Page"
      >
        Next <LuChevronRight className="size-4" />
      </button>
    </div>
  );
};

export default SearchPagination;
