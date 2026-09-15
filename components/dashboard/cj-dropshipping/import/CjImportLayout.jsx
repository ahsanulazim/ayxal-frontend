"use client";

import React, { useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { importProductToStore } from "@/api/cjDropshipApi";
import { toast } from "react-toastify";
import Link from "next/link";

const ClientSideEditor = dynamic(() => import("@/components/form/CKEditorField"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-base-200/50 animate-pulse rounded-xl border border-base-200 flex items-center justify-center text-xs text-base-content/40">
      Loading Rich Text Editor...
    </div>
  ),
});
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import {
  LuArrowLeft,
  LuBoxes,
  LuCheck,
  LuChevronLeft,
  LuChevronRight,
  LuCode,
  LuCopy,
  LuDollarSign,
  LuExternalLink,
  LuEye,
  LuFileText,
  LuImage,
  LuInfo,
  LuPackage,
  LuPenLine,
  LuSparkles,
  LuTrendingUp,
  LuWeight,
} from "react-icons/lu";

export default function CjImportLayout({ cjData }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const rawProduct = cjData?.product || {};
  const categories = cjData?.storeOptions?.categories || [];
  const brands = cjData?.storeOptions?.brands || [];
  const isAlreadyImported = Boolean(cjData?.isImported);

  // Swiper State
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  // Media Selection State
  const allImages = useMemo(() => {
    return rawProduct.images && rawProduct.images.length > 0
      ? rawProduct.images
      : rawProduct.thumbnail
        ? [rawProduct.thumbnail]
        : [];
  }, [rawProduct]);

  const [selectedThumbnail, setSelectedThumbnail] = useState(
    rawProduct.thumbnail || allImages[0] || ""
  );
  const [selectedImages, setSelectedImages] = useState(allImages);

  // Variants State
  const initialVariants = useMemo(() => {
    return (rawProduct.variants || []).map((v) => ({
      ...v,
      price:
        v.suggestedPrice > 0
          ? v.suggestedPrice
          : v.price || Number(((v.costPrice || 5) * 2).toFixed(2)),
      weight: v.weight !== undefined ? v.weight : rawProduct.weight || 0,
      isActive: true,
    }));
  }, [rawProduct.variants, rawProduct.weight]);

  const [variants, setVariants] = useState(initialVariants);

  // React Hook Form Initialization
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: rawProduct.title || "",
      category:
        categories.length > 0 ? categories[0].slug || categories[0].name : "",
      brand: "",
      noBrand: true,
      status: "active",
      description: rawProduct.description || "",
    },
  });

  const watchedTitle = watch("title");
  const watchedNoBrand = watch("noBrand");
  const watchedCategory = watch("category");
  const watchedDescription = watch("description");

  // Description Mode State ("rich" | "code" | "preview")
  const [descEditorMode, setDescEditorMode] = useState("rich");

  // Copied State for PID
  const [copiedPid, setCopiedPid] = useState(false);

  // Weight Range Display Calculation
  const displayWeight = useMemo(() => {
    const weights = variants
      .map((v) => parseFloat(v.weight) || 0)
      .filter((w) => w > 0);
    if (weights.length > 0) {
      const minW = Math.min(...weights);
      const maxW = Math.max(...weights);
      return minW === maxW ? `${minW}g` : `${minW}g - ${maxW}g`;
    }
    if (rawProduct?.weightDisplay) {
      return rawProduct.weightDisplay.includes("g")
        ? rawProduct.weightDisplay
        : `${rawProduct.weightDisplay}g`;
    }
    if (rawProduct?.packingWeight && String(rawProduct.packingWeight).includes("-")) {
      return `${rawProduct.packingWeight}g`;
    }
    return `${rawProduct?.weight || 0}g`;
  }, [variants, rawProduct]);

  // Pricing calculations
  const activeVariants = variants.filter((v) => v.isActive);
  const minCost = variants.length > 0 ? Math.min(...variants.map((v) => v.costPrice || 0)) : 0;
  const maxCost = variants.length > 0 ? Math.max(...variants.map((v) => v.costPrice || 0)) : 0;

  const minSellingPrice =
    activeVariants.length > 0
      ? Math.min(...activeVariants.map((v) => parseFloat(v.price) || 0))
      : 0;

  const avgProfit =
    activeVariants.length > 0
      ? (
          activeVariants.reduce(
            (sum, v) => sum + ((parseFloat(v.price) || 0) - (v.costPrice || 0)),
            0
          ) / activeVariants.length
        ).toFixed(2)
      : 0;

  // 1-Click Auto Clean Title
  const handleCleanTitle = () => {
    let clean = (watchedTitle || "")
      .replace(/\b(hot sale|2024|2025|2026|new|fashion|top quality|dropshipping|wholesale)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    if (clean) {
      setValue("title", clean.charAt(0).toUpperCase() + clean.slice(1));
      toast.info("Title cleaned!");
    }
  };

  // Bulk Markup Calculator Helpers
  const applyMarkupMultiplier = (multiplier) => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        price: Number(((v.costPrice || 1) * multiplier).toFixed(2)),
      }))
    );
    toast.success(`Applied ${multiplier}x markup to all variants!`);
  };

  const applyFlatMarkup = (addition) => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        price: Number(((v.costPrice || 0) + addition).toFixed(2)),
      }))
    );
    toast.success(`Added $${addition} to all variants!`);
  };

  const applyCjSuggestedPrice = () => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        price:
          v.suggestedPrice > 0
            ? v.suggestedPrice
            : Number(((v.costPrice || 1) * 2).toFixed(2)),
      }))
    );
    toast.success("Applied CJ suggested retail prices!");
  };

  // Toggle image inclusion in gallery
  const toggleImageSelection = (imgUrl) => {
    if (selectedImages.includes(imgUrl)) {
      if (selectedImages.length === 1) {
        toast.warning("You need at least 1 image for the product");
        return;
      }
      setSelectedImages((prev) => prev.filter((url) => url !== imgUrl));
      if (selectedThumbnail === imgUrl) {
        setSelectedThumbnail(selectedImages.find((u) => u !== imgUrl));
      }
    } else {
      setSelectedImages((prev) => [...prev, imgUrl]);
    }
  };

  // Update specific variant price
  const handleVariantPriceChange = (vid, newPrice) => {
    setVariants((prev) =>
      prev.map((v) => (v.vid === vid ? { ...v, price: parseFloat(newPrice) || 0 } : v))
    );
  };

  // Update specific variant weight
  const handleVariantWeightChange = (vid, newWeight) => {
    setVariants((prev) =>
      prev.map((v) => (v.vid === vid ? { ...v, weight: parseFloat(newWeight) || 0 } : v))
    );
  };

  // Toggle variant active state
  const handleVariantToggle = (vid) => {
    setVariants((prev) =>
      prev.map((v) => (v.vid === vid ? { ...v, isActive: !v.isActive } : v))
    );
  };

  // Copy PID to clipboard
  const copyPid = () => {
    navigator.clipboard.writeText(rawProduct.pid);
    setCopiedPid(true);
    setTimeout(() => setCopiedPid(false), 2000);
  };

  // Import Mutation
  const importMutation = useMutation({
    mutationFn: importProductToStore,
    onSuccess: (res) => {
      toast.success(res.message || "Product imported successfully!");
      queryClient.invalidateQueries({ queryKey: ["cjImportList"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/dashboard/products-v2");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Failed to import product");
    },
  });

  // React Hook Form Submit Handler
  const onSubmit = (formData) => {
    if (activeVariants.length === 0) {
      toast.error("Please keep at least one variant active to sell");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      brand: formData.noBrand ? null : formData.brand,
      noBrand: formData.noBrand,
      status: formData.status,
      cjProductId: rawProduct.pid,
      cjProductSku: rawProduct.cjProductSku,
      costPrice: minCost,
      basePrice: minSellingPrice,
      thumbnail: selectedThumbnail,
      images: selectedImages,
      description: formData.description,
      weight: rawProduct.weight,
      variants: activeVariants,
    };

    importMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/cj-dropshipping"
            className="btn btn-circle btn-sm btn-ghost border border-base-200"
            title="Back to CJ Shortlist"
          >
            <LuArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Import & Customize Product</h1>
              <span className="badge badge-sm badge-primary badge-soft font-semibold">
                CJ Sourced
              </span>
              {isAlreadyImported && (
                <span className="badge badge-sm badge-success gap-1 font-semibold">
                  <LuCheck className="size-3" /> Already In Store
                </span>
              )}
            </div>
            <p className="text-xs text-base-content/60">
              Review supplier specifications with Swiper media gallery and customize your store listing with React Hook Form.
            </p>
          </div>
        </div>

        <a
          href={`https://cjdropshipping.com/product/-p-${rawProduct.pid}.html`}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sm btn-ghost gap-1 text-xs"
        >
          View on CJ.com <LuExternalLink className="size-3" />
        </a>
      </div>

      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Floating Supplier Reference Panel with Swiper */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 lg:sticky lg:top-4 space-y-4">
          <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-base-200/60 p-3.5 border-b border-base-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-base-content/80">
                <LuInfo className="size-4 text-primary" />
                <span>Supplier Media & Specs</span>
              </div>
              <button
                type="button"
                onClick={copyPid}
                className="btn btn-ghost btn-xs gap-1 font-mono text-[11px]"
                title="Copy CJ Product ID"
              >
                {copiedPid ? <LuCheck className="size-3 text-success" /> : <LuCopy className="size-3" />}
                PID: {rawProduct.pid}
              </button>
            </div>

            {/* Swiper Media Gallery */}
            <div className="p-4 space-y-3">
              {allImages.length > 0 ? (
                <div className="space-y-2">
                  {/* Main Carousel Swiper */}
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-base-200 border border-base-200 group">
                    <Swiper
                      modules={[Thumbs]}
                      slidesPerView={1}
                      spaceBetween={8}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                      }}
                      onSwiper={(swiper) => {
                        mainSwiperRef.current = swiper;
                      }}
                      className="size-full"
                    >
                      {allImages.map((img, index) => (
                        <SwiperSlide key={`main-${index}`}>
                          <div className="size-full relative">
                            <img
                              src={img}
                              alt={`${rawProduct.title} ${index + 1}`}
                              className="size-full object-cover"
                            />
                            {/* Make Thumbnail button overlay */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedThumbnail(img);
                                toast.info("Set as main thumbnail!");
                              }}
                              className={`absolute bottom-2 left-2 badge badge-sm border-0 font-medium transition-all ${
                                selectedThumbnail === img
                                  ? "badge-primary text-white"
                                  : "bg-black/60 text-white hover:bg-primary"
                              }`}
                            >
                              {selectedThumbnail === img ? "✓ Main Thumbnail" : "Set Main Thumbnail"}
                            </button>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {/* Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => mainSwiperRef.current?.slidePrev()}
                          className="absolute left-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-base-100/90 shadow flex items-center justify-center text-base-content/80 hover:text-primary z-10 transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <LuChevronLeft className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => mainSwiperRef.current?.slideNext()}
                          className="absolute right-2 top-1/2 -translate-y-1/2 size-7 rounded-full bg-base-100/90 shadow flex items-center justify-center text-base-content/80 hover:text-primary z-10 transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <LuChevronRight className="size-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip Swiper */}
                  {allImages.length > 1 && (
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      modules={[FreeMode, Thumbs]}
                      watchSlidesProgress
                      slidesPerView={5}
                      spaceBetween={6}
                      freeMode
                      className="thumbs-swiper"
                    >
                      {allImages.map((img, index) => (
                        <SwiperSlide key={`thumb-${index}`} className="cursor-pointer">
                          <div
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selectedThumbnail === img
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-base-200 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img src={img} alt="" className="size-full object-cover" />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              ) : (
                <div className="aspect-square rounded-xl bg-base-200 flex items-center justify-center text-base-content/40 text-xs">
                  No images available
                </div>
              )}

              {/* Supplier Key Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-lg bg-base-200/50 border border-base-200">
                  <span className="text-base-content/50 block text-[10px] uppercase font-semibold">
                    Supplier Cost
                  </span>
                  <span className="font-bold text-base-content text-sm">
                    ${minCost === maxCost ? minCost : `${minCost} - $${maxCost}`}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-base-200/50 border border-base-200">
                  <span className="text-base-content/50 block text-[10px] uppercase font-semibold">
                    Package Weight
                  </span>
                  <span className="font-bold text-base-content text-sm flex items-center gap-1">
                    <LuWeight className="size-3.5 text-base-content/60" />
                    {displayWeight}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-base-200/50 border border-base-200 col-span-2">
                  <span className="text-base-content/50 block text-[10px] uppercase font-semibold">
                    Warehouse Inventory
                  </span>
                  <span className="font-semibold text-base-content flex items-center gap-1.5">
                    <LuBoxes className="size-3.5 text-primary" />
                    {rawProduct.warehouseInventory > 0
                      ? `${rawProduct.warehouseInventory.toLocaleString()} units in CJ Warehouse`
                      : `${variants.reduce((s, v) => s + (v.stock || 0), 0).toLocaleString()} units available`}
                  </span>
                </div>
              </div>

              {/* Original Title Reference */}
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-wider text-base-content/50 font-bold block mb-1">
                  Original Title (CJ)
                </span>
                <p className="text-xs text-base-content/70 italic bg-base-200/40 p-2.5 rounded-lg border border-base-200 line-clamp-3">
                  &ldquo;{rawProduct.originalTitle}&rdquo;
                </p>
              </div>

              {/* Original Description Reference */}
              {rawProduct.description && (
                <div className="pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-base-content/50 font-bold block mb-1">
                    Supplier Description (CJ)
                  </span>
                  <div className="bg-base-200/40 rounded-xl p-3 border border-base-200 max-h-56 overflow-y-auto text-xs prose prose-xs max-w-none text-base-content/80">
                    <div dangerouslySetInnerHTML={{ __html: rawProduct.description }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: React Hook Form Customizer                  */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 1: Listing Information */}
            <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-base-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="font-bold text-base">Store Listing Information</h2>
                </div>
                <button
                  type="button"
                  onClick={handleCleanTitle}
                  className="btn btn-xs btn-outline btn-primary gap-1"
                  title="Remove spam and promotional keywords"
                >
                  <LuSparkles className="size-3" /> Auto-Clean Title
                </button>
              </div>

              {/* Title Field with React Hook Form */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-base-content">
                  Product Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Product title is required",
                    minLength: { value: 3, message: "Title must be at least 3 characters" },
                  })}
                  placeholder="Enter clean, customer-facing product title"
                  className={`input input-bordered w-full text-sm font-medium focus:input-primary ${
                    errors.title ? "input-error" : ""
                  }`}
                />
                {errors.title && (
                  <span className="text-[11px] text-error">{errors.title.message}</span>
                )}
              </div>

              {/* Category, Brand, Status Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Category Dropdown with React Hook Form */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content">
                    Store Category <span className="text-error">*</span>
                  </label>
                  <select
                    {...register("category", { required: "Store category is required" })}
                    className={`select select-bordered w-full text-sm focus:select-primary ${
                      errors.category ? "select-error" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.slug || cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <span className="text-[11px] text-error">{errors.category.message}</span>
                  )}
                </div>

                {/* Brand with React Hook Form */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content flex items-center justify-between">
                    <span>Brand</span>
                    <label className="label cursor-pointer p-0 gap-1">
                      <span className="text-[11px] text-base-content/60">Generic / No Brand</span>
                      <input
                        type="checkbox"
                        {...register("noBrand")}
                        className="checkbox checkbox-xs checkbox-primary"
                      />
                    </label>
                  </label>
                  <select
                    disabled={watchedNoBrand}
                    {...register("brand")}
                    className="select select-bordered w-full text-sm focus:select-primary disabled:opacity-50"
                  >
                    <option value="">None / Custom</option>
                    {brands.map((b) => (
                      <option key={b._id} value={b.name || b.value}>
                        {b.name || b.value}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Store Status with React Hook Form */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content">
                    Initial Status
                  </label>
                  <select
                    {...register("status")}
                    className="select select-bordered w-full text-sm focus:select-primary"
                  >
                    <option value="active">Active (Visible immediately)</option>
                    <option value="draft">Draft (Hidden in store)</option>
                  </select>
                </div>
              </div>

              {/* Product Description with CKEditor Rich Text Editor */}
              <div className="space-y-2 pt-2 border-t border-base-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-base-content flex items-center gap-1.5">
                    <LuFileText className="size-3.5 text-primary" />
                    Product Description (Rich Text)
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setDescEditorMode("rich")}
                      className={`btn btn-xs ${
                        descEditorMode === "rich"
                          ? "btn-primary font-semibold shadow-xs"
                          : "btn-ghost text-base-content/60"
                      } gap-1`}
                    >
                      <LuPenLine className="size-3" /> Rich Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescEditorMode("code")}
                      className={`btn btn-xs ${
                        descEditorMode === "code"
                          ? "btn-primary font-semibold shadow-xs"
                          : "btn-ghost text-base-content/60"
                      } gap-1`}
                    >
                      <LuCode className="size-3" /> HTML Code
                    </button>
                    <button
                      type="button"
                      onClick={() => setDescEditorMode("preview")}
                      className={`btn btn-xs ${
                        descEditorMode === "preview"
                          ? "btn-primary font-semibold shadow-xs"
                          : "btn-ghost text-base-content/60"
                      } gap-1`}
                    >
                      <LuEye className="size-3" /> Live Preview
                    </button>
                  </div>
                </div>

                {descEditorMode === "rich" && (
                  <div className="rounded-xl overflow-hidden border border-base-200 bg-base-100 text-neutral-900 shadow-xs">
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <ClientSideEditor
                          id="cj-import-description-editor"
                          value={field.value || ""}
                          onChange={(data) => field.onChange(data)}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                  </div>
                )}

                {descEditorMode === "code" && (
                  <textarea
                    rows={10}
                    {...register("description")}
                    placeholder="Enter detailed HTML or plain text description..."
                    className="textarea textarea-bordered w-full text-xs font-mono leading-relaxed focus:textarea-primary"
                  />
                )}

                {descEditorMode === "preview" && (
                  <div className="p-4 rounded-xl bg-base-200/40 border border-base-200 min-h-[200px] max-h-96 overflow-y-auto text-xs prose prose-sm max-w-none text-base-content/90">
                    {watchedDescription ? (
                      <div dangerouslySetInnerHTML={{ __html: watchedDescription }} />
                    ) : (
                      <span className="text-base-content/40 italic">
                        No description provided yet.
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-base-content/50">
                  <span>
                    Powered by CKEditor 5. Easily format headings, lists, bold text, and images.
                  </span>
                  {rawProduct.description && (
                    <button
                      type="button"
                      onClick={() => setValue("description", rawProduct.description)}
                      className="text-primary hover:underline font-medium"
                    >
                      Reset to CJ Original
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Pricing Strategy & Profit Calculator */}
            <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-base-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-bold text-base">Pricing Strategy & Profit Margin</h2>
                </div>
                <span className="text-xs text-base-content/60 flex items-center gap-1">
                  <LuDollarSign className="size-3.5 text-success" /> Live Profit Calculation
                </span>
              </div>

              {/* Quick Bulk Pricing Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-base-content/70 block">
                  Quick Bulk Markup Rules:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyMarkupMultiplier(2)}
                    className="btn btn-xs btn-soft btn-primary font-medium"
                  >
                    2.0x Cost
                  </button>
                  {rawProduct.suggestedSellPrice && (
                    <button
                      type="button"
                      onClick={applyCjSuggestedPrice}
                      className="btn btn-xs btn-soft btn-secondary font-medium"
                      title="Use supplier suggested retail price"
                    >
                      Use CJ Suggested Price (${rawProduct.suggestedSellPrice})
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => applyMarkupMultiplier(2.5)}
                    className="btn btn-xs btn-soft btn-primary font-medium"
                  >
                    2.5x Cost
                  </button>
                  <button
                    type="button"
                    onClick={() => applyMarkupMultiplier(3)}
                    className="btn btn-xs btn-soft btn-primary font-medium"
                  >
                    3.0x Cost
                  </button>
                  <span className="text-base-content/30">|</span>
                  <button
                    type="button"
                    onClick={() => applyFlatMarkup(10)}
                    className="btn btn-xs btn-soft font-medium"
                  >
                    +$10 Profit
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFlatMarkup(15)}
                    className="btn btn-xs btn-soft font-medium"
                  >
                    +$15 Profit
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFlatMarkup(20)}
                    className="btn btn-xs btn-soft font-medium"
                  >
                    +$20 Profit
                  </button>
                </div>
              </div>

              {/* Pricing Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                <div className="bg-base-200/40 border border-base-200 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-base-content/50 block">
                    Supplier Cost
                  </span>
                  <span className="text-base font-bold text-base-content">
                    ${minCost.toFixed(2)}
                  </span>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-primary block">
                    Your Selling Price
                  </span>
                  <span className="text-base font-bold text-primary">
                    ${minSellingPrice.toFixed(2)}
                  </span>
                </div>

                <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-success block">
                    Avg Estimated Profit
                  </span>
                  <span className="text-base font-bold text-success flex items-center justify-center gap-0.5">
                    <LuTrendingUp className="size-4" />+${avgProfit}
                  </span>
                </div>

                <div className="bg-base-200/40 border border-base-200 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-base-content/50 block">
                    Active Variants
                  </span>
                  <span className="text-base font-bold text-base-content">
                    {activeVariants.length} of {variants.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3: Variants Checklist & Overrides */}
            <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-base-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="font-bold text-base">Select & Customize Variants</h2>
                </div>
                <div className="text-xs text-base-content/60">
                  Select variants to sell and adjust individual prices
                </div>
              </div>

              {/* Variants Table */}
              <div className="overflow-x-auto rounded-xl border border-base-200">
                <table className="table table-sm w-full">
                  <thead className="bg-base-200/70 text-xs text-base-content/70">
                    <tr>
                      <th className="w-10 text-center">Sell?</th>
                      <th>Variant Preview</th>
                      <th>CJ Supplier Cost</th>
                      <th>Your Retail Price ($)</th>
                      <th>Estimated Profit</th>
                      <th>Weight (g)</th>
                      <th>Warehouse Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v) => {
                      const cost = v.costPrice || 0;
                      const retail = parseFloat(v.price) || 0;
                      const profit = (retail - cost).toFixed(2);
                      const marginPercent = retail > 0 ? Math.round(((retail - cost) / retail) * 100) : 0;

                      return (
                        <tr
                          key={v.vid}
                          className={`transition-colors ${
                            v.isActive ? "hover:bg-base-200/30" : "opacity-40 bg-base-200/20"
                          }`}
                        >
                          <td className="text-center">
                            <input
                              type="checkbox"
                              checked={v.isActive}
                              onChange={() => handleVariantToggle(v.vid)}
                              className="checkbox checkbox-sm checkbox-primary"
                            />
                          </td>
                          <td>
                            <div className="flex items-center gap-2.5">
                              <div className="avatar">
                                <div className="size-9 rounded-lg bg-base-200 border border-base-200 overflow-hidden">
                                  <img src={v.variantImage} alt="" className="object-cover" />
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-xs text-base-content block">
                                  {v.variantKey}
                                </span>
                                <span className="text-[10px] font-mono text-base-content/50">
                                  SKU: {v.variantSku}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="font-medium text-xs text-base-content/80">
                              ${cost.toFixed(2)}
                            </span>
                          </td>
                          <td>
                            <div className="relative w-28">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-base-content/50">
                                $
                              </span>
                              <input
                                type="number"
                                step="0.01"
                                min={cost}
                                disabled={!v.isActive}
                                value={v.price}
                                onChange={(e) => handleVariantPriceChange(v.vid, e.target.value)}
                                className="input input-xs input-bordered w-full pl-6 text-xs font-semibold focus:input-primary"
                              />
                            </div>
                          </td>
                          <td>
                            {retail > cost ? (
                              <span className="badge badge-sm badge-success badge-soft font-semibold text-[11px] gap-1">
                                +${profit} ({marginPercent}%)
                              </span>
                            ) : (
                              <span className="badge badge-sm badge-warning badge-soft font-semibold text-[11px]">
                                No Profit
                              </span>
                            )}
                          </td>
                          <td>
                            <div className="relative w-24">
                              <input
                                type="number"
                                step="1"
                                min="0"
                                disabled={!v.isActive}
                                value={v.weight !== undefined ? v.weight : ""}
                                onChange={(e) => handleVariantWeightChange(v.vid, e.target.value)}
                                className="input input-xs input-bordered w-full pr-6 text-xs font-semibold focus:input-primary"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-base-content/50 pointer-events-none">
                                g
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="text-xs text-base-content/70 font-mono">
                              {v.stock > 0 ? `${Number(v.stock).toLocaleString()} units` : "Out of stock"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Image Selector */}
            <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-base-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h2 className="font-bold text-base">Store Gallery Images</h2>
                </div>
                <span className="text-xs text-base-content/60">
                  {selectedImages.length} images selected for storefront
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {allImages.map((img, idx) => {
                  const isSelected = selectedImages.includes(img);
                  const isThumb = selectedThumbnail === img;

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleImageSelection(img)}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        isSelected
                          ? "border-primary shadow-sm ring-2 ring-primary/20"
                          : "border-base-200 opacity-40 hover:opacity-80"
                      }`}
                    >
                      <img src={img} alt="" className="size-full object-cover" />

                      {/* Selection Pill */}
                      <div className="absolute top-1.5 right-1.5">
                        <div
                          className={`size-5 rounded-full flex items-center justify-center text-[10px] ${
                            isSelected ? "bg-primary text-white" : "bg-black/40 text-white"
                          }`}
                        >
                          {isSelected && <LuCheck className="size-3" />}
                        </div>
                      </div>

                      {/* Set as Main Thumbnail button */}
                      {isSelected && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedThumbnail(img);
                            toast.info("Set as main thumbnail!");
                          }}
                          className={`absolute bottom-1.5 left-1.5 right-1.5 text-[9px] py-0.5 rounded font-medium text-center transition-opacity ${
                            isThumb
                              ? "bg-primary text-white"
                              : "bg-black/60 text-white opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {isThumb ? "Main Thumbnail" : "Make Thumbnail"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Fixed Action Bar */}
            <div className="sticky bottom-4 z-20 bg-base-100/90 backdrop-blur-md border border-base-200 shadow-xl rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link href="/dashboard/cj-dropshipping" className="btn btn-sm btn-ghost">
                  Cancel
                </Link>
                <span className="text-xs text-base-content/60 hidden sm:inline">
                  Importing to <strong>{watchedCategory || "Selected Category"}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={importMutation.isPending}
                  className="btn btn-sm btn-primary gap-2 px-6 font-semibold shadow"
                >
                  {importMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Importing to MongoDB...
                    </>
                  ) : (
                    <>
                      <LuSparkles className="size-4" />
                      Import & Publish to Store
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
