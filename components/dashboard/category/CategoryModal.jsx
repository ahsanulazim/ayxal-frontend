import { createCategory } from "@/api/categoryApi";
import { useForm } from "@tanstack/react-form-nextjs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";

const CategoryModal = ({ ref }) => {
  const { handleSubmit, reset, Field, Subscribe } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      thumbnail: "",
    },
    onSubmit: ({ value }) => {
      //mutate(value);
      console.log(value);
    },
  });

  const convertBase24 = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      field.handleChange(reader.result);
      field.treigger();
    };
    reader.readAsDataURL(file);
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["categories"],
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
      reset();
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add New Category</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
          className="fieldset "
        >
          <Field name="name">
            {(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Category Name
                  </label>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    className="input w-full"
                    placeholder="Dog Collar"
                  />
                  {errors.length && (
                    <p className=" text-error">{errors[0]?.message}</p>
                  )}
                </>
              );
            }}
          </Field>
          <Field name="slug">
            {(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Slug
                  </label>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    className="input w-full"
                    placeholder="dog-collar"
                  />
                  {errors.length && (
                    <p className=" text-error">{errors[0]?.message}</p>
                  )}
                </>
              );
            }}
          </Field>
          <Field>
            {(field) => {
              const { errors } = field.state.meta;
              return (
                <>
                  <label htmlFor={field.name} className="label">
                    Thumbnail
                  </label>
                  <input
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => {
                      convertBase24(e, field);
                    }}
                    type="file"
                    accept="image/*"
                    className="file-input w-full"
                  />
                  {errors.length && (
                    <p className=" text-error">{errors[0]?.message}</p>
                  )}
                </>
              );
            }}
          </Field>

          <div className="mt-5 flex justify-end gap-5">
            <button
              type="button"
              onClick={() => {
                ref.current.close();
                reset();
              }}
              className="btn flex-1 btn-error"
            >
              Close
            </button>
            <Subscribe
              children={({ canSubmit, isSubmitting }) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="btn flex-1 btn-success"
                >
                  {isPending ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    <>
                      <LuPlus /> Create
                    </>
                  )}
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CategoryModal;
