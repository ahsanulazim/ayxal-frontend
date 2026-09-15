"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCjImportList, syncCjProduct } from "@/api/cjDropshipApi";
import { useRouter, useSearchParams } from "next/navigation";
import {
  LuCheck,
  LuExternalLink,
  LuRefreshCw,
  LuSparkles,
  LuStore,
  LuWeight,
  LuClock,
} from "react-icons/lu";
import moment from "moment";
import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";

const CjTable = () => {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const page = Number(params.get("page")) || 1;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cjImportList", page],
    queryFn: getCjImportList,
    keepPreviousData: true,
  });

  const syncMutation = useMutation({
    mutationFn: (id) => syncCjProduct(id),
    onSuccess: () => {
      toast.success("Synced stock & pricing with CJ!");
      queryClient.invalidateQueries({ queryKey: ["cjImportList"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to sync with CJ");
    },
  });

  const goToPage = (p) => {
    router.push(`?page=${p}`);
  };

  const content = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="overflow-x-auto bg-base-100 rounded-xl border border-base-200 shadow-sm">
        <table className="table table-zebra w-full">
          {/* Head */}
          <thead className="bg-base-200/80 text-xs uppercase tracking-wider text-base-content/70">
            <tr>
              <th className="w-12 text-center">#</th>
              <th>Product Details</th>
              <th>CJ Supplier Cost</th>
              <th>Package Weight</th>
              <th>Import Status</th>
              <th>Added Date</th>
              <th className="text-right pr-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td className="text-center">
                    <div className="skeleton size-4 mx-auto"></div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="skeleton aspect-square size-12 rounded-lg"></div>
                      <div className="space-y-1 flex-1">
                        <div className="skeleton h-4 w-3/4"></div>
                        <div className="skeleton h-3 w-1/3"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="skeleton h-5 w-16"></div>
                  </td>
                  <td>
                    <div className="skeleton h-4 w-16"></div>
                  </td>
                  <td>
                    <div className="skeleton h-6 w-24 rounded-full"></div>
                  </td>
                  <td>
                    <div className="skeleton h-4 w-24"></div>
                  </td>
                  <td className="text-right pr-6">
                    <div className="skeleton h-8 w-28 rounded-lg ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : isError ? (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  <div className="text-error font-medium">
                    Failed to fetch CJ products. Please verify your CJ API keys.
                  </div>
                  <button
                    onClick={() => refetch()}
                    className="btn btn-sm btn-outline mt-3"
                  >
                    Retry
                  </button>
                </td>
              </tr>
            ) : content.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-12">
                  <div className="text-base-content/60 text-sm">
                    No products found in your CJ shortlist.
                  </div>
                  <Link
                    href="/dashboard/cj-dropshipping/add-product"
                    className="btn btn-sm btn-primary mt-3"
                  >
                    Search CJ Products
                  </Link>
                </td>
              </tr>
            ) : (
              content.map((product, idx) => {
                const pid = product.productId || product.pid;
                const isImported = Boolean(product.isImported);
                const storeProd = product.storeProduct;

                return (
                  <tr key={pid} className="hover:bg-base-200/50 transition-colors">
                    <td className="text-center text-xs text-base-content/50 font-mono">
                      {(page - 1) * 10 + idx + 1}
                    </td>

                    {/* Product Media + Title */}
                    <td className="max-w-md">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12 bg-base-200">
                            <img
                              src={product.bigImage}
                              alt={product.nameEn}
                              className="object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3
                            className="font-medium text-sm text-base-content line-clamp-2 hover:text-primary transition-colors"
                            title={product.nameEn}
                          >
                            {product.nameEn}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-mono text-base-content/50">
                              PID: {pid}
                            </span>
                            {product.sku && (
                              <span className="text-[11px] font-mono text-base-content/50">
                                • SKU: {product.sku}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Supplier Cost */}
                    <td>
                      <div className="font-semibold text-sm text-base-content">
                        ${product.sellPrice}
                      </div>
                      <span className="text-[10px] text-base-content/50 block">
                        Base CJ Cost
                      </span>
                    </td>

                    {/* Weight */}
                    <td>
                      <div className="flex items-center gap-1 text-xs text-base-content/70">
                        <LuWeight className="size-3.5 opacity-60" />
                        <span>{product.packWeight || 0}g</span>
                      </div>
                    </td>

                    {/* Import Status Badge */}
                    <td>
                      {isImported ? (
                        <div className="flex flex-col gap-1 items-start">
                          <span className="badge badge-sm badge-success badge-soft gap-1 font-semibold whitespace-nowrap">
                            <LuCheck className="size-3" />
                            In Store
                          </span>
                          {storeProd?.status && (
                            <span className="text-[10px] uppercase font-mono tracking-wider text-base-content/50 pl-1">
                              {storeProd.status}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="badge badge-sm badge-ghost badge-soft text-base-content/60 font-medium whitespace-nowrap">
                          Not Imported
                        </span>
                      )}
                    </td>

                    {/* Added Date */}
                    <td>
                      <div className="flex items-center gap-1 text-xs text-base-content/70 whitespace-nowrap">
                        <LuClock className="size-3 opacity-50" />
                        <span>{moment(product.createAt).format("MMM D, YYYY")}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* View on CJ Dropshipping */}
                        <a
                          href={`https://cjdropshipping.com/product/-p-${pid}.html`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-base-content"
                          title="View on CJ Dropshipping"
                        >
                          <LuExternalLink className="size-3.5" />
                        </a>

                        {isImported ? (
                          <>
                            {/* Sync Stock Button */}
                            <button
                              type="button"
                              onClick={() => storeProd?._id && syncMutation.mutate(storeProd._id)}
                              disabled={syncMutation.isPending}
                              className="btn btn-soft btn-ghost btn-xs btn-circle"
                              title="Sync Stock & Cost with CJ"
                            >
                              <LuRefreshCw
                                className={`size-3.5 ${
                                  syncMutation.isPending ? "animate-spin text-primary" : ""
                                }`}
                              />
                            </button>

                            {/* View in Products */}
                            <Link
                              href={`/dashboard/products-v2?search=${encodeURIComponent(
                                storeProd?.title || ""
                              )}`}
                              className="btn btn-xs btn-soft btn-success gap-1 font-medium"
                              title="View in Custom Products Dashboard"
                            >
                              <LuStore className="size-3" />
                              Store
                            </Link>
                          </>
                        ) : (
                          /* Customize & Import Button */
                          <Link
                            href={`/dashboard/cj-dropshipping/${pid}`}
                            className="btn btn-xs btn-primary gap-1 font-medium shadow-sm hover:shadow"
                          >
                            <LuSparkles className="size-3" />
                            Customize & Import
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-base-content/60">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>

          <div className="join shadow-sm border border-base-200">
            <button
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
              className="join-item btn btn-sm bg-base-100"
            >
              «
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  (p >= page - 1 && p <= page + 1)
              )
              .map((p, idx, arr) => {
                const prev = arr[idx - 1];
                return (
                  <React.Fragment key={p}>
                    {prev && p - prev > 1 && (
                      <button className="join-item btn btn-sm btn-disabled" disabled>
                        ...
                      </button>
                    )}
                    <button
                      className={`join-item btn btn-sm ${
                        Number(page) === p ? "btn-primary font-bold" : "bg-base-100"
                      }`}
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
              className="join-item btn btn-sm bg-base-100"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CjTable;
