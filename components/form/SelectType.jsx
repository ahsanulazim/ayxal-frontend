import React from "react";
import { useFieldContext } from "./CustomFormHook";

const SelectType = ({ label }) => {
  const field = useFieldContext();

  return (
    <>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      {/* name of each tab group should be unique */}
      <div className="tabs tabs-box w-fit">
        <input
          type="radio"
          name={field.name}
          className="tab"
          aria-label="Single Product"
          checked={field.state.value === "single"}
          onChange={() => field.handleChange("single")}
        />
        <input
          type="radio"
          name={field.name}
          className="tab"
          aria-label="Variable Product"
          checked={field.state.value === "variable"}
          onChange={() => field.handleChange("variable")}
        />
      </div>
    </>
  );
};

export default SelectType;
