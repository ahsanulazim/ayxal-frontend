"use client";

import { createVariation } from "@/api/typeApi";
import { variantValidator } from "@/validator/variantValidator";
import { useForm } from "@tanstack/react-form-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const TypeModal = ({ ref, attributeSlug, attributeData }) => {
  const typeName =
    attributeSlug.slice(0, 1).toUpperCase() +
    attributeSlug.slice(1, attributeSlug.length);

  const { handleSubmit, Field, Subscribe, reset } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      value: "",
    },
    onSubmit: ({ value }) => {
      console.log(value);
      mutation.mutate({ ...value, attributeSlug });
    },
    validators: {
      onSubmit: variantValidator,
      onBlur: variantValidator,
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createVariation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["variations"] });
      toast.success(`${typeName} created successfully`);
      reset();
      ref.current?.close();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || `Failed to create ${typeName}`,
      );
    },
  });

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <form
          className="fieldset"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <h2 className="text-lg font-bold">Add New {typeName}</h2>
          <Field
            name="name"
            children={(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    {typeName} Name
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={`${typeName} Name`}
                  />
                  {isTouched && errors?.length > 0 && (
                    <p className="text-error">{errors[0].message}</p>
                  )}
                </>
              );
            }}
          />
          <Field
            name="slug"
            children={(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Slug
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Slug"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {isTouched && errors?.length > 0 && (
                    <p className="text-error">{errors[0].message}</p>
                  )}
                </>
              );
            }}
          />

          <label htmlFor="value" className="label">
            {attributeData?.attributeType === "swatch" ? "Swatch" : "Button"}
          </label>
          {attributeData?.attributeType === "swatch" ? (
            <Field
              name="value"
              children={(field) => (
                <input
                  type="color"
                  className="size-10 rounded-md border-0 p-0"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          ) : (
            <Field
              name="value"
              children={(field) => (
                <input
                  type="text"
                  className="input w-full"
                  placeholder="M"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              )}
            />
          )}

          <Subscribe
            selector={(state) => [state.canSubmit, state.isDirty]}
            children={([canSubmit, isDirty]) => (
              <button
                type="submit"
                className={`btn ${!canSubmit || !isDirty || mutation.isPending ? "" : "btn-main"} mt-5`}
                disabled={!canSubmit || !isDirty || mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating...
                  </>
                ) : (
                  `Add ${typeName}`
                )}
              </button>
            )}
          />

          <button
            type="button"
            className="btn btn-otline"
            onClick={() => {
              ref.current?.close();
              reset();
            }}
          >
            Cancel
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default TypeModal;
