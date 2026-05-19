"use client";
import { createAttribute } from "@/api/attributeApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { LuLogOut, LuSave } from "react-icons/lu";
import { toast } from "react-toastify";

const AddAttributeModal = ({ ref }) => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      attributeType: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createAttribute,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attributes"] });
      toast.success(data.message || "Attribute Added");
      reset();
      ref.current.close();
    },
    onError: (data) => {
      toast.error(data.message || "Attribute Cannot be Added");
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
    console.log(data);
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <form className="fieldset" onSubmit={handleSubmit(onSubmit)}>
          <h2 className="text-lg font-bold">Add New Attribute</h2>
          <label htmlFor="name" className="label">
            Attribute Name
          </label>
          <input
            type="text"
            className="input w-full"
            {...register("name", { required: "Name is Required" })}
          />
          {errors.name && <p className="text-red-600">{errors.name.message}</p>}
          <label htmlFor="slug" className="label">
            Slug
          </label>
          <input
            type="text"
            className="input w-full"
            {...register("slug", {
              required: "Slug is Required",
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message:
                  "Slug must be lowercase, alphanumeric, and may contain hyphens (no spaces or special characters)",
              },
            })}
          />
          {errors.slug && <p className="text-red-500">{errors.slug.message}</p>}
          <label htmlFor="attributeType" className="label">
            Attribute Type
          </label>
          <select
            defaultValue=""
            className="select w-full"
            {...register("attributeType", {
              required: "Please select a attribute type",
            })}
          >
            <option value="" disabled>
              Select
            </option>
            <option value="swatch">Swatch</option>
            <option value="button">Button</option>
          </select>
          <button
            type="submit"
            className="btn btn-success mt-5"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <LuSave />
            )}{" "}
            Save
          </button>
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
