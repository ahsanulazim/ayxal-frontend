"use client";

import { useEffect } from "react";
import { LuTruck, LuClock, LuCircleAlert } from "react-icons/lu";

export default function ShippingMethodSelector({
  options = [],
  selectedShipping,
  onSelectShipping,
  isLoading,
  error,
}) {
  // Auto-select the first / recommended option if not selected yet
  useEffect(() => {
    if (!selectedShipping && Array.isArray(options) && options.length > 0) {
      onSelectShipping(options[0]);
    }
  }, [options, selectedShipping, onSelectShipping]);

  if (isLoading) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-zinc-200 bg-zinc-50/50">
        <div className="flex items-center gap-2.5 text-zinc-600 mb-3">
          <span className="loading loading-spinner loading-sm text-main"></span>
          <span className="text-sm font-medium">
            Calculating live shipping options from CJ...
          </span>
        </div>
        <div className="space-y-2.5 animate-pulse">
          <div className="h-14 bg-zinc-200/70 rounded-lg"></div>
          <div className="h-14 bg-zinc-200/70 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-800 text-sm flex items-start gap-2.5">
        <LuCircleAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
        <div>
          <p className="font-semibold">Could not fetch carrier rates</p>
          <p className="text-xs text-amber-700 mt-0.5">
            {error || "Using standard store shipping rate."}
          </p>
        </div>
      </div>
    );
  }

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-sm font-bold text-zinc-800 flex items-center gap-1.5">
          <LuTruck className="w-4 h-4 text-main" />
          <span>Select Shipping Method</span>
        </label>
        <span className="text-xs text-zinc-500 font-medium">
          {options.length} {options.length === 1 ? "option" : "options"}{" "}
          available
        </span>
      </div>

      <div className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedShipping?.id === option.id;
          return (
            <div
              key={option.id}
              onClick={() => onSelectShipping(option)}
              className={`relative flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-main bg-main/5 shadow-xs ring-1 ring-main"
                  : "border-zinc-200 hover:border-zinc-300 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? "border-main bg-main"
                      : "border-zinc-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-900">
                      {option.logisticName}
                    </span>
                    {option.isRecommended && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 tracking-wide uppercase">
                        Recommended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-zinc-500 mt-0.5">
                    <LuClock className="w-3.5 h-3.5" />
                    <span>Delivery time: {option.logisticAging}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-zinc-900">
                  ${Number(option.logisticPrice).toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
