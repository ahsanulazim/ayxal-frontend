import { Controller } from "react-hook-form";
import { useImageUpload } from "../hooks/useImageUpload";
import { LuCloudUpload, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";
import { useState } from "react";
import api from "@/axios/axiosInstance";

const ImageUploadField = ({
  name,
  control,
  label,
  multiple = false,
  boxColor,
}) => {
  const [deletingId, setDeletingId] = useState(null);
  return (
    <Controller
      control={control}
      name={name}
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
          } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to remove image");
          } finally {
            setDeletingId(null);
          }
        };

        return (
          <div>
            <p className="font-medium mb-2 text-sm">{label}</p>
            <div
              className={`grid gap-5 grid-cols-7 ${displayImages.length > 6 ? "grid-rows-2" : ""}`}
            >
              <div
                {...getRootProps({
                  className: `flex items-center justify-center border border-dashed border-gray-300 p-4 rounded cursor-pointer ${boxColor ? boxColor : "bg-base-100"} aspect-square`,
                })}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center ">
                  <LuCloudUpload size={36} />
                  {loading ? (
                    <p className="text-sm font-semibold text-success">
                      Uploading files...
                    </p>
                  ) : (
                    <>
                      <h1 className="text-lg">Drag or Upload</h1>
                      <span className="opacity-50 text-sm">
                        Max File Size 5 MB
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Preview */}
              {displayImages.length > 0 && (
                <div
                  className={`grid grid-cols-6 col-span-6 ${displayImages.length > 6 ? "row-span-2" : ""} gap-5`}
                >
                  {displayImages.map((img, i) => {
                    const isDeleting =
                      img.public_id && deletingId === img.public_id;

                    return (
                      <div key={i} className="relative group aspect-square">
                        <img
                          src={img.url}
                          alt="preview"
                          className={`w-full h-full object-cover rounded border border-gray-300 ${img.isLocal ? "opacity-60" : ""}`}
                        />

                        {/* Uploading progress overlay */}
                        {img.isLocal && (
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-2 rounded">
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
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded">
                            <span className="loading loading-spinner loading-md text-success"></span>
                          </div>
                        ) : (
                          !img.isLocal && (
                            <button
                              type="button"
                              onClick={() => handleDelete(img, i)}
                              className="absolute top-1 right-1 btn btn-sm btn-square btn-error cursor-pointer"
                              title="Delete image"
                            >
                              <LuTrash2 size={14} />
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
              <span className="text-error text-xs block mt-1">
                {error.message}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

export default ImageUploadField;
