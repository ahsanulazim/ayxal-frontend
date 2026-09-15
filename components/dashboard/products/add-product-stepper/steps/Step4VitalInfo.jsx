"use client";

import React from "react";
import { withForm, useFormStore } from "../form/productFormHook";
import { LuPlus, LuTrash2, LuSparkles } from "react-icons/lu";

export const Step4VitalInfo = withForm({
  render: function Step4VitalInfo({ form }) {
    const vitalInfoList =
      useFormStore(form, (state) => state.values.vitalInformations) || [];

    const handleAddSpecification = () => {
      const current = form.getFieldValue("vitalInformations") || [];
      form.setFieldValue("vitalInformations", [
        ...current,
        { label: "", value: "" },
      ]);
    };

    const handleRemoveSpecification = (index) => {
      const current = form.getFieldValue("vitalInformations") || [];
      if (current.length <= 1) {
        // keep one empty row if removing last
        form.setFieldValue("vitalInformations", [{ label: "", value: "" }]);
        return;
      }
      form.setFieldValue(
        "vitalInformations",
        current.filter((_, i) => i !== index)
      );
    };

    // Quick presets (e.g. Material, Origin, Warranty, Care instructions)
    const handleAddPreset = (presetLabel) => {
      const current = form.getFieldValue("vitalInformations") || [];
      // If first row is empty, fill it, otherwise append
      if (current.length === 1 && !current[0].label && !current[0].value) {
        form.setFieldValue("vitalInformations", [
          { label: presetLabel, value: "" },
        ]);
        return;
      }
      form.setFieldValue("vitalInformations", [
        ...current,
        { label: presetLabel, value: "" },
      ]);
    };

    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="border-b border-base-300 pb-4">
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">
              4
            </span>
            Specifications & Vital Details
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Provide technical specifications, material composition, origin, or key features.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-base-content/60 flex items-center gap-1 mr-1">
            <LuSparkles className="text-primary w-3 h-3" /> Quick Add:
          </span>
          {["Material", "Country of Origin", "Warranty", "Care Instructions", "Model"].map(
            (preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleAddPreset(preset)}
                className="btn btn-xs btn-outline rounded-full font-normal hover:btn-primary"
              >
                + {preset}
              </button>
            )
          )}
        </div>

        {/* Specification Rows */}
        <div className="space-y-3">
          {vitalInfoList.map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3.5 rounded-xl border border-base-300 bg-base-100/60 hover:bg-base-100 transition-colors"
            >
              <div className="w-8 text-xs font-mono font-bold text-base-content/40 text-center">
                #{index + 1}
              </div>

              {/* Label Field */}
              <div className="flex-1">
                <form.AppField name={`vitalInformations[${index}].label`}>
                  {(field) => (
                    <input
                      type="text"
                      placeholder="Specification Label (e.g. Fabric)"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="input input-bordered input-sm w-full bg-base-100"
                    />
                  )}
                </form.AppField>
              </div>

              {/* Value Field */}
              <div className="flex-1">
                <form.AppField name={`vitalInformations[${index}].value`}>
                  {(field) => (
                    <input
                      type="text"
                      placeholder="Specification Value (e.g. 100% Combed Cotton)"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="input input-bordered input-sm w-full bg-base-100"
                    />
                  )}
                </form.AppField>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleRemoveSpecification(index)}
                className="btn btn-ghost btn-sm btn-circle text-error/70 hover:text-error hover:bg-error/10"
                title="Remove row"
              >
                <LuTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Row Button */}
        <div>
          <button
            type="button"
            onClick={handleAddSpecification}
            className="btn btn-outline btn-primary btn-sm flex items-center gap-1.5"
          >
            <LuPlus className="w-4 h-4" /> Add Another Specification
          </button>
        </div>
      </div>
    );
  },
});
