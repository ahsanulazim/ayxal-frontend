"use client";
import { useRef } from "react";
import api from "@/axios/axiosInstance";
import { categoryValidator } from "@/validator/categoryValidator";
import { useForm } from "@tanstack/react-form-nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { LuLogOut, LuPlus } from "react-icons/lu";

const AddCategoryModal = ({ ref }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  const { handleSubmit, Field, Subscribe, reset, setFieldValue } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      thumbnail: null,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData();
      formData.append("name", value.name);
      formData.append("slug", value.slug);
      formData.append("thumbnail", value.thumbnail);

      const res = await api.post("/categories/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        reset();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        ref.current.close();
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
    },
    validators: {
      onSubmit: categoryValidator,
    },
  });

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Create Category</h3>
        <form
          className="fieldset"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <Field
            name="name"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Category Name
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      setFieldValue(
                        "slug",
                        e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      );
                    }}
                    onBlur={field.handleBlur}
                    className="input w-full"
                    placeholder="Dog Belts"
                  />
                  {errors.length > 0 && (
                    <p className="text-error">{errors[0].message}</p>
                  )}
                </>
              );
            }}
          />
          <Field
            name="slug"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Slug
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="input w-full"
                    placeholder="dog-belts"
                  />
                  {errors.length > 0 && (
                    <p className="text-error">{errors[0].message}</p>
                  )}
                </>
              );
            }}
          />

          <Field
            name="thumbnail"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <fieldset className="fieldset">
                    <label htmlFor={field.name} className="label">
                      Upload thumbnail
                    </label>
                    <input
                      type="file"
                      name={field.name}
                      ref={fileInputRef}
                      onChange={(e) => field.handleChange(e.target.files[0])}
                      onBlur={field.handleBlur}
                      className="file-input w-full"
                      accept="image/*"
                    />
                    <label className="label">Max size 2MB</label>
                  </fieldset>
                  {errors.length > 0 && (
                    <p className="text-error">{errors[0].message}</p>
                  )}
                </>
              );
            }}
          />

          <Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isDirty,
            ]}
            children={([canSubmit, isSubmitting, isDirty]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting || !isDirty}
                className={`btn ${!canSubmit || isSubmitting || !isDirty ? "" : "btn-main"} w-full`}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <LuPlus /> Create
                  </>
                )}
              </button>
            )}
          />
          <button
            type="button"
            onClick={() => {
              ref.current.close();
              reset();
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
            className="btn btn-error"
          >
            <LuLogOut /> Close
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default AddCategoryModal;
