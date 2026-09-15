"use client";
import { toggleCarouselStatus } from "@/api/carouselApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuExternalLink, LuLink, LuSquarePen, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

const CarouselCard = ({ carousel, onEdit, onDelete }) => {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () => toggleCarouselStatus(carousel._id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carousels"] });
      toast.success(data.message || "Status updated!");
    },
    onError: (err) => {
      console.error("Status toggle error:", err);
      toast.error(err.response?.data?.message || "Failed to toggle status");
    },
  });

  const isActive = carousel.isActive !== false;

  return (
    <div className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow border border-base-200 overflow-hidden flex flex-col justify-between">
      {/* Image and Badges */}
      <div className="relative aspect-video w-full bg-base-200 overflow-hidden group">
        <img
          src={carousel.image?.url}
          alt={carousel.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
          <span className="badge badge-neutral badge-sm shadow">
            Order: {carousel.order ?? 0}
          </span>
          <span
            className={`badge badge-sm shadow ${
              isActive
                ? "badge-success text-white"
                : "badge-ghost bg-black/60 text-white"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {carousel.openInNewTab && (
          <div className="absolute top-2 right-2 z-10">
            <span
              className="badge badge-info badge-sm shadow"
              title="Opens in new tab"
            >
              <LuExternalLink size={11} className="mr-1" /> New Tab
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3
            className="font-bold text-base line-clamp-1"
            title={carousel.title}
          >
            {carousel.title}
          </h3>
          {carousel.subtitle && (
            <p className="text-xs text-base-content/70 line-clamp-1 mt-0.5">
              {carousel.subtitle}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-xs text-base-content/60 mt-2">
            <LuLink className="shrink-0" />
            <span className="truncate" title={carousel.link || "No link set"}>
              {carousel.link || "No link specified"}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-base-200 flex items-center justify-between gap-2">
          {/* Active Switch */}
          <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              className="toggle toggle-success toggle-sm"
              checked={isActive}
              onChange={() => toggleMutation.mutate()}
              disabled={toggleMutation.isPending}
            />
            <span className="opacity-80">{isActive ? "Live" : "Draft"}</span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(carousel)}
              className="btn btn-xs btn-outline btn-info gap-1"
              title="Edit Slide"
            >
              <LuSquarePen size={12} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(carousel)}
              className="btn btn-xs btn-outline btn-error gap-1"
              title="Delete Slide"
            >
              <LuTrash2 size={12} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselCard;
