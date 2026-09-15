"use client";
import { uploadCarousel } from "@/api/carouselApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  LuArrowUpDown,
  LuExternalLink,
  LuInfo,
  LuLink,
  LuUpload,
  LuX,
} from "react-icons/lu";
import CarouselUploader from "./CarouselUploader";

const CarouselAddModal = ({ ref }) => {
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

  const uploadMutation = useMutation({
    mutationFn: uploadCarousel,
    onSuccess: () => {
      reset();
      queryClient.invalidateQueries({ queryKey: ["carousels"] });
      toast.success("Carousel banner added successfully!");
      ref.current.close();
    },
    onError: (error) => {
      console.error("Upload error:", error);
      toast.error(
        error.response?.data?.message || "Failed to add carousel banner",
      );
    },
  });

  const onSubmit = (data) => {
    uploadMutation.mutate({
      ...data,
      order: Number(data.order) || 0,
    });
  };

  const handleClose = () => {
    if (!uploadMutation.isPending) {
      reset();
      ref.current.close();
    }
  };

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-start mb-4 pb-3 border-b border-base-200">
          <div>
            <h3 className="font-bold text-xl text-base-content">
              Create New Carousel Banner
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Add a promotional banner for your homepage carousel.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-info gap-1 text-xs hidden sm:inline-flex">
              <LuInfo size={13} /> 1920×600px
            </span>
            <button
              type="button"
              className="btn btn-sm btn-ghost btn-circle"
              onClick={handleClose}
              disabled={uploadMutation.isPending}
            >
              <LuX size={18} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <label htmlFor="modal-title" className="label py-1">
                <span className="label-text font-semibold">Banner Title *</span>
              </label>
              <input
                id="modal-title"
                type="text"
                className="input input-bordered w-full"
                placeholder="e.g. Exclusive Deals on Pet Food"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <span className="text-error text-xs mt-1 block">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Subtitle */}
            <div>
              <label htmlFor="modal-subtitle" className="label py-1">
                <span className="label-text font-semibold">
                  Subtitle / Offer Tag (Optional)
                </span>
              </label>
              <input
                id="modal-subtitle"
                type="text"
                className="input input-bordered w-full"
                placeholder="e.g. Flat 30% discount this week"
                {...register("subtitle")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Link */}
            <div className="md:col-span-2">
              <label htmlFor="modal-link" className="label py-1">
                <span className="label-text font-semibold">
                  Destination Link
                </span>
              </label>
              <label className="input input-bordered flex items-center gap-2 w-full">
                <LuLink className="opacity-50 shrink-0" />
                <input
                  id="modal-link"
                  type="text"
                  placeholder="/category/cat-food or https://..."
                  className="grow"
                  {...register("link")}
                />
              </label>
              <span className="text-xs text-base-content/60 mt-1 block">
                Use internal routes (e.g. &quot;/shop&quot;) or full web URLs.
              </span>
            </div>

            {/* Order */}
            <div>
              <label htmlFor="modal-order" className="label py-1">
                <span className="label-text font-semibold flex items-center gap-1">
                  <LuArrowUpDown size={13} /> Order
                </span>
              </label>
              <input
                id="modal-order"
                type="number"
                defaultValue={0}
                className="input input-bordered w-full"
                placeholder="0"
                {...register("order", { valueAsNumber: true })}
              />
              <span className="text-xs text-base-content/60 mt-1 block">
                0 = highest priority
              </span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-sm"
                {...register("openInNewTab")}
              />
              <span className="label-text flex items-center gap-1">
                <LuExternalLink size={13} /> Open link in new tab
              </span>
            </label>

            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-success checkbox-sm"
                {...register("isActive")}
              />
              <span className="label-text font-medium">
                Active (Publish live)
              </span>
            </label>
          </div>

          {/* Image Uploader */}
          <div>
            <label className="label py-1">
              <span className="label-text font-semibold">
                Banner Graphic * (PNG, JPG, WEBP — Max 5MB)
              </span>
            </label>
            <CarouselUploader name="image" control={control} />
          </div>

          {/* Modal Actions */}
          <div className="modal-action gap-3 pt-3 border-t border-base-200">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={uploadMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success min-w-35"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Publishing...
                </>
              ) : (
                <>
                  <LuUpload size={16} /> Publish Banner
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={handleClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default CarouselAddModal;
