"use client";

import React from "react";
import {
  LuBox,
  LuCheckCircle2,
  LuCircleCheck,
  LuLayers,
  LuTrendingUp,
  LuTriangleAlert,
} from "react-icons/lu";

const ProductMetrics = ({
  products = [],
  totalProducts = 0,
  isLoading = false,
}) => {
  // Compute metrics from current dataset / page
  const inStockCount = products.filter((p) => {
    const stockNum =
      typeof p.stock === "number" ? p.stock : parseInt(p.stock, 10);
    return !isNaN(stockNum) && stockNum > 0;
  }).length;

  const lowOrOutOfStockCount = products.filter((p) => {
    const stockNum =
      typeof p.stock === "number" ? p.stock : parseInt(p.stock, 10);
    return isNaN(stockNum) || stockNum <= 5;
  }).length;

  const variableProductsCount = products.filter(
    (p) => !!p.hasVariations,
  ).length;
  const singleProductsCount = products.length - variableProductsCount;

  const cards = [
    {
      title: "Total Catalog",
      value: totalProducts || products.length,
      subtitle: `${products.length} on this page`,
      icon: LuBox,
      color: "text-main",
      bgColor: "bg-main/10",
      borderColor: "border-main/20",
      badge: "Active Store",
      badgeColor: "badge-soft badge-primary",
    },
    {
      title: "In Stock",
      value: inStockCount,
      subtitle: "Ready for purchase",
      icon: LuCircleCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
      badge: `${products.length > 0 ? Math.round((inStockCount / products.length) * 100) : 0}% of page`,
      badgeColor: "badge-soft badge-success",
    },
    {
      title: "Low / Out of Stock",
      value: lowOrOutOfStockCount,
      subtitle: "Needs restock attention",
      icon: LuTriangleAlert,
      color:
        lowOrOutOfStockCount > 0
          ? "text-amber-600 dark:text-amber-400"
          : "text-base-content/60",
      bgColor: lowOrOutOfStockCount > 0 ? "bg-amber-500/10" : "bg-base-200",
      borderColor:
        lowOrOutOfStockCount > 0 ? "border-amber-500/20" : "border-base-200",
      badge: lowOrOutOfStockCount > 0 ? "Needs Action" : "Healthy",
      badgeColor:
        lowOrOutOfStockCount > 0
          ? "badge-soft badge-warning"
          : "badge-soft badge-ghost",
    },
    {
      title: "Variable vs Single",
      value: `${variableProductsCount} / ${singleProductsCount}`,
      subtitle: "Multi-variant vs Simple",
      icon: LuLayers,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
      badge: `${variableProductsCount} Variable`,
      badgeColor: "badge-soft badge-secondary",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="card bg-base-100 border border-base-content/10 shadow-xs p-5 rounded-2xl animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="skeleton h-4 w-24 rounded-md"></div>
              <div className="skeleton size-9 rounded-xl"></div>
            </div>
            <div className="skeleton h-8 w-16 rounded-md mb-2"></div>
            <div className="skeleton h-3 w-32 rounded-md"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`card bg-base-100 border ${card.borderColor} shadow-xs hover:shadow-md transition-all duration-200 p-5 rounded-2xl relative overflow-hidden group`}
          >
            <div
              className={`absolute -right-6 -bottom-6 size-24 rounded-full ${card.bgColor} blur-2xl opacity-40 group-hover:opacity-70 transition-opacity`}
            />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="size-5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-2xl font-bold tracking-tight text-base-content">
                {card.value}
              </h3>
              <span className={`badge badge-sm font-medium ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            <p className="text-xs text-base-content/60 mt-1.5 flex items-center gap-1">
              <LuTrendingUp className="size-3 opacity-60" />
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ProductMetrics;
