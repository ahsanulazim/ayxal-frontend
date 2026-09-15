"use client";
import { getCarousels } from "@/api/carouselApi";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CarouselAddModal from "@/components/dashboard/carousel/CarouselAddModal";
import CarouselCard from "@/components/dashboard/carousel/CarouselCard";
import CarouselDeleteModal from "@/components/dashboard/carousel/CarouselDeleteModal";
import CarouselEditModal from "@/components/dashboard/carousel/CarouselEditModal";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { LuImage, LuPlus } from "react-icons/lu";

const CarouselDashboardPage = () => {
  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [selectedForEdit, setSelectedForEdit] = useState(null);
  const bannerAddRef = useRef();

  // Fetch all carousels for the dashboard
  const {
    data: carouselData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["carousels"],
    queryFn: () => getCarousels(),
  });

  const carousels = carouselData?.carousels || [];

  return (
    <>
      <Breadcrumbs title="Carousel" />

      {/* Header Bar */}
      <section className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-base-100 p-5 rounded-xl border border-base-200 shadow-sm">
          <div>
            <h2 className="font-bold text-2xl text-base-content flex items-center gap-2">
              <LuImage className="text-primary" /> Hero Carousel Banners
            </h2>
            <p className="text-sm text-base-content/70 mt-1">
              Manage promotional hero banners, destination links, and display
              order for your homepage.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary gap-2 shadow-sm"
            onClick={() => bannerAddRef.current.showModal()}
          >
            <LuPlus size={18} />
            Add New Banner
          </button>
        </div>
      </section>

      {/* Carousels List Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-base-content">
            Active & Draft Banners ({carousels.length})
          </h3>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-base-100 rounded-xl p-4 border border-base-200 shadow-sm space-y-3"
              >
                <div className="skeleton aspect-video w-full rounded-lg"></div>
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-3 w-1/2"></div>
                <div className="skeleton h-8 w-full"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="alert alert-error">
            <span>
              Failed to load carousel banners. Please check your network or
              server.
            </span>
          </div>
        ) : carousels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {carousels.map((carousel) => (
              <CarouselCard
                key={carousel._id}
                carousel={carousel}
                onEdit={(c) => setSelectedForEdit(c)}
                onDelete={(c) => setSelectedForDelete(c)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-base-100 rounded-2xl border border-dashed border-base-300">
            <LuImage className="mx-auto text-base-content/30 mb-3" size={48} />
            <h4 className="font-semibold text-lg text-base-content">
              No Carousel Banners Found
            </h4>
            <p className="text-sm text-base-content/60 max-w-sm mx-auto mt-1 mb-5">
              You haven&apos;t added any homepage promotional banners yet. Click
              the button below to publish your first banner!
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm gap-2"
              onClick={() => setIsAddOpen(true)}
            >
              <LuPlus size={16} /> Add Your First Banner
            </button>
          </div>
        )}
      </section>

      {/* Add New Banner Modal */}
      <CarouselAddModal ref={bannerAddRef} />

      {/* Delete Confirmation Modal */}
      <CarouselDeleteModal
        isOpen={Boolean(selectedForDelete)}
        carousel={selectedForDelete}
        onClose={() => setSelectedForDelete(null)}
      />

      {/* Edit Banner Modal */}
      <CarouselEditModal
        isOpen={Boolean(selectedForEdit)}
        carousel={selectedForEdit}
        onClose={() => setSelectedForEdit(null)}
      />
    </>
  );
};

export default CarouselDashboardPage;
