"use client";

import React from "react";

export default function FormSwitch({
  field,
  label,
  description = "",
  className = "",
  disabled = false,
  variant = "toggle", // "toggle" or "checkbox"
}) {
  const value = !!field?.state?.value;

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border border-base-300 bg-base-100/60 hover:bg-base-100 transition-colors duration-150 cursor-pointer select-none ${
        value ? "border-primary/50 bg-primary/5" : ""
      } ${className}`}
      onClick={() => {
        if (!disabled) field?.handleChange(!value);
      }}
    >
      <div className="pt-0.5">
        {variant === "toggle" ? (
          <input
            type="checkbox"
            id={field?.name}
            name={field?.name}
            checked={value}
            disabled={disabled}
            onChange={(e) => field?.handleChange(e.target.checked)}
            className="toggle toggle-primary toggle-sm cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <input
            type="checkbox"
            id={field?.name}
            name={field?.name}
            checked={value}
            disabled={disabled}
            onChange={(e) => field?.handleChange(e.target.checked)}
            className="checkbox checkbox-primary checkbox-sm cursor-pointer rounded"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      <div className="flex-1">
        <label
          htmlFor={field?.name}
          className="text-sm font-semibold text-base-content cursor-pointer block"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-base-content/60 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
