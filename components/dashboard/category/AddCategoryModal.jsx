"use client";
import api from "@/axios/axiosInstance";
import { categoryValidator } from "@/validator/categoryValidator";
import { useForm } from "@tanstack/react-form-nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";

const AddCategoryModal = ({ ref }) => {
  const queryClient = useQueryClient();

  const { handleSubmit, Field, Subscribe, reset } = useForm({
    defaultValues: {
      name: "",
      slug: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const res = await api.post("/categories/create", value);
      if (res.data.success) {
        reset();
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
                    onChange={(e) => field.handleChange(e.target.value)}
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
                className="btn btn-main w-full"
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
            }}
            className="btn"
          >
            Close
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default AddCategoryModal;
