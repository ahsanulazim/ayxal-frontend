"use client";

import React, { useState } from "react";
import { withForm, useFormStore } from "../form/productFormHook";
import { LuX, LuTag } from "react-icons/lu";

export const Step5Description = withForm({
  render: function Step5Description({ form }) {
    const [tagInput, setTagInput] = useState("");
    const tags = useFormStore(form, (state) => state.values.tags) || [];

    const handleAddTag = (e) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const clean = tagInput.trim().replace(/^,|,$/g, "");
        if (clean && !tags.includes(clean)) {
          form.setFieldValue("tags", [...tags, clean]);
          setTagInput("");
        }
      }
    };

    const handleRemoveTag = (indexToRemove) => {
      form.setFieldValue(
        "tags",
        tags.filter((_, idx) => idx !== indexToRemove)
      );
    };

    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="border-b border-base-300 pb-4">
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">
              5
            </span>
            Description & Discoverability
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            Search tags and formatted rich descriptions ensure customers find and understand your product.
          </p>
        </div>

        {/* Tags Section */}
        <div className="p-5 rounded-2xl border border-base-300 bg-base-100/60 space-y-3">
          <label className="label py-0 flex justify-between items-center text-sm font-semibold text-base-content">
            <span className="flex items-center gap-1.5">
              <LuTag className="w-4 h-4 text-primary" /> Product Search Tags
            </span>
            <span className="text-xs text-base-content/50 font-normal">
              Press Enter or comma to add
            </span>
          </label>

          <div className="flex flex-wrap items-center gap-2 min-h-[44px] p-2 rounded-xl border border-base-300 bg-base-100">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="badge badge-primary badge-outline gap-1 py-3 px-2.5 font-medium text-xs"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(idx)}
                  className="hover:text-error transition-colors"
                >
                  <LuX className="w-3 h-3" />
                </button>
              </span>
            ))}

            <input
              type="text"
              placeholder={tags.length === 0 ? "e.g. summer, unisex, streetwear" : "Add more..."}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="input input-ghost input-xs flex-1 min-w-[140px] focus:outline-none"
            />
          </div>
        </div>

        {/* Rich Description */}
        <div className="p-5 rounded-2xl border border-base-300 bg-base-100/60">
          <form.AppField name="description">
            {(field) => (
              <field.RichText
                field={field}
                label="Product Long Description"
                placeholder="Share detailed information, styling advice, material details, and brand story..."
                helperText="Supports headings, lists, and formatted text"
              />
            )}
          </form.AppField>
        </div>
      </div>
    );
  },
});
