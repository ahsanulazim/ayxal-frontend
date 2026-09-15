"use client";

import React, { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/api/productApi";
import { getAllCategories } from "@/api/categoryApi";
import { getAllBrands } from "@/api/brandApi";
import ProductEditLayout from "@/components/dashboard/products/edit-product/ProductEditLayout";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import Link from "next/link";
import { LuArrowLeft, LuCircleAlert } from "react-icons/lu";

export default function EditProductPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  // Fetch product data
  const {
    data: productRes,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });

  // Fetch categories
  const { data: categoriesRes } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // Fetch brands
  const { data: brandsRes } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
  });

  const product = productRes?.product;
  const categories = Array.isArray(categoriesRes)
    ? categoriesRes
    : categoriesRes?.categories || categoriesRes?.data || [];

  const brands = Array.isArray(brandsRes)
    ? brandsRes
    : brandsRes?.brands || brandsRes?.data || [];

  return (
    <div className="space-y-6">
      <Breadcrumbs title="Products" subtitle="Edit Product" />

      {isProductLoading && (
        <div className="bg-base-100 border border-base-200 rounded-2xl p-8 space-y-6 animate-pulse">
          <div className="h-8 bg-base-200 rounded-xl w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-12 bg-base-200 rounded-xl"></div>
            <div className="h-12 bg-base-200 rounded-xl"></div>
          </div>
          <div className="h-64 bg-base-200 rounded-2xl"></div>
        </div>
      )}

      {isProductError && (
        <div className="alert alert-error rounded-2xl shadow-sm">
          <LuCircleAlert className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold">Failed to load product</h4>
            <p className="text-xs opacity-80">
              {productError?.response?.data?.message ||
                productError?.message ||
                "Product not found"}
            </p>
          </div>
          <Link href="/dashboard/products-v2" className="btn btn-sm btn-ghost">
            Return to Products
          </Link>
        </div>
      )}

      {!isProductLoading && !isProductError && product && (
        <ProductEditLayout
          initialProduct={product}
          categories={categories}
          brands={brands}
        />
      )}
    </div>
  );
}
