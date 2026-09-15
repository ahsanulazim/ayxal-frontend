"use client";
import { updateCarousel } from "@/api/carouselApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { LuLink, LuSave, LuX } from "react-icons/lu";
import CarouselUploader from "./CarouselUploader";

const CarouselEditModal = ({ carousel, isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      subtitle: "",
      link: "",
      openInNewTab: false,
      order: 0,
      isActive: true,
      image: null,
    },
  });

  useEffect(() => {
    if (carousel) {
      reset({
        title: carousel.title || "",
        subtitle: carousel.subtitle || "",
        link: carousel.link || "",
        openInNewTab: Boolean(carousel.openInNewTab),
        order: carousel.order ?? 0,
        isActive: carousel.isActive !== false,
        image: carousel.image || null,
      });
    }
  }, [carousel, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateCarousel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousels"] });
      toast.success("Carousel updated successfully!");
      onClose();
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update carousel");
    },
  });

  const onSubmit = (data) => {
    mutate({
      id: carousel._id,
      data: {
        ...data,
        order: Number(data.order) || 0,
      },
    });
  };

  if (!isOpen || !carousel) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-base-200">
          <h3 className="font-bold text-xl text-main">Edit Carousel Slide</h3>
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-circle"
            onClick={onClose}
          >
            <LuX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Carousel Title *</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Exclusive Deals"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="text-error text-xs mt-1 block">
                {errors.title.message}
              </span>
            )}
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">
                Subtitle / Offer Tag (Optional)
              </span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Flat 30% Off on all pet food"
              {...register("subtitle")}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">
                Target Link (Internal path or external URL)
              </span>
            </label>
            <label className="input input-bordered flex items-center gap-2 w-full">
              <LuLink className="opacity-50" />
              <input
                type="text"
                placeholder="/category/cat-food or https://..."
                className="grow"
                {...register("link")}
              />
            </label>
            <span className="text-xs text-base-content/60 mt-1 block">
              Tip: You can use relative routes like &quot;/shop&quot; or full web URLs.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Display Order</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="0"
                {...register("order", { valueAsNumber: true })}
              />
              <span className="text-xs text-base-content/60 mt-1 block">
                Lower numbers appear first (0, 1, 2...)
              </span>
            </div>

            <div className="flex flex-col justify-center space-y-3 pt-4">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary checkbox-sm"
                  {...register("openInNewTab")}
                />
                <span className="label-text">Open link in new tab</span>
              </label>

              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-sm"
                  {...register("isActive")}
                />
                <span className="label-text font-medium">Active (Visible on homepage)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Carousel Image</span>
            </label>
            <CarouselUploader name="image" control={control} />
          </div>

          <div className="modal-action gap-3 pt-3 border-t border-base-200">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary min-w-[120px]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <LuSave size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default CarouselEditModal;
