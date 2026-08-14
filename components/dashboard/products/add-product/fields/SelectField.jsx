"use client";
import Select from "react-select";

const SelectField = ({
  field,
  options,
  placeholder,
  isClearable,
  trigger,
  errors,
  disabled = false,
  isMulti = false,
}) => {
  return (
    <>
      <Select
        {...field}
        isDisabled={disabled}
        placeholder={placeholder}
        options={options}
        isClearable={isClearable}
        isMulti={isMulti}
        value={
          isMulti
            ? options.filter((c) => {
                if (!field.value) return false;
                return field.value.some((val) => {
                  const strVal = typeof val === "object" ? val?.value : val;
                  return strVal === c.value;
                });
              })
            : options.find((c) => {
                const strVal =
                  typeof field.value === "object"
                    ? field.value?.value
                    : field.value;
                return c.value === strVal;
              }) || null
        }
        onChange={(selected) => {
          if (isMulti) {
            field.onChange(selected ? selected.map((c) => c.value) : []);
          } else {
            field.onChange(selected ? selected.value : "");
          }
          trigger(field.name);
        }}
        classNames={{
          control: (state) =>
            `input w-full px-0 ${state.isDisabled ? "!bg-base-200 !border-base-200 shadow-none !cursor-not-allowed" : "!bg-base-100 !border-gray-300"}`,
          menu: (state) => `!bg-base-100 text-sm`,
          option: (state) =>
            `${
              state.isFocused ? "!bg-base-200" : ""
            } ${state.isSelected ? "!bg-base-300 !text-primary-content" : ""}`,

          multiValue: () => "!bg-base-300 rounded-md px-2 py-0.5",
          multiValueLabel: () => "!text-xs font-semibold !text-base-content",
          multiValueRemove: (state) =>
            `!cursor-pointer hover:!bg-transparent hover:!text-error rounded-md px-1`,
        }}
      />
      {errors && <span className="text-error text-xs">{errors.message}</span>}
    </>
  );
};

export default SelectField;
