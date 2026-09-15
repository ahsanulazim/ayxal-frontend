"use client";

import { getMyOrders } from "@/api/orderApi";
import { createReview, deleteReview, getMyReviews } from "@/api/reviewApi";
import { getUserData } from "@/api/usersApi";
import ReviewModal from "@/components/account/ReviewModal";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useContext, useRef, useState } from "react";
import { FaPaw } from "react-icons/fa6";
import {
  LuCircleCheck,
  LuPackage,
  LuPenLine,
  LuStar,
  LuTrash2,
} from "react-icons/lu";
import { toast } from "react-toastify";

const ReviewsPage = () => {
  const { newUser } = useContext(MyContext);
  const email = newUser?.user?.email;
  const userName = newUser?.user?.name || "Pet Parent";
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("my-reviews");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const reviewModalRef = useRef();

  // 1. Fetch existing reviews
  const { data: reviewsResp, isLoading: isReviewsLoading } = useQuery({
    queryKey: ["myReviews", email],
    queryFn: () => getMyReviews(email),
    enabled: !!email,
  });

  // 2. Fetch user data for pets list
  const { data: userDataResp } = useQuery({
    queryKey: ["userData", email],
    queryFn: () => getUserData(email),
    enabled: !!email,
  });

  // 3. Fetch delivered orders to find unreviewed products
  const { data: deliveredOrdersResp, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["myOrders", email, { status: "delivered" }],
    queryFn: () => getMyOrders({ email, status: "delivered", limit: 30 }),
    enabled: !!email,
  });

  const reviews = reviewsResp?.reviews || [];
  const pets = userDataResp?.user?.pets || [];
  const deliveredOrders = deliveredOrdersResp?.orders || [];

  // Extract unique products from delivered orders
  const reviewedProductIds = new Set(reviews.map((r) => String(r.productId)));
  const awaitingReviewItems = [];
  deliveredOrders.forEach((order) => {
    (order.products || []).forEach((item) => {
      const pid = String(item.productId || item._id);
      if (pid && !reviewedProductIds.has(pid)) {
        awaitingReviewItems.push({
          ...item,
          orderId: order._id,
        });
      }
    });
  });

  const createReviewMutation = useMutation({
    mutationFn: (reviewData) =>
      createReview({
        ...reviewData,
        userEmail: email,
        userName,
      }),
    onSuccess: (data) => {
      toast.success(data?.message || "Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["myReviews", email] });
      reviewModalRef.current?.close();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id) => deleteReview(id, email),
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["myReviews", email] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete review");
    },
  });

  const handleOpenReviewModal = (product) => {
    setSelectedProduct(product);
    reviewModalRef.current?.showModal();
  };

  const isLoading = isReviewsLoading || isOrdersLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <LuStar className="size-6 text-amber-500 fill-amber-500/20" />{" "}
            Reviews & Ratings
          </h2>
          <p className="text-xs text-base-content/60 mt-1">
            Share your feedback on delivered products and help other pet parents
            choose the best.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-base-100 p-1.5 rounded-2xl border border-base-200">
          <button
            type="button"
            onClick={() => setActiveTab("my-reviews")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "my-reviews"
                ? "bg-main text-white shadow-xs"
                : "text-base-content/70 hover:bg-base-200"
            }`}
          >
            My Reviews ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("awaiting")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "awaiting"
                ? "bg-main text-white shadow-xs"
                : "text-base-content/70 hover:bg-base-200"
            }`}
          >
            Awaiting Review ({awaitingReviewItems.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Submitted Reviews */}
      {activeTab === "my-reviews" && (
        <>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="h-36 bg-base-100 rounded-3xl border border-base-200 animate-pulse"
                />
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <LuStar className="size-8" />
              </div>
              <h3 className="font-bold text-lg text-base-content">
                No reviews yet
              </h3>
              <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                Once your pet supplies are delivered, share your experience here
                to help fellow pet lovers!
              </p>
              {awaitingReviewItems.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("awaiting")}
                  className="btn btn-main btn-sm rounded-xl px-5 mt-2"
                >
                  Review Delivered Items ({awaitingReviewItems.length})
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-base-200 overflow-hidden shrink-0 border border-base-300 flex items-center justify-center">
                        {review.productThumbnail ? (
                          <img
                            src={review.productThumbnail}
                            alt={review.productTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <LuPackage className="size-5 text-base-content/40" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-base-content line-clamp-1">
                          {review.productTitle}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <LuStar
                                key={s}
                                className={`size-3.5 ${
                                  s <= review.rating
                                    ? "fill-current"
                                    : "text-base-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-base-content">
                            {review.rating}.0
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this review?")) {
                          deleteReviewMutation.mutate(review._id);
                        }
                      }}
                      className="btn btn-ghost btn-xs btn-circle text-error/60 hover:text-error hover:bg-error/10"
                      title="Delete Review"
                    >
                      <LuTrash2 className="size-4" />
                    </button>
                  </div>

                  {/* Comment & Pet Tag */}
                  <p className="text-xs text-base-content/80 leading-relaxed pt-1">
                    &ldquo;{review.comment}&rdquo;
                  </p>

                  <div className="pt-3 border-t border-base-200 flex items-center justify-between text-[11px] text-base-content/50">
                    {review.petName ? (
                      <span className="badge badge-xs bg-main/10 text-main border-0 py-1 font-medium gap-1">
                        <FaPaw className="size-2.5" /> Reviewed for{" "}
                        {review.petName}
                      </span>
                    ) : (
                      <span className="badge badge-xs badge-ghost py-1">
                        Verified Purchase
                      </span>
                    )}

                    <span>
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString()
                        : "Recent"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Awaiting Review */}
      {activeTab === "awaiting" && (
        <>
          {awaitingReviewItems.length === 0 ? (
            <div className="bg-base-100 rounded-3xl p-12 text-center border border-base-200 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <LuCircleCheck className="size-7" />
              </div>
              <h3 className="font-bold text-base text-base-content">
                All caught up!
              </h3>
              <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                You have reviewed all items from your delivered pet supply
                orders.
              </p>
              <Link
                href="/"
                className="btn btn-main btn-sm rounded-xl px-5 mt-2"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {awaitingReviewItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-base-100 rounded-3xl p-5 border border-base-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-base-200 overflow-hidden shrink-0 border border-base-300 flex items-center justify-center">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <LuPackage className="size-6 text-base-content/40" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-base-content">
                        {item.title}
                      </h4>
                      <p className="text-xs text-base-content/60 mt-0.5">
                        Delivered in Order #{item.orderId?.slice(-6) || "N/A"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenReviewModal(item)}
                    className="btn btn-main btn-sm rounded-xl px-4 text-xs gap-1.5 shrink-0 self-end sm:self-auto"
                  >
                    <LuPenLine className="size-3.5" /> Write Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Native DaisyUI Review Modal */}
      <ReviewModal
        ref={reviewModalRef}
        product={selectedProduct}
        pets={pets}
        onSubmitReview={(data) => createReviewMutation.mutate(data)}
        isLoading={createReviewMutation.isPending}
      />
    </div>
  );
};

export default ReviewsPage;
