"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { LuTrash2, LuImage, LuCheck, LuUpload } from "react-icons/lu";
import { toast } from "react-toastify";
import api from "@/axios/axiosInstance";
import { useStepperValidation } from "../form/stepperContext";

export default function FormImageDropzone({
  field,
  label = "Upload Image",
  helperText = "",
  multiple = false,
  maxFiles = 10,
  className = "",
  required = false,
}) {
  const { stepErrors, clearFieldError } = useStepperValidation();

  const name = field?.name || "";
  const normalizedName = name.replace(/\[(\d+)\]/g, ".$1");
  const bracketedName = name.replace(/\.(\d+)/g, "[$1]");

  const contextError =
    stepErrors[name] ||
    stepErrors[normalizedName] ||
    stepErrors[bracketedName];

  const tanstackErrors = field?.state?.meta?.errors ?? [];
  const rawError = contextError || tanstackErrors[0];
  const hasError = !!rawError;
  const errorMessage =
    typeof rawError === "string" ? rawError : rawError?.message || "Image is required";

  const [uploading, setUploading] = useState(false);
  const [progresses, setProgresses] = useState({});
  const [deletingId, setDeletingId] = useState(null);

  const value = field?.state?.value;

  // Normalize current images to array of { url, public_id }
  const currentImages = React.useMemo(() => {
    if (!value) return [];
    if (multiple) {
      if (!Array.isArray(value)) return [];
      return value.map((img) =>
        typeof img === "string"
          ? { url: img, public_id: null }
          : { url: img?.url, public_id: img?.public_id },
      );
    }
    return [
      typeof value === "string"
        ? { url: value, public_id: null }
        : { url: value?.url, public_id: value?.public_id },
    ];
  }, [value, multiple]);

  const onDrop = async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    if (multiple && currentImages.length + acceptedFiles.length > maxFiles) {
      toast.error(
        `Maximum ${maxFiles} images allowed. You currently have ${currentImages.length}.`,
      );
      return;
    }

    setUploading(true);
    const initialProgress = {};
    acceptedFiles.forEach((file) => {
      initialProgress[file.name] = 0;
    });
    setProgresses(initialProgress);

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        const response = await api.post("/upload/single", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgresses((prev) => ({
              ...prev,
              [file.name]: percentCompleted,
            }));
          },
        });
        return response.data; // { url, public_id }
      });

      const results = await Promise.all(uploadPromises);

      if (multiple) {
        const existing = Array.isArray(value) ? value : [];
        field?.handleChange([...existing, ...results]);
      } else {
        field?.handleChange(results[0]);
      }
      clearFieldError(name);

      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
      setProgresses({});
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp", ".avif"] },
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading,
  });

  const handleDelete = async (imgObj, index) => {
    if (!imgObj) return;
    try {
      if (imgObj.public_id) {
        setDeletingId(imgObj.public_id);
        await api.post("/upload/delete", { public_id: imgObj.public_id });
      }

      if (multiple) {
        const updated = currentImages.filter((_, i) => i !== index);
        field?.handleChange(updated);
      } else {
        field?.handleChange(null);
      }
      toast.info("Image removed");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to remove image from server");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label py-1.5 flex justify-between items-center text-sm font-semibold text-base-content/90">
          <span>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
          {helperText && (
            <span className="text-xs text-base-content/50 font-normal">
              {helperText}
            </span>
          )}
        </label>
      )}

      {/* Dropzone Container */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center min-h-[160px] ${
          isDragActive
            ? "border-primary bg-primary/10 scale-[0.99]"
            : hasError
              ? "border-error/60 bg-error/5 hover:border-error"
              : "border-base-300 hover:border-primary/50 bg-base-100/60 hover:bg-base-100"
        } ${uploading ? "opacity-75 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} id={field?.name} />

        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
          <LuUpload className="w-6 h-6 animate-pulse" />
        </div>

        <p className="text-sm font-medium text-base-content">
          {isDragActive ? (
            <span className="text-primary font-semibold">
              Drop images here...
            </span>
          ) : (
            <>
              Drag & drop or{" "}
              <span className="text-primary underline font-semibold">
                browse
              </span>
            </>
          )}
        </p>

        <p className="text-xs text-base-content/50 mt-1">
          Supports PNG, JPG, WebP up to 5MB{" "}
          {multiple ? `(Max ${maxFiles} images)` : "(Single image)"}
        </p>
      </div>

      {/* Upload Progress bars */}
      {uploading && Object.keys(progresses).length > 0 && (
        <div className="mt-3 space-y-2">
          {Object.entries(progresses).map(([fileName, progress]) => (
            <div
              key={fileName}
              className="bg-base-200 p-2.5 rounded-lg text-xs"
            >
              <div className="flex justify-between font-medium mb-1">
                <span className="truncate max-w-[200px]">{fileName}</span>
                <span>{progress}%</span>
              </div>
              <progress
                className="progress progress-primary w-full"
                value={progress}
                max="100"
              />
            </div>
          ))}
        </div>
      )}

      {/* Preview Grid */}
      {currentImages.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {currentImages.map((img, idx) => (
            <div
              key={img.public_id || img.url || idx}
              className="group relative aspect-square rounded-xl overflow-hidden border border-base-300 bg-base-200 shadow-sm"
            >
              <Image
                src={img.url}
                alt={`Preview ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />

              {/* Overlay with Delete button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-2">
                <button
                  type="button"
                  disabled={deletingId === img.public_id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(img, idx);
                  }}
                  className="btn btn-error btn-circle btn-sm shadow-md"
                  title="Remove image"
                >
                  {deletingId === img.public_id ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <LuTrash2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {!multiple && (
                <span className="absolute bottom-1.5 left-1.5 bg-primary/90 text-primary-content text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                  Primary
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Validation Error */}
      {hasError && (
        <label className="label py-1">
          <span className="label-text-alt text-error text-xs font-medium flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                fillRule="evenodd"
                d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm-.75-4.25a.75.75 0 0 0 1.5 0V8a.75.75 0 0 0-1.5 0v2.75ZM8 5.75a.875.875 0 1 0 0-1.75.875.875 0 0 0 0 1.75Z"
                clipRule="evenodd"
              />
            </svg>
            {typeof errorMessage === "string"
              ? errorMessage
              : errorMessage?.message || "Image is required"}
          </span>
        </label>
      )}
    </div>
  );
}
