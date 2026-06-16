"use client";

import { useQuery } from "@tanstack/react-query";
import { getCjStoreProducts } from "@/api/productApi";
import { useRouter, useSearchParams } from "next/navigation";
import { LuEye, LuTrash2, LuUpload } from "react-icons/lu";
import moment from "moment";
import React from "react";

const CjTable = () => {
  const router = useRouter();
  const params = useSearchParams();
  const page = Number(params.get("page")) || 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cjStoreProducts", page],
    queryFn: getCjStoreProducts,
  });

  const goToPage = (p) => {
    router.push(`?page=${p}`);
  };

  return (
    <>
      <div className="overflow-x-auto bg-base-100 rounded-md">
        <table className="table">
          {/* head */}
          <thead className="bg-base-200">
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Product</th>
              <th>Price</th>
              <th>Weight</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {isLoading ? (
              <tr>
                <td colSpan="4">loading...</td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan="4">Something went wrong</td>
              </tr>
            ) : data?.products?.length === 0 ? (
              <tr>
                <td colSpan="4">No products found</td>
              </tr>
            ) : (
              data?.products?.map((product) => (
                <tr key={product.pid}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td className="max-w-170">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={product.bigImage}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div className="">
                        <h3 className="font-bold line-clamp-2">
                          {product.productNameEn}
                        </h3>
                        <div className="text-sm opacity-50">
                          {product.categoryName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>${product.sellPrice}</td>
                  <td>{product.packingWeight}g</td>
                  <td>{moment(product.createdAt).format("MMMM Do, YYYY")}</td>
                  <th>
                    <div className="flex items-center gap-2">
                      <button className="btn btn-circle btn-info">
                        <LuEye />
                      </button>
                      <button className="btn btn-success btn-circle">
                        <LuUpload />
                      </button>
                      <button className="btn btn-circle btn-error">
                        <LuTrash2 />
                      </button>
                    </div>
                  </th>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {data?.totalPages > 1 && (
        <div className="join mt-5 flex-wrap">
          <button
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            className="join-item btn"
          >
            «
          </button>
          {Array.from({ length: data?.totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === data?.totalPages ||
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
            disabled={page >= data?.totalPages}
            onClick={() => goToPage(page + 1)}
            className="join-item btn"
          >
            »
          </button>
        </div>
      )}
    </>
  );
};

export default CjTable;
