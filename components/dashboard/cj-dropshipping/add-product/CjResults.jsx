import React from "react";
import CjProductCard from "./CjProductCard";

const CjResults = ({
  products,
  isFetching,
  isError,
  router,
  keyword,
  page,
  size,
}) => {
  const productList = products?.products?.content?.[0]?.productList ?? [];
  const totalPages = products?.products?.totalPages ?? 0;

  // keyword সহ URL navigate করার helper
  const goToPage = (p) => {
    router.push(
      `?keyword=${encodeURIComponent(keyword)}&page=${p}&size=${size}`,
    );
  };

  return (
    <>
      {!keyword ? (
        <div className="text-center mt-10 text-gray-500">
          Please search for products
        </div>
      ) : isFetching ? (
        <section>
          <div className="">
            <h1 className="font-bold text-xl mb-3">Search Results</h1>
          </div>
          <div>Loading...</div>
        </section>
      ) : isError ? (
        <div>Something went wrong</div>
      ) : productList.length > 0 ? (
        <section>
          <div className="">
            <h1 className="font-bold text-xl mb-3">Search Results</h1>
          </div>

          <div className="grid grid-cols-6 @[112rem]:grid-cols-8 gap-2">
            {productList.map((product) => (
              <CjProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="join mt-5 flex-wrap">
              <button
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                className="join-item btn"
              >
                «
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
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
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className="join-item btn"
              >
                »
              </button>
            </div>
          )}
        </section>
      ) : keyword ? (
        <div>No results found</div>
      ) : null}
    </>
  );
};

export default CjResults;
