"use client";
import { getCarousels, uploadCarousel } from "@/api/carouselApi";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CarouselCard from "@/components/dashboard/carousel/CarouselCard";
import CarouselUploader from "@/components/dashboard/carousel/CarouselUploader";
import { MyContext } from "@/context/MyProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { LuLink, LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";

const page = () => {
  const { carousels, carouselsLoading, carouselsError } = useContext(MyContext);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: uploadCarousel,
    onSuccess: () => {
      reset();
      toast.success("Carousel Added");
      queryClient.invalidateQueries({ queryKey: ["carousels"] });
    },
    onError: (error) => {
      toast.error("Carousel cannot be added");
      console.log(error);
    },
  });

  return (
    <>
      <Breadcrumbs title="Carousel" />
      <section className="mb-5">
        <div className="flex justify-between items-center gap-5">
          <h2 className="font-bold text-2xl w-1/2">Carousel</h2>
        </div>
      </section>
      <section>
        <div className="w-full max-w-3xl mx-auto bg-base-300 rounded-md p-5">
          <form className="fieldset" onSubmit={handleSubmit(onSubmit)}>
            <h2 className="text-xl font-bold text-main">
              Upload image for carousel
            </h2>
            <label htmlFor="title" className="label">
              Carousel Title
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="Exclusive deals"
              {...register("title", { required: "Title is required" })}
            />
            {errors?.title && (
              <span className="text-error text-xs">{errors.title.message}</span>
            )}
            <label htmlFor="link" className="label">
              Page link
            </label>
            <label className="input w-full">
              <LuLink className="h-[1em] opacity-50" />
              <input
                type="url"
                placeholder="https://"
                {...register("link", {
                  required: "Link is required",
                  pattern: {
                    value:
                      /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$/,
                    message: "Must be valid URL",
                  },
                })}
              />
            </label>
            {errors?.link && (
              <span className="text-error text-xs">{errors.link.message}</span>
            )}
            <label htmlFor="image" className="label">
              Choose an image for carousel (PNG, JPG, WEBP)
            </label>
            <CarouselUploader name="image" control={control} />
            <button
              className="btn btn-success mt-4"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <LuUpload /> Upload
                </>
              )}
            </button>
          </form>
        </div>
      </section>
      <section className="mt-5">
        <div className="grid grid-cols-5 gap-5">
          {carouselsLoading ? (
            <p>Loading...</p>
          ) : carouselsError ? (
            <p>Something went wrong</p>
          ) : carousels.carousels.length > 0 ? (
            carousels.carousels.map((carousel) => (
              <CarouselCard key={carousel._id} carousel={carousel} />
            ))
          ) : (
            <p>No carousels found</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
