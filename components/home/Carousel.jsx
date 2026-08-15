"use client";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";

const Carousel = () => {
  const { carousels, carouselsLoading, carouselsError } = useContext(MyContext);

  return (
    <Swiper
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Autoplay, Pagination]}
      autoplay={{
        delay: 2000,
        disableOnInteraction: true,
      }}
      loop={true}
      className="mySwiper"
    >
      {carouselsLoading ? (
        <SwiperSlide>Loading...</SwiperSlide>
      ) : carouselsError ? (
        <SwiperSlide>Something went wrong</SwiperSlide>
      ) : carousels.carousels.length > 0 ? (
        carousels.carousels.map((carousel) => (
          <SwiperSlide key={carousel._id}>
            <Image
              width={800}
              height={450}
              alt={carousel.title}
              src={carousel.image.url}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>No carousels found</SwiperSlide>
      )}
    </Swiper>
  );
};

export default Carousel;
