"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuStar, LuX } from "react-icons/lu";

const ReviewModal = ({ ref, product, pets = [], onSubmitReview, isLoading }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: 5,
      comment: "",
      petName: pets[0]?.name || "",
      petType: pets[0]?.type || "",
    },
  });

  const currentRating = watch("rating") || 5;

  const handleStarClick = (score) => {
    setValue("rating", score, { shouldValidate: true });
  };

  const handleClose = () => {
    if (!isLoading) {
      ref.current?.close();
    }
  };

  const onSubmit = (data) => {
    const selectedPet = pets.find((p) => p.name === data.petName);
    onSubmitReview({
      productId: product?.productId || product?.pid || product?._id,
      productTitle: product?.title || product?.productNameEn || "Pet Product",
      productThumbnail: product?.thumbnail || product?.bigImage || "",
      orderId: product?.orderId || null,
      rating: Number(data.rating),
      comment: data.comment,
      petName: data.petName,
      petType: selectedPet?.type || data.petType || "",
    });
  };

  return (
    <dialog ref={ref} className="modal" onClose={() => reset()}>
      <div className="modal-box w-full max-w-lg rounded-3xl p-0 overflow-hidden shadow-2xl border border-base-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-base-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-base-content">
              Write a Review ⭐
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Share how your pet companion enjoyed this product!
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
          {/* Product Preview Card */}
          {product && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-base-200/60 border border-base-200">
              <div className="w-12 h-12 rounded-xl bg-base-100 overflow-hidden shrink-0 border border-base-300 flex items-center justify-center">
                {product.thumbnail || product.bigImage ? (
                  <img
                    src={product.thumbnail || product.bigImage}
                    alt={product.title || product.productNameEn}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <LuStar className="size-5 text-amber-500" />
                )}
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <h4 className="font-semibold text-base-content truncate">
                  {product.title || product.productNameEn || "Pet Product"}
                </h4>
                <p className="text-base-content/60">Verified Purchase</p>
              </div>
            </div>
          )}

          {/* Star Rating Selector */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-xs">Overall Rating *</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = (hoverRating || currentRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-2xl transition-transform hover:scale-125 cursor-pointer focus:outline-hidden"
                  >
                    <LuStar
                      className={`size-7 transition-colors ${
                        filled
                          ? "fill-amber-400 text-amber-400"
                          : "text-base-content/30"
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-xs font-bold text-amber-600">
                {hoverRating || currentRating} of 5 Stars
              </span>
            </div>
          </div>

          {/* Optional Pet Association */}
          {pets.length > 0 && (
            <div>
              <label className="label">
                <span className="label-text font-medium text-xs">
                  Which pet loved this? (Optional)
                </span>
              </label>
              <select
                className="select select-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
                {...register("petName")}
              >
                <option value="">General (No specific pet)</option>
                {pets.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.type})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Review Comment */}
          <div>
            <label className="label">
              <span className="label-text font-medium text-xs">Your Feedback *</span>
            </label>
            <textarea
              rows={3}
              placeholder="What did your pet like about it? Was the quality and size as expected?"
              className={`textarea textarea-bordered w-full rounded-xl focus:border-main focus:outline-hidden ${
                errors.comment ? "textarea-error" : ""
              }`}
              {...register("comment", {
                required: "Please write a few words about your experience",
                minLength: {
                  value: 5,
                  message: "Feedback must be at least 5 characters",
                },
              })}
            />
            {errors.comment && (
              <span className="text-error text-xs mt-1 block">
                {errors.comment.message}
              </span>
            )}
          </div>

          {/* Action Buttons */}
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
                "Submit Review"
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

export default ReviewModal;
