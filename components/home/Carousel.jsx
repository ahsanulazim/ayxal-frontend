"use client";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// Import required modules
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";

const Carousel = () => {
  const { carousels, carouselsLoading, carouselsError } = useContext(MyContext);

  const rawList = carousels?.carousels || [];
  // Filter active banners only and sort by order
  const activeCarousels = rawList
    .filter((c) => c.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (carouselsLoading) {
    return <div className="skeleton w-full h-72 md:h-80 lg:h-96 rounded-md"></div>;
  }

  if (carouselsError) {
    return (
      <div className="w-full h-72 md:h-80 lg:h-96 rounded-md bg-base-200 flex items-center justify-center text-error text-sm">
        Failed to load banners
      </div>
    );
  }

  if (activeCarousels.length === 0) {
    return (
      <div className="w-full h-72 md:h-80 lg:h-96 rounded-md bg-base-200 flex items-center justify-center text-base-content/50 text-sm">
        No active banners
      </div>
    );
  }

  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      loop={activeCarousels.length > 1}
      className="mySwiper w-full h-72 md:h-80 lg:h-96 rounded-md overflow-hidden"
    >
      {activeCarousels.map((carousel, index) => {
        const hasLink = Boolean(carousel.link?.trim());
        const Wrapper = hasLink ? Link : "div";
        const wrapperProps = hasLink
          ? {
              href: carousel.link,
              target: carousel.openInNewTab ? "_blank" : "_self",
              rel: carousel.openInNewTab ? "noopener noreferrer" : undefined,
            }
          : {};

        return (
          <SwiperSlide key={carousel._id || index} className="relative w-full h-full">
            <Wrapper
              {...wrapperProps}
              className={`block relative w-full h-full select-none ${
                hasLink ? "cursor-pointer group" : ""
              }`}
            >
              <Image
                src={carousel.image?.url || ""}
                alt={carousel.title || "Promotional banner"}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 850px"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Optional Text Overlay if subtitle exists */}
              {carousel.subtitle && (
                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 z-10 bg-black/40 backdrop-blur-xs text-white px-4 py-2 rounded-lg max-w-md pointer-events-none">
                  <h3 className="font-bold text-base md:text-lg line-clamp-1">
                    {carousel.title}
                  </h3>
                  <p className="text-xs md:text-sm text-white/90 line-clamp-1">
                    {carousel.subtitle}
                  </p>
                </div>
              )}
            </Wrapper>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Carousel;
