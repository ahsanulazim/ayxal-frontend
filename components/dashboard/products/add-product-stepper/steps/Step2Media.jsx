"use client";

import React from "react";
import { withForm } from "../form/productFormHook";

export const Step2Media = withForm({
  render: function Step2Media({ form }) {
    return (
      <div className="space-y-6">
        {/* Section Header */}
        <div className="border-b border-base-300 pb-4">
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-black">
              2
            </span>
            Media & Product Imagery
          </h2>
          <p className="text-sm text-base-content/60 mt-1">
            High-quality visuals dramatically increase buyer conversion. Add a primary thumbnail and supporting gallery photos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Primary Thumbnail */}
          <div className="p-5 rounded-2xl border border-base-300 bg-base-100/60 flex flex-col justify-between">
            <div>
              <span className="badge badge-primary badge-sm font-bold uppercase tracking-wider mb-2">
                Primary Showcase
              </span>
              <h3 className="font-semibold text-base text-base-content mb-1">
                Main Thumbnail
              </h3>
              <p className="text-xs text-base-content/60 mb-4">
                This image represents your product in search cards, cart items, and catalog lists.
              </p>
            </div>

            <form.AppField name="thumbnail">
              {(field) => (
                <field.ImageDropzone
                  field={field}
                  label=""
                  multiple={false}
                  required
                />
              )}
            </form.AppField>
          </div>

          {/* Product Gallery */}
          <div className="p-5 rounded-2xl border border-base-300 bg-base-100/60 flex flex-col justify-between">
            <div>
              <span className="badge badge-secondary badge-sm font-bold uppercase tracking-wider mb-2">
                Gallery & Angles
              </span>
              <h3 className="font-semibold text-base text-base-content mb-1">
                Product Gallery Photos
              </h3>
              <p className="text-xs text-base-content/60 mb-4">
                Upload multiple angles, lifestyle shots, or close-ups (up to 10 images).
              </p>
            </div>

            <form.AppField name="images">
              {(field) => (
                <field.ImageDropzone
                  field={field}
                  label=""
                  multiple={true}
                  maxFiles={10}
                />
              )}
            </form.AppField>
          </div>
        </div>
      </div>
    );
  },
});
