"use client";
import { deleteCarousel } from "@/api/carouselApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { LuTrash2, LuTriangleAlert } from "react-icons/lu";

const CarouselDeleteModal = ({ carousel, isOpen, onClose }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteCarousel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carousels"] });
      toast.success("Carousel slide deleted successfully!");
      onClose();
    },
    onError: (error) => {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete carousel");
    },
  });

  if (!isOpen || !carousel) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex items-center gap-3 text-error mb-3">
          <div className="p-2 bg-error/10 rounded-full">
            <LuTriangleAlert size={24} />
          </div>
          <h3 className="font-bold text-lg text-base-content">
            Delete Carousel Slide?
          </h3>
        </div>

        <p className="text-sm text-base-content/80 mb-4">
          Are you sure you want to permanently delete{" "}
          <span className="font-semibold text-base-content">
            &quot;{carousel.title}&quot;
          </span>
          ? The image will also be removed from storage. This action cannot be
          undone.
        </p>

        {carousel.image?.url && (
          <div className="aspect-video w-full rounded-lg overflow-hidden border border-base-300 mb-4 bg-base-200">
            <img
              src={carousel.image.url}
              alt={carousel.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="modal-action gap-3">
          <button
            type="button"
            className="btn btn-ghost flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-error flex-1"
            onClick={() => mutate(carousel._id)}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Deleting...
              </>
            ) : (
              <>
                <LuTrash2 size={16} />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
};

export default CarouselDeleteModal;
