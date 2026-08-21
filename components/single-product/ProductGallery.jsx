"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import Image from "next/image";

export default function ProductGallery({ images, title }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  if (!images?.length) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-zinc-100 text-zinc-400">
        No product image
      </div>
    );
  }

  return (
    <div className="self-start">
      <div className="group relative overflow-hidden rounded-box bg-zinc-50">
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
        >
          {images.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`}>
              <div className="aspect-square">
                <Image
                  width={800}
                  height={800}
                  src={image}
                  alt={`${title} ${index + 1}`}
                  className="h-full w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {images.length > 1 && (
          <>
            <button
              onClick={() => mainSwiperRef.current?.slidePrev()}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 btn btn-sm btn-circle"
            >
              <LuChevronLeft />
            </button>

            <button
              onClick={() => mainSwiperRef.current?.slideNext()}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 btn btn-sm btn-circle"
            >
              <LuChevronRight />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[FreeMode, Thumbs]}
          freeMode
          watchSlidesProgress
          spaceBetween={10}
          slidesPerView={5}
          className="mt-4 product-thumb-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={`thumb-${index}`} className="">
              <div className="aspect-square cursor-pointer overflow-hidden rounded-box">
                <Image
                  width={300}
                  height={300}
                  src={image}
                  alt={`${title} ${index + 1} thumbnail`}
                  className="h-full w-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <style jsx global>{`
        .product-thumb-swiper .swiper-slide-thumb-active > div {
          border-color: #059669;
        }
      `}</style>
    </div>
  );
}
