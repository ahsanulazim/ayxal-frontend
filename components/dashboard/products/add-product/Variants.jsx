"use client";
import { useState } from "react";
import { LuPlus, LuX } from "react-icons/lu";
import Select from "react-select";
import VariantImageUploader from "./VariantImageUploader";

const Variants = ({ register }) => {
  const [variantFields, setVariantFields] = useState([]);

  const variantTypes = [
    { value: "Size", label: "Size" },
    { value: "Color", label: "Color" },
    { value: "Fabric", label: "Fabric" },
  ];

  const variantOptions = {
    Size: [
      { value: "S", label: "S" },
      { value: "M", label: "M" },
      { value: "L", label: "L" },
    ],
    Color: [
      { value: "Red", label: "Red" },
      { value: "Blue", label: "Blue" },
      { value: "Green", label: "Green" },
    ],
    Fabric: [
      { value: "Cotton", label: "Cotton" },
      { value: "Silk", label: "Silk" },
      { value: "Polyester", label: "Polyester" },
    ],
  };

  const addVariantField = () => {
    if (variantFields.length < 3) {
      setVariantFields([...variantFields, { type: "", options: [] }]);
    }
  };

  const removeVariantField = (index) => {
    const updated = [...variantFields];
    updated.splice(index, 1);
    setVariantFields(updated);
  };

  const updateVariantType = (index, type) => {
    const updated = [...variantFields];
    updated[index].type = type;
    updated[index].options = []; // reset options when type changes
    setVariantFields(updated);
  };

  const updateVariantOptions = (index, options) => {
    const updated = [...variantFields];
    updated[index].options = options;
    setVariantFields(updated);
  };

  // Already used variant types
  const usedTypes = variantFields.map((f) => f.type).filter(Boolean);

  return (
    <div className="fieldset bg-base-100 p-5 rounded-box mt-5">
      <h2 className="font-bold text-xl">Product Variants</h2>

      {variantFields.map((field, index) => (
        <div key={index} className="mt-3 space-y-3">
          <div className="flex items-center gap-5">
            {/* Variant Type */}
            <select
              {...register(`variants[${index}].type`)}
              value={field.type}
              onChange={(e) => updateVariantType(index, e.target.value)}
              className="select"
            >
              <option value="" disabled>
                Select Variant
              </option>
              {variantTypes.map((v) => (
                <option
                  key={v.value}
                  value={v.value}
                  disabled={
                    usedTypes.includes(v.value) && field.type !== v.value
                  }
                >
                  {v.label}
                </option>
              ))}
            </select>

            {/* Variant Options */}
            <Select
              key={field.type || index} // important fix
              className="flex-1"
              isMulti
              options={variantOptions[field.type] || []}
              value={field.options}
              onChange={(selected) => updateVariantOptions(index, selected)}
            />

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => removeVariantField(index)}
              className="btn btn-error btn-square"
            >
              <LuX />
            </button>
          </div>

          {/* Variant Image Uploader */}
          {field.type && field.options.length > 0 && (
            <VariantImageUploader
              register={register}
              variantType={field.type}
              options={field.options}
            />
          )}
        </div>
      ))}

      {/* Add Button (only show if less than 3 variants) */}
      {variantFields.length < 3 && (
        <button
          type="button"
          onClick={addVariantField}
          className="btn btn-main btn-square mt-3"
        >
          <LuPlus />
        </button>
      )}
    </div>
  );
};

export default Variants;
