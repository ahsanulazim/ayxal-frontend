"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import {
  LuChevronLeft,
  LuChevronRight,
  LuMaximize2,
  LuX,
  LuImageOff,
} from "react-icons/lu";
import Image from "next/image";

export default function ProductGallery({ images, title, discount = 0 }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const mainSwiperRef = useRef(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
      }
      if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, images?.length]);

  if (!images?.length) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-200 bg-zinc-50 text-zinc-400">
        <LuImageOff className="w-12 h-12 mb-2 text-zinc-300" />
        <span className="text-sm font-medium">No product image available</span>
      </div>
    );
  }

  const currentImage = images[activeIndex] || images[0];

  return (
    <div className="self-start w-full">
      {/* Main Showcase Container */}
      <div className="group relative overflow-hidden rounded-3xl border border-zinc-100 bg-zinc-50/70 p-2 sm:p-4 shadow-sm transition-all hover:shadow-md">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-sm tracking-wide">
            -{discount}% OFF
          </div>
        )}

        {/* Zoom Lightbox Trigger */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:scale-110 hover:text-main focus:outline-none"
          title="Click to zoom image"
          aria-label="View larger image"
        >
          <LuMaximize2 className="w-4 h-4" />
        </button>

        <Swiper
          modules={[Thumbs]}
          slidesPerView={1}
          spaceBetween={10}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`}>
              <div
                className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl bg-white flex items-center justify-center p-4"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  width={800}
                  height={800}
                  src={image}
                  alt={`${title} - view ${index + 1}`}
                  priority={index === 0}
                  unoptimized
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Carousel Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => mainSwiperRef.current?.slidePrev()}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md backdrop-blur-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white hover:scale-110 hover:text-main focus:opacity-100"
            >
              <LuChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => mainSwiperRef.current?.slideNext()}
              aria-label="Next image"
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md backdrop-blur-md opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-white hover:scale-110 hover:text-main focus:opacity-100"
            >
              <LuChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Counter Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 z-10 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails Strip */}
      {images.length > 1 && (
        <div className="mt-3">
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Thumbs]}
            freeMode
            watchSlidesProgress
            spaceBetween={10}
            slidesPerView={Math.min(images.length, 5)}
            className="product-thumb-swiper"
          >
            {images.map((image, index) => {
              const isSelected = activeIndex === index;
              return (
                <SwiperSlide key={`thumb-${index}`}>
                  <div
                    className={`aspect-square cursor-pointer overflow-hidden rounded-xl border-2 bg-white p-1 transition-all ${
                      isSelected
                        ? "border-main shadow-sm scale-95"
                        : "border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      width={150}
                      height={150}
                      src={image}
                      alt={`${title} thumb ${index + 1}`}
                      unoptimized
                      className="h-full w-full object-contain rounded-lg"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors focus:outline-none"
              aria-label="Close image preview"
            >
              <LuX className="w-6 h-6" />
            </button>

            {/* Lightbox Main Image */}
            <div className="relative aspect-square max-h-[80vh] w-full bg-white/5 rounded-2xl flex items-center justify-center p-4">
              <img
                src={currentImage}
                alt={title}
                className="max-h-full max-w-full object-contain rounded-xl select-none"
              />
            </div>

            {/* Lightbox Controls */}
            {images.length > 1 && (
              <div className="mt-4 flex items-center gap-4 text-white">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev > 0 ? prev - 1 : images.length - 1
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Previous"
                >
                  <LuChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-medium">
                  {activeIndex + 1} / {images.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) =>
                      prev < images.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Next"
                >
                  <LuChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
