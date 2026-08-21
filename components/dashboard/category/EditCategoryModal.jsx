"use client";

import { getCategory, updateCategory } from "@/api/categoryApi";
import api from "@/axios/axiosInstance";
import { categoryUpdateValidator } from "@/validator/categoryValidator";
import { useForm } from "@tanstack/react-form-nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { LuLogOut, LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";

const EditCategoryModal = ({ categoryId, ref }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  //categories

  const {
    data: category,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: getCategory,
    enabled: !!categoryId,
  });

  const editCategory = useMutation({
    mutationFn: (values) => updateCategory({ categoryId, values }),

    onSuccess: async () => {
      toast.success("Category updated successfully");
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["category", categoryId],
        }),
      ]);
      handleClose();
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    },
  });

  const { handleSubmit, Field, Subscribe, reset, setFieldValue } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      thumbnail: null,
    },
    onSubmit: async ({ value }) => {
      await editCategory.mutateAsync(value);
    },
    validators: {
      onSubmit: categoryUpdateValidator,
    },
  });

  useEffect(() => {
    if (!category) return;

    reset({
      name: category.name ?? "",
      slug: category.slug ?? "",
      description: category.description ?? "",
      thumbnail: null,
    });
  }, [category]);

  const handleClose = () => {
    reset({
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      thumbnail: null,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    ref.current?.close();
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Category</h3>
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
                  {isLoading ? (
                    <div className="skeleton w-full h-10"></div>
                  ) : (
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
                  )}
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
                  {isLoading ? (
                    <div className="skeleton w-full h-10"></div>
                  ) : (
                    <input
                      type="text"
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="input w-full"
                      placeholder="dog-belts"
                    />
                  )}
                  {errors.length > 0 && (
                    <p className="text-error">{errors[0].message}</p>
                  )}
                </>
              );
            }}
          />
          <Field
            name="description"
            children={(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Description
                  </label>
                  {isLoading ? (
                    <div className="skeleton h-24 w-full"></div>
                  ) : (
                    <textarea
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="textarea w-full"
                      placeholder="Description"
                    ></textarea>
                  )}
                  {errors.length > 0 && (
                    <p className="text-error">{errors[0].message}</p>
                  )}
                </>
              );
            }}
          />

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="skeleton size-26"></div>
            ) : (
              category?.thumbnail && (
                <Image
                  height={100}
                  width={100}
                  src={category?.thumbnail?.url}
                  alt={category?.name}
                  className="rounded-box border border-gray-300 p-2"
                />
              )
            )}
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
          </div>

          <Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isDirty,
            ]}
            children={([canSubmit, isSubmitting, isDirty]) => (
              <button
                type="submit"
                disabled={
                  !canSubmit ||
                  isSubmitting ||
                  !isDirty ||
                  editCategory.isPending
                }
                className={`btn ${
                  !canSubmit ||
                  isSubmitting ||
                  !isDirty ||
                  editCategory.isPending
                    ? ""
                    : "btn-main"
                } w-full`}
              >
                {isSubmitting || editCategory.isPending ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <LuPlus /> Update
                  </>
                )}
              </button>
            )}
          />
          <button
            type="button"
            disabled={editCategory.isPending}
            onClick={handleClose}
            className="btn btn-error"
          >
            <LuLogOut /> Close
          </button>
        </form>
      </div>
    </dialog>
  );
};

export default EditCategoryModal;
