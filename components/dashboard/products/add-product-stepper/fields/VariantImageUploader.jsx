"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { LuUpload, LuTrash2, LuRefreshCw, LuPlus, LuImages, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import api from "@/axios/axiosInstance";

export default function VariantImageUploader({
  thumbnail = null,
  onChangeThumbnail,
  images = [],
  onChangeImages,
  disabled = false,
  variantTitle = "",
}) {
  const [uploading, setUploading] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Normalize thumbnail object
  const thumbObj = React.useMemo(() => {
    if (!thumbnail) return null;
    if (typeof thumbnail === "string") {
      return { url: thumbnail, public_id: null };
    }
    return thumbnail?.url ? thumbnail : null;
  }, [thumbnail]);

  // Upload single image for variant thumbnail
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5MB");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.url) {
        onChangeThumbnail(res.data);
        toast.success("Variant image uploaded!");
      }
    } catch (err) {
      console.error("Variant image upload failed:", err);
      toast.error("Failed to upload variant image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Remove thumbnail
  const handleRemoveThumbnail = async (e) => {
    e.stopPropagation();
    if (!thumbObj) return;

    if (thumbObj.public_id) {
      try {
        await api.post("/upload/delete", { public_id: thumbObj.public_id });
      } catch (err) {
        console.warn("Failed to delete from Cloudinary:", err);
      }
    }
    onChangeThumbnail(null);
  };

  // Upload to gallery
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setGalleryUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await api.post("/upload/single", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
      });

      const results = await Promise.all(uploadPromises);
      const valid = results.filter((r) => r?.url);
      const current = Array.isArray(images) ? images : [];
      if (onChangeImages) {
        onChangeImages([...current, ...valid]);
      }
      toast.success(`${valid.length} gallery image(s) added`);
    } catch (err) {
      console.error("Gallery upload error:", err);
      toast.error("Failed to upload gallery images");
    } finally {
      setGalleryUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  // Remove from gallery
  const handleRemoveGalleryImage = (idxToRemove) => {
    if (!onChangeImages) return;
    const current = Array.isArray(images) ? images : [];
    onChangeImages(current.filter((_, idx) => idx !== idxToRemove));
  };

  return (
    <div className="flex items-center gap-2">
      {/* Hidden file input for thumbnail */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleThumbnailUpload}
        disabled={disabled || uploading}
        className="hidden"
      />

      {/* Main Thumbnail Slot */}
      {thumbObj ? (
        <div className="relative group w-12 h-12 rounded-xl overflow-hidden border border-base-300 shadow-xs flex-shrink-0 bg-base-200">
          <Image
            src={thumbObj.url}
            alt={variantTitle || "Variant thumbnail"}
            fill
            className="object-cover"
            sizes="48px"
          />

          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-10">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Replace image"
              className="p-1 rounded-md bg-base-100/90 text-base-content hover:bg-base-100 transition"
            >
              <LuRefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleRemoveThumbnail}
              title="Remove image"
              className="p-1 rounded-md bg-error/90 text-error-content hover:bg-error transition"
            >
              <LuTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || uploading}
          title="Upload variant image"
          className={`w-12 h-12 rounded-xl border border-dashed border-base-300 hover:border-primary bg-base-200/50 hover:bg-primary/5 flex flex-col items-center justify-center transition-all flex-shrink-0 text-base-content/60 hover:text-primary ${
            uploading ? "opacity-60 cursor-wait" : "cursor-pointer"
          }`}
        >
          {uploading ? (
            <span className="loading loading-spinner loading-xs text-primary" />
          ) : (
            <>
              <LuUpload className="w-4 h-4" />
              <span className="text-[9px] font-semibold mt-0.5 leading-none">Photo</span>
            </>
          )}
        </button>
      )}

      {/* Optional Gallery Trigger */}
      {onChangeImages && (
        <>
          <button
            type="button"
            onClick={() => setShowGalleryModal(true)}
            title="Manage variant gallery photos"
            className={`btn btn-ghost btn-xs px-1.5 h-8 min-h-0 flex items-center gap-1 text-[11px] rounded-lg ${
              Array.isArray(images) && images.length > 0
                ? "text-primary font-bold bg-primary/10"
                : "text-base-content/50 hover:text-base-content"
            }`}
          >
            <LuImages className="w-3.5 h-3.5" />
            {Array.isArray(images) && images.length > 0 ? (
              <span>+{images.length}</span>
            ) : (
              <span className="text-[10px] hidden sm:inline">+More</span>
            )}
          </button>

          {/* Gallery Modal */}
          {showGalleryModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <div className="bg-base-100 rounded-2xl max-w-md w-full p-5 shadow-2xl border border-base-300 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-base-300 pb-3">
                  <div>
                    <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                      <LuImages className="text-primary w-4 h-4" />
                      Variant Photos {variantTitle ? `(${variantTitle})` : ""}
                    </h3>
                    <p className="text-xs text-base-content/60 mt-0.5">
                      Upload supporting angle shots for this specific variant
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGalleryModal(false)}
                    className="btn btn-ghost btn-circle btn-xs"
                  >
                    <LuX className="w-4 h-4" />
                  </button>
                </div>

                {/* Gallery image grid */}
                <div className="grid grid-cols-4 gap-2.5 min-h-[100px]">
                  {(Array.isArray(images) ? images : []).map((img, gIdx) => {
                    const imgUrl = typeof img === "string" ? img : img?.url;
                    return (
                      <div
                        key={gIdx}
                        className="relative w-full aspect-square rounded-xl overflow-hidden border border-base-300 bg-base-200 group"
                      >
                        {imgUrl && (
                          <Image
                            src={imgUrl}
                            alt={`Variant gallery ${gIdx + 1}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(gIdx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-error/90 text-white opacity-0 group-hover:opacity-100 transition z-10"
                        >
                          <LuTrash2 className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Add photo slot */}
                  <input
                    ref={galleryInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryUpload}
                    disabled={galleryUploading}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={galleryUploading}
                    className="w-full aspect-square rounded-xl border-2 border-dashed border-base-300 hover:border-primary flex flex-col items-center justify-center gap-1 text-base-content/60 hover:text-primary transition bg-base-200/40 hover:bg-primary/5"
                  >
                    {galleryUploading ? (
                      <span className="loading loading-spinner loading-xs text-primary" />
                    ) : (
                      <>
                        <LuPlus className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Add</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowGalleryModal(false)}
                    className="btn btn-primary btn-sm rounded-xl px-5"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
