import { Controller } from "react-hook-form";
import { useImageUpload } from "../products/add-product/hooks/useImageUpload";
import { LuCloudUpload, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "@/axios/axiosInstance";

const CarouselUploader = ({ name, control, multiple = false }) => {
  const [deletingId, setDeletingId] = useState(null);

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: "Image is required" }}
      render={({ field, fieldState: { error } }) => {
        const currentCount =
          multiple && Array.isArray(field.value) ? field.value.length : 0;
        const { getInputProps, getRootProps, previews, loading, progresses } =
          useImageUpload(
            (data) => {
              if (multiple) {
                const currentVal = Array.isArray(field.value)
                  ? field.value
                  : [];
                field.onChange([...currentVal, ...data]);
              } else {
                field.onChange(data);
              }
            },
            multiple,
            currentCount,
          );

        // Determine preview images to display
        let uploadedImages = [];
        if (field.value) {
          if (multiple) {
            uploadedImages = Array.isArray(field.value)
              ? field.value.map((img) =>
                  typeof img === "string"
                    ? { url: img, public_id: null }
                    : { url: img?.url, public_id: img?.public_id },
                )
              : [];
          } else {
            const img = field.value;
            if (img) {
              uploadedImages = [
                typeof img === "string"
                  ? { url: img, public_id: null }
                  : { url: img?.url, public_id: img?.public_id },
              ];
            }
          }
        }

        // Combine uploaded images with currently uploading/local previews
        const displayImages = [...uploadedImages, ...(loading ? previews : [])];

        const handleDelete = async (imageObj, index) => {
          try {
            if (imageObj.public_id) {
              setDeletingId(imageObj.public_id);
              await api.post("/upload/delete", {
                public_id: imageObj.public_id,
              });
            }
            if (multiple) {
              const newValue = Array.isArray(field.value)
                ? field.value.filter((_, idx) => idx !== index)
                : [];
              field.onChange(newValue);
            } else {
              field.onChange(null);
            }
            toast.success("Image removed");
          } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to remove image");
          } finally {
            setDeletingId(null);
          }
        };

        return (
          <div className="w-full">
            <div className="grid grid-cols-2 gap-5">
              <div
                {...getRootProps({
                  className: `flex flex-col items-center justify-center border-2 border-dashed border-gray-300 p-6 rounded-lg cursor-pointer bg-base-100 aspect-video hover:border-success transition-all`,
                })}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center text-center">
                  <LuCloudUpload size={40} className="text-gray-400 mb-2" />
                  {loading ? (
                    <p className="text-sm font-semibold text-success">
                      Uploading files...
                    </p>
                  ) : (
                    <>
                      <h3 className="text-sm font-medium">
                        Drag & Drop or Click to upload
                      </h3>
                      <span className="opacity-50 text-xs mt-1">
                        Max File Size 5 MB (PNG, JPG, WEBP)
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Previews */}
              {displayImages.length > 0 && (
                <div className="">
                  {displayImages.map((img, i) => {
                    const isDeleting =
                      img.public_id && deletingId === img.public_id;

                    return (
                      <div
                        key={i}
                        className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200 bg-base-200"
                      >
                        <img
                          src={img.url}
                          alt="carousel preview"
                          className={`w-full h-full object-cover ${
                            img.isLocal ? "opacity-60" : ""
                          }`}
                        />

                        {/* Uploading progress overlay */}
                        {img.isLocal && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
                            <span className="text-xs font-semibold text-white mb-1">
                              {progresses[img.name] || 0}%
                            </span>
                            <progress
                              className="progress progress-success w-full h-1"
                              value={progresses[img.name] || 0}
                              max="100"
                            ></progress>
                          </div>
                        )}

                        {/* Deleting spinner overlay */}
                        {isDeleting ? (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="loading loading-spinner loading-md text-success"></span>
                          </div>
                        ) : (
                          !img.isLocal && (
                            <button
                              type="button"
                              onClick={() => handleDelete(img, i)}
                              className="absolute top-2 right-2 btn btn-xs btn-square btn-error shadow hover:scale-105 transition-transform"
                              title="Delete image"
                            >
                              <LuTrash2 size={12} />
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {error && (
              <span className="text-error text-xs block mt-2">
                {error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

export default CarouselUploader;
