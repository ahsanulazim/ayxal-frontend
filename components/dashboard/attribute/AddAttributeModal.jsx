"use client";
import { createAttribute } from "@/api/attributeApi";
import { attributeSchema } from "@/validator/attributeValidator";
import { useForm } from "@tanstack/react-form-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuLogOut, LuSave } from "react-icons/lu";
import { toast } from "react-toastify";

const AddAttributeModal = ({ ref }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAttribute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success(data?.message);
      reset();
      ref.current.close();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Attribute Cannot be Added",
      );
    },
  });

  const { handleSubmit, Field, reset, Subscribe } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      attributeType: "",
    },
    validators: {
      onSubmit: attributeSchema,
    },

    onSubmit: ({ value }) => mutation.mutate(value),
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
          <h2 className="text-lg font-bold">Add New Attribute</h2>

          <Field
            name="name"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Attribute Name
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    placeholder="Color"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {errors.length > 0 && (
                    <p className="text-error">{errors[0]?.message}</p>
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
                    className="input w-full"
                    placeholder="color"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {errors.length > 0 && (
                    <p className="text-error">{errors[0]?.message}</p>
                  )}
                </>
              );
            }}
          />

          <Field
            name="attributeType"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Attribute Type
                  </label>
                  <select
                    className="select w-full"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    <option value="swatch">Swatch</option>
                    <option value="button">Button</option>
                  </select>
                  {errors.length > 0 && (
                    <p className="text-error">{errors[0]?.message}</p>
                  )}
                </>
              );
            }}
          />

          <Subscribe
            selector={(state) => [state.canSubmit, state.isDirty]}
            children={([canSubmit, isDirty]) => (
              <button
                type="submit"
                className="btn btn-success mt-5"
                disabled={!canSubmit || !isDirty || mutation.isPending}
              >
                {mutation.isPending ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <LuSave />
                )}{" "}
                Save
              </button>
            )}
          />
          <button
            type="button"
            className="btn btn-error w-full"
            onClick={() => {
              reset();
              ref.current.close();
            }}
          >
            <LuLogOut /> Close
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default AddAttributeModal;
