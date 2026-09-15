"use client";

import React from "react";
import Select from "react-select";
import { useStepperValidation } from "../form/stepperContext";

export default function FormSelect({
  field,
  label,
  options = [],
  placeholder = "Select...",
  isMulti = false,
  isClearable = true,
  disabled = false,
  isLoading = false,
  className = "",
  required = false,
  helperText = "",
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
    typeof rawError === "string" ? rawError : rawError?.message || "Invalid selection";

  const value = field?.state?.value;

  // Map value to React-Select value object
  const selectValue = React.useMemo(() => {
    if (isMulti) {
      if (!Array.isArray(value)) return [];
      return options.filter((opt) => {
        return value.some((v) => {
          const strVal = typeof v === "object" ? v?.value : v;
          return strVal === opt.value;
        });
      });
    }
    const rawVal = Array.isArray(value) ? value[0] : value;
    const strVal = typeof rawVal === "object" ? rawVal?.value : rawVal;
    return options.find((opt) => opt.value === strVal) || null;
  }, [value, options, isMulti]);

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

      <Select
        id={field?.name}
        instanceId={`select-${field?.name}`}
        isDisabled={disabled || isLoading}
        isLoading={isLoading}
        placeholder={placeholder}
        options={options}
        isClearable={isClearable}
        isMulti={isMulti}
        value={selectValue}
        onChange={(selected) => {
          if (isMulti) {
            const mapped = selected ? selected.map((item) => item.value) : [];
            field?.handleChange(mapped);
          } else {
            field?.handleChange(selected ? selected.value : "");
          }
          clearFieldError(name);
        }}
        onBlur={field?.handleBlur}
        classNames={{
          control: (state) =>
            `!min-h-[2.75rem] !bg-base-100 !rounded-lg !border transition-all duration-200 text-sm ${
              hasError
                ? "!border-error !ring-1 !ring-error/40"
                : state.isFocused
                ? "!border-primary !ring-2 !ring-primary/20"
                : "!border-base-300 hover:!border-base-content/40"
            } ${disabled ? "!opacity-60 !cursor-not-allowed" : ""}`,
          menu: () =>
            "!bg-base-100 !border !border-base-300 !shadow-xl !rounded-lg !overflow-hidden !z-50 text-sm",
          option: (state) =>
            `!py-2 !px-3 !cursor-pointer ${
              state.isSelected
                ? "!bg-primary !text-primary-content font-medium"
                : state.isFocused
                ? "!bg-base-200 !text-base-content"
                : "!text-base-content"
            }`,
          singleValue: () => "!text-base-content text-sm font-medium",
          input: () => "!text-base-content text-sm",
          placeholder: () => "!text-base-content/40 text-sm",
          multiValue: () =>
            "!bg-base-200 !border !border-base-300 !rounded-md !px-2 !py-0.5 !m-1",
          multiValueLabel: () =>
            "!text-xs !font-semibold !text-base-content !py-0",
          multiValueRemove: () =>
            "!text-base-content/60 hover:!bg-error/20 hover:!text-error !rounded !transition-colors !ml-1 !cursor-pointer",
        }}
        styles={{
          control: (base) => ({
            ...base,
            boxShadow: "none",
          }),
        }}
      />

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
