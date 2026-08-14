"use client";
import api from "@/axios/axiosInstance";
import { brandValidator } from "@/validator/brandValidator";
import { useForm } from "@tanstack/react-form-nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { LuLogOut, LuPlus } from "react-icons/lu";

const AddBrandModal = ({ ref }) => {
  const queryClient = useQueryClient();

  const { handleSubmit, Field, Subscribe, reset } = useForm({
    defaultValues: {
      label: "",
      value: "",
      logo: null,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      const formData = new FormData();
      formData.append("label", value.label);
      formData.append("value", value.value);
      formData.append("logo", value.logo);

      const res = await api.post("/brands/createBrand", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.success) {
        reset();
        ref.current.close();
        //queryClient.invalidateQueries({ queryKey: ["brands"] });
      }
    },
    validators: {
      onSubmit: brandValidator,
    },
  });

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Create Brand</h3>
        <form
          className="fieldset"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <Field
            name="label"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="input w-full"
                    placeholder="Nike"
                  />
                  {errors.length > 0 && (
                    <p className="text-error">{errors[0].message}</p>
                  )}
                </>
              );
            }}
          />
          <Field
            name="value"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Value
                  </label>
                  <input
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="input w-full"
                    placeholder="nike"
                  />
                  {errors.length > 0 && (
                    <p className="text-error">{errors[0].message}</p>
                  )}
                </>
              );
            }}
          />

          <Field
            name="logo"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Upload Logo</legend>
                    <input
                      type="file"
                      name={field.name}
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
                    Adding...
                  </>
                ) : (
                  <>
                    <LuPlus /> Add Brand
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
            className="btn btn-error"
          >
            <LuLogOut /> Close
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default AddBrandModal;
