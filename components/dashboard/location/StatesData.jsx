"use client";

import React from "react";
import { getStates } from "@/api/locationApi";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";

const StatesData = ({ slug }) => {
  const router = useRouter();
  const params = useSearchParams();
  const page = Number(params.get("page")) || 1;

  const { data, isPending, isError } = useQuery({
    queryKey: ["states", slug, page],
    queryFn: getStates,
  });

  const goToPage = (p) => {
    router.push(`?page=${p}`);
  };

  console.log(data);

  return (
    <div className="my-5">
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-base-200">
              <th></th>
              <th>State</th>
              <th>Abbreviation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {isPending ? (
              <tr>
                <td colSpan={4} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="text-center">
                  Error loading data
                </td>
              </tr>
            ) : data.locations?.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  No data found
                </td>
              </tr>
            ) : (
              data?.states?.map((state, index) => (
                <tr key={state.abbreviation}>
                  <td>{(page - 1) * 10 + index + 1}</td>
                  <td>
                    <p>{state.name}</p>
                  </td>
                  <td>{state.abbreviation}</td>

                  <td>
                    <div className="flex gap-5">
                      <button className="btn btn-circle btn-soft btn-info">
                        <LuSquarePen />
                      </button>
                      <button className="btn btn-circle btn-soft btn-error">
                        <LuTrash2 />
                      </button>
                    </div>
                  </td>
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
    </div>
  );
};

export default StatesData;
