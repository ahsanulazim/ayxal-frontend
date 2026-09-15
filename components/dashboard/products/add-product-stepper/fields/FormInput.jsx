"use client";

import React from "react";
import { useStepperValidation } from "../form/stepperContext";

export default function FormInput({
  field,
  label,
  type = "text",
  placeholder = "",
  helperText = "",
  className = "",
  required = false,
  min,
  max,
  step,
  prefix,
  suffix,
  disabled = false,
}) {
  const { stepErrors, clearFieldError } = useStepperValidation();

  const name = field?.name || "";
  const normalizedName = name.replace(/\[(\d+)\]/g, ".$1");
  const bracketedName = name.replace(/\.(\d+)/g, "[$1]");

  const contextError =
    stepErrors[name] ||
    stepErrors[normalizedName] ||
    stepErrors[bracketedName];

  const tanstackErrors = field?.state?.meta?.errors ?? [];
  const rawError = contextError || tanstackErrors[0];
  const hasError = !!rawError;
  const errorMessage =
    typeof rawError === "string" ? rawError : rawError?.message || "Invalid value";

  const value = field?.state?.value ?? "";

  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label py-1.5 flex justify-between items-center text-sm font-semibold text-base-content/90">
          <span>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
          {helperText && (
            <span className="text-xs text-base-content/50 font-normal">
              {helperText}
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-base-content/50 text-sm font-medium pointer-events-none z-10">
            {prefix}
          </span>
        )}

        <input
          id={field?.name}
          name={field?.name}
          type={type}
          value={value}
          onChange={(e) => {
            const val =
              type === "number"
                ? e.target.value === ""
                  ? ""
                  : Number(e.target.value)
                : e.target.value;
            field?.handleChange(val);
            clearFieldError(name);
          }}
          onBlur={field?.handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          className={`input input-bordered w-full transition-all duration-200 bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm ${
            prefix ? "pl-8" : ""
          } ${suffix ? "pr-8" : ""} ${
            hasError
              ? "input-error border-error focus:ring-error/30 ring-1 ring-error/40"
              : ""
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        />

        {suffix && (
          <span className="absolute right-3 text-base-content/50 text-sm font-medium pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {hasError && (
        <label className="label py-1">
          <span className="label-text-alt text-error text-xs font-medium flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3.5 h-3.5 shrink-0"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm-.75-4.25a.75.75 0 0 0 1.5 0V8a.75.75 0 0 0-1.5 0v2.75ZM8 5.75a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75Z"
                clipRule="evenodd"
              />
            </svg>
            {errorMessage}
          </span>
        </label>
      )}
    </div>
  );
}
