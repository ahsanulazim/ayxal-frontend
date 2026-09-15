"use client";

import { useForm } from "react-hook-form";
import { LuX } from "react-icons/lu";

const AddPetModal = ({ ref, onAddPet, isLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      type: "Dog",
      breed: "",
      birthDate: "",
      weight: "",
      allergies: "",
      notes: "",
    },
  });

  const onSubmit = (data) => {
    onAddPet(data);
  };

  const handleClose = () => {
    if (!isLoading) {
      ref.current?.close();
    }
  };

  return (
    <dialog ref={ref} className="modal" onClose={() => reset()}>
      <div className="modal-box w-full max-w-lg rounded-3xl p-0 overflow-hidden shadow-2xl border border-base-200">
        <div className="p-6 border-b border-base-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-base-content">
              Add Your Pet 🐾
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Personalize recommendations & unlock birthday surprises!
            </p>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
            disabled={isLoading}
          >
            <LuX className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium text-xs">
                  Pet Name *
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Luna, Milo"
                className={`input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden ${
                  errors.name ? "input-error" : ""
                }`}
                {...register("name", {
                  required: "Pet name is required",
                  validate: (value) =>
                    value.trim() !== "" || "Pet name cannot be empty",
                })}
              />
              {errors.name && (
                <span className="text-error text-xs mt-1 block">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium text-xs">Pet Type</span>
              </label>
              <select
                className="select select-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
                {...register("type")}
              >
                <option value="Dog">Dog 🐶</option>
                <option value="Cat">Cat 🐱</option>
                <option value="Bird">Bird 🦜</option>
                <option value="Rabbit">Rabbit 🐰</option>
                <option value="Other">Other 🐾</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium text-xs">Breed</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Golden Retriever, Persian"
                className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
                {...register("breed")}
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium text-xs">
                  Birth / Gotcha Date
                </span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
                {...register("birthDate")}
              />
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium text-xs">
                Weight (Optional)
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. 15 kg or 30 lbs"
              className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
              {...register("weight")}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium text-xs">
                Allergies / Special Diet
              </span>
            </label>
            <input
              type="text"
              placeholder="e.g. Grain-free, Chicken allergy"
              className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
              {...register("allergies")}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium text-xs">
                Special Notes / Bio
              </span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Loves squeaky toys and peanut butter treats"
              className="textarea textarea-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
              {...register("notes")}
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-base-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-ghost rounded-xl"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-main rounded-xl px-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Save Pet Profile"
              )}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button disabled={isLoading}>close</button>
      </form>
    </dialog>
  );
};

export default AddPetModal;
