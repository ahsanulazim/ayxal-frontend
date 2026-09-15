"use client";

import React, { useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { updateStoreProduct, syncCjProduct } from "@/api/cjDropshipApi";
import { toast } from "react-toastify";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";

import {
  LuArrowLeft,
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
  LuLayers,
  LuPenLine,
  LuRefreshCw,
  LuSave,
  LuShoppingBag,
  LuSparkles,
  LuTrendingUp,
  LuWeight,
} from "react-icons/lu";

const ClientSideEditor = dynamic(
  () => import("@/components/form/CKEditorField"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] bg-base-200/50 animate-pulse rounded-xl border border-base-200 flex items-center justify-center text-xs text-base-content/40">
        Loading Rich Text Editor...
      </div>
    ),
  },
);

export default function ProductEditLayout({
  initialProduct,
  categories = [],
  brands = [],
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const isDropshipped = Boolean(initialProduct.isDropshipped);

  // Swiper State
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialProduct.title || "",
      category:
        typeof initialProduct.category === "string"
          ? initialProduct.category
          : initialProduct.category?.slug ||
            initialProduct.category?.name ||
            "",
      brand: initialProduct.brand || "",
      noBrand: Boolean(initialProduct.noBrand || !initialProduct.brand),
      status: initialProduct.status || "active",
      basePrice: initialProduct.price || initialProduct.basePrice || 0,
      baseStock: initialProduct.stock || initialProduct.baseStock || 0,
      description:
        typeof initialProduct.description === "string"
          ? initialProduct.description
          : typeof initialProduct.description === "object"
            ? JSON.stringify(initialProduct.description, null, 2)
            : "",
    },
  });

  const watchedTitle = watch("title");
  const watchedNoBrand = watch("noBrand");
  const watchedBasePrice = watch("basePrice");
  const watchedBaseStock = watch("baseStock");
  const watchedDescription = watch("description");

  // Description Mode State ("rich" | "code" | "preview")
  const [descEditorMode, setDescEditorMode] = useState("rich");

  // Media state
  const rawImages = useMemo(() => {
    const list = [];
    if (initialProduct.thumbnail) {
      const thumbUrl =
        typeof initialProduct.thumbnail === "string"
          ? initialProduct.thumbnail
          : initialProduct.thumbnail?.url;
      if (thumbUrl) list.push(thumbUrl);
    }
    if (Array.isArray(initialProduct.images)) {
      initialProduct.images.forEach((img) => {
        const url = typeof img === "string" ? img : img?.url;
        if (url && !list.includes(url)) list.push(url);
      });
    }
    return list;
  }, [initialProduct]);

  const [selectedThumbnail, setSelectedThumbnail] = useState(
    typeof initialProduct.thumbnail === "string"
      ? initialProduct.thumbnail
      : initialProduct.thumbnail?.url || rawImages[0] || "",
  );
  const [selectedImages, setSelectedImages] = useState(rawImages);

  // Variants state
  const hasVariations = Boolean(
    initialProduct.hasVariations && initialProduct.variations?.length > 0,
  );
  const [variants, setVariants] = useState(() => {
    if (!hasVariations) return [];
    return initialProduct.variations.map((v) => ({
      ...v,
      price: v.price !== undefined ? v.price : initialProduct.price || 0,
      costPrice: v.costPrice || 0,
      stock: v.stock !== undefined ? v.stock : 0,
      weight: v.weight !== undefined ? v.weight : initialProduct.weight || 0,
      isActive: v.isActive !== false,
      variantImage:
        typeof v.thumbnail === "string"
          ? v.thumbnail
          : v.thumbnail?.url || v.variantImage || selectedThumbnail,
    }));
  });

  // PID copy state
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
    if (initialProduct?.weightDisplay) {
      return initialProduct.weightDisplay.includes("g")
        ? initialProduct.weightDisplay
        : `${initialProduct.weightDisplay}g`;
    }
    return `${initialProduct?.weight || 0}g`;
  }, [variants, initialProduct]);

  // Pricing calculations
  const activeVariants = variants.filter((v) => v.isActive);
  const minCost =
    variants.length > 0
      ? Math.min(...variants.map((v) => v.costPrice || 0))
      : initialProduct.costPrice || 0;
  const maxCost =
    variants.length > 0
      ? Math.max(...variants.map((v) => v.costPrice || 0))
      : initialProduct.costPrice || 0;

  const minSellingPrice = hasVariations
    ? activeVariants.length > 0
      ? Math.min(...activeVariants.map((v) => parseFloat(v.price) || 0))
      : 0
    : parseFloat(watchedBasePrice) || 0;

  const avgProfit =
    hasVariations && activeVariants.length > 0
      ? (
          activeVariants.reduce(
            (sum, v) => sum + ((parseFloat(v.price) || 0) - (v.costPrice || 0)),
            0,
          ) / activeVariants.length
        ).toFixed(2)
      : ((parseFloat(watchedBasePrice) || 0) - minCost).toFixed(2);

  // Bulk Markup Calculator
  const applyMarkupMultiplier = (multiplier) => {
    if (hasVariations) {
      setVariants((prev) =>
        prev.map((v) => ({
          ...v,
          price: Number(((v.costPrice || 1) * multiplier).toFixed(2)),
        })),
      );
    } else {
      setValue("basePrice", Number(((minCost || 1) * multiplier).toFixed(2)));
    }
    toast.success(`Applied ${multiplier}x markup!`);
  };

  const applyFlatMarkup = (addition) => {
    if (hasVariations) {
      setVariants((prev) =>
        prev.map((v) => ({
          ...v,
          price: Number(((v.costPrice || 0) + addition).toFixed(2)),
        })),
      );
    } else {
      setValue("basePrice", Number(((minCost || 0) + addition).toFixed(2)));
    }
    toast.success(`Added $${addition} profit!`);
  };

  const handleVariantPriceChange = (vid, newPrice) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.vid === vid ? { ...v, price: parseFloat(newPrice) || 0 } : v,
      ),
    );
  };

  const handleVariantWeightChange = (vid, newWeight) => {
    setVariants((prev) =>
      prev.map((v) =>
        v.vid === vid ? { ...v, weight: parseFloat(newWeight) || 0 } : v,
      ),
    );
  };

  const handleVariantToggle = (vid) => {
    setVariants((prev) =>
      prev.map((v) => (v.vid === vid ? { ...v, isActive: !v.isActive } : v)),
    );
  };

  const toggleImageSelection = (imgUrl) => {
    if (selectedImages.includes(imgUrl)) {
      if (selectedImages.length === 1) {
        toast.warning("Product requires at least 1 image");
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

  const copyPid = () => {
    if (!initialProduct.cjProductId) return;
    navigator.clipboard.writeText(initialProduct.cjProductId);
    setCopiedPid(true);
    setTimeout(() => setCopiedPid(false), 2000);
  };

  // Sync Mutation
  const syncMutation = useMutation({
    mutationFn: () => syncCjProduct(initialProduct._id),
    onSuccess: (res) => {
      toast.success(res.message || "Synced stock and cost with CJ!");
      queryClient.invalidateQueries({
        queryKey: ["product", initialProduct._id],
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to sync with CJ");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data) => updateStoreProduct({ id: initialProduct._id, data }),
    onSuccess: (res) => {
      toast.success(res.message || "Product updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["product", initialProduct._id],
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["cjImportList"] });
      router.push("/dashboard/products-v2");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update product");
    },
  });

  const onSubmit = (formData) => {
    if (hasVariations && activeVariants.length === 0) {
      toast.error("Please keep at least one variant active");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      category: formData.category,
      brand: formData.noBrand ? null : formData.brand,
      noBrand: formData.noBrand,
      status: formData.status,
      price: hasVariations
        ? minSellingPrice
        : parseFloat(formData.basePrice) || 0,
      basePrice: hasVariations
        ? minSellingPrice
        : parseFloat(formData.basePrice) || 0,
      baseStock: parseInt(formData.baseStock) || 0,
      thumbnail: selectedThumbnail,
      images: selectedImages,
      description: formData.description,
      variations: hasVariations ? activeVariants : [],
    };

    updateMutation.mutate(payload);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products-v2"
            className="btn btn-circle btn-sm btn-ghost border border-base-200"
            title="Back to Products"
          >
            <LuArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight">Edit Product</h1>
              {isDropshipped ? (
                <span className="badge badge-sm badge-info badge-soft font-semibold gap-1">
                  <LuShoppingBag className="size-3" /> CJ Dropship
                </span>
              ) : (
                <span className="badge badge-sm badge-ghost badge-soft font-semibold">
                  Custom Product
                </span>
              )}
              <span className="badge badge-sm badge-neutral font-mono text-[10px]">
                ID: {initialProduct._id.slice(-6)}
              </span>
            </div>
            <p className="text-xs text-base-content/60">
              Update pricing, inventory, variants, and listing media with React
              Hook Form & Swiper.
            </p>
          </div>
        </div>

        {isDropshipped && initialProduct.cjProductId && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => syncMutation.mutate()}
              disabled={syncMutation.isPending}
              className="btn btn-sm btn-outline gap-1.5 text-xs font-semibold"
            >
              <LuRefreshCw
                className={`size-3.5 ${syncMutation.isPending ? "animate-spin text-primary" : ""}`}
              />
              Sync with CJ
            </button>

            <a
              href={`https://cjdropshipping.com/product/-p-${initialProduct.cjProductId}.html`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-ghost gap-1 text-xs"
            >
              CJ Page <LuExternalLink className="size-3" />
            </a>
          </div>
        )}
      </div>

      {/* Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Floating Product Card with Swiper            */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 lg:sticky lg:top-4 space-y-4">
          <div className="card bg-base-100 border border-base-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-base-200/60 p-3.5 border-b border-base-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-xs text-base-content/80">
                <LuInfo className="size-4 text-primary" />
                <span>
                  {isDropshipped
                    ? "Supplier Media & Details"
                    : "Product Gallery"}
                </span>
              </div>
              {isDropshipped && initialProduct.cjProductId && (
                <button
                  type="button"
                  onClick={copyPid}
                  className="btn btn-ghost btn-xs gap-1 font-mono text-[11px]"
                  title="Copy CJ Product ID"
                >
                  {copiedPid ? (
                    <LuCheck className="size-3 text-success" />
                  ) : (
                    <LuCopy className="size-3" />
                  )}
                  PID: {initialProduct.cjProductId}
                </button>
              )}
            </div>

            {/* Swiper Media Gallery */}
            <div className="p-4 space-y-3">
              {rawImages.length > 0 ? (
                <div className="space-y-2">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-base-200 border border-base-200 group">
                    <Swiper
                      modules={[Thumbs]}
                      slidesPerView={1}
                      spaceBetween={8}
                      thumbs={{
                        swiper:
                          thumbsSwiper && !thumbsSwiper.destroyed
                            ? thumbsSwiper
                            : null,
                      }}
                      onSwiper={(swiper) => {
                        mainSwiperRef.current = swiper;
                      }}
                      className="size-full"
                    >
                      {rawImages.map((img, index) => (
                        <SwiperSlide key={`edit-main-${index}`}>
                          <div className="size-full relative">
                            <img
                              src={img}
                              alt={`${watchedTitle} ${index + 1}`}
                              className="size-full object-cover"
                            />
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
                              {selectedThumbnail === img
                                ? "✓ Main Thumbnail"
                                : "Set Main Thumbnail"}
                            </button>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>

                    {rawImages.length > 1 && (
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

                  {/* Thumbnails Strip */}
                  {rawImages.length > 1 && (
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      modules={[FreeMode, Thumbs]}
                      watchSlidesProgress
                      slidesPerView={5}
                      spaceBetween={6}
                      freeMode
                      className="thumbs-swiper"
                    >
                      {rawImages.map((img, index) => (
                        <SwiperSlide
                          key={`edit-thumb-${index}`}
                          className="cursor-pointer"
                        >
                          <div
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selectedThumbnail === img
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-base-200 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img
                              src={img}
                              alt=""
                              className="size-full object-cover"
                            />
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

              {/* Metric stats */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                {isDropshipped && (
                  <div className="p-2.5 rounded-lg bg-base-200/50 border border-base-200">
                    <span className="text-base-content/50 block text-[10px] uppercase font-semibold">
                      Supplier Cost
                    </span>
                    <span className="font-bold text-base-content text-sm">
                      $
                      {minCost === maxCost
                        ? minCost
                        : `${minCost} - $${maxCost}`}
                    </span>
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-base-200/50 border border-base-200">
                  <span className="text-base-content/50 block text-[10px] uppercase font-semibold">
                    Current Retail Price
                  </span>
                  <span className="font-bold text-primary text-sm">
                    ${minSellingPrice}
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

                <div className="p-2.5 rounded-lg bg-base-200/50 border border-base-200">
                  <span className="text-base-content/50 block text-[10px] uppercase font-semibold">
                    Inventory Type
                  </span>
                  <span className="font-semibold text-base-content flex items-center gap-1.5 text-xs truncate">
                    <LuLayers className="size-3.5 text-secondary shrink-0" />
                    {hasVariations
                      ? `${variants.length} variations`
                      : `${watchedBaseStock} in stock`}
                  </span>
                </div>
              </div>
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
                  <h2 className="font-bold text-base">Listing Details</h2>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-base-content">
                  Product Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Product title is required",
                    minLength: {
                      value: 3,
                      message: "Title must be at least 3 characters",
                    },
                  })}
                  className={`input input-bordered w-full text-sm font-medium focus:input-primary ${
                    errors.title ? "input-error" : ""
                  }`}
                />
                {errors.title && (
                  <span className="text-[11px] text-error">
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* Category, Brand, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content">
                    Category <span className="text-error">*</span>
                  </label>
                  <select
                    {...register("category", {
                      required: "Category is required",
                    })}
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
                    <span className="text-[11px] text-error">
                      {errors.category.message}
                    </span>
                  )}
                </div>

                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content flex items-center justify-between">
                    <span>Brand</span>
                    <label className="label cursor-pointer p-0 gap-1">
                      <span className="text-[11px] text-base-content/60">
                        No Brand
                      </span>
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

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-base-content">
                    Store Status
                  </label>
                  <select
                    {...register("status")}
                    className="select select-bordered w-full text-sm focus:select-primary"
                  >
                    <option value="active">Active (Visible in Store)</option>
                    <option value="draft">Draft (Hidden)</option>
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
                          id="product-edit-description-editor"
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
                      <div
                        dangerouslySetInnerHTML={{ __html: watchedDescription }}
                      />
                    ) : (
                      <span className="text-base-content/40 italic">
                        No description provided yet.
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-base-content/50">
                  <span>
                    Powered by CKEditor 5. Easily format headings, lists, bold
                    text, and images for storefront display.
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Pricing Strategy & Profit Margin */}
            <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-base-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="font-bold text-base">
                    Pricing & Profit Margin
                  </h2>
                </div>
                {isDropshipped && (
                  <span className="text-xs text-base-content/60 flex items-center gap-1">
                    <LuDollarSign className="size-3.5 text-success" /> Live
                    Profit Margin
                  </span>
                )}
              </div>

              {/* Quick Bulk Markup */}
              {isDropshipped && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-base-content/70 block">
                    Quick Markup Presets:
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => applyMarkupMultiplier(2)}
                      className="btn btn-xs btn-soft btn-primary font-medium"
                    >
                      2.0x Cost
                    </button>
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
              )}

              {/* Pricing Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {isDropshipped && (
                  <div className="bg-base-200/40 border border-base-200 rounded-xl p-3 text-center">
                    <span className="text-[10px] uppercase font-bold text-base-content/50 block">
                      Supplier Cost
                    </span>
                    <span className="text-base font-bold text-base-content">
                      ${minCost.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-primary block">
                    Selling Price
                  </span>
                  <span className="text-base font-bold text-primary">
                    ${minSellingPrice}
                  </span>
                </div>

                {isDropshipped && (
                  <div className="bg-success/10 border border-success/20 rounded-xl p-3 text-center">
                    <span className="text-[10px] uppercase font-bold text-success block">
                      Avg Profit
                    </span>
                    <span className="text-base font-bold text-success flex items-center justify-center gap-0.5">
                      <LuTrendingUp className="size-4" />
                      +${avgProfit}
                    </span>
                  </div>
                )}

                <div className="bg-base-200/40 border border-base-200 rounded-xl p-3 text-center">
                  <span className="text-[10px] uppercase font-bold text-base-content/50 block">
                    Inventory Units
                  </span>
                  <span className="text-base font-bold text-base-content">
                    {hasVariations
                      ? variants.reduce((s, v) => s + (v.stock || 0), 0)
                      : watchedBaseStock}
                  </span>
                </div>
              </div>

              {/* Single Product Price & Stock Inputs */}
              {!hasVariations && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-base-content">
                      Retail Selling Price ($){" "}
                      <span className="text-error">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.1"
                      {...register("basePrice", {
                        required: "Price is required",
                      })}
                      className="input input-bordered w-full text-sm font-semibold focus:input-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-base-content">
                      Available Stock Units
                    </label>
                    <input
                      type="number"
                      min="0"
                      {...register("baseStock")}
                      className="input input-bordered w-full text-sm focus:input-primary"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Variants Table (If variable) */}
            {hasVariations && (
              <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-base-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h2 className="font-bold text-base">Variants & Prices</h2>
                  </div>
                  <span className="text-xs text-base-content/60">
                    {activeVariants.length} of {variants.length} variants
                    enabled
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-base-200">
                  <table className="table table-sm w-full">
                    <thead className="bg-base-200/70 text-xs text-base-content/70">
                      <tr>
                        <th className="w-10 text-center">Active</th>
                        <th>Variant</th>
                        {isDropshipped && <th>CJ Cost</th>}
                        <th>Your Retail Price ($)</th>
                        {isDropshipped && <th>Profit</th>}
                        <th>Weight (g)</th>
                        <th>Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((v) => {
                        const cost = v.costPrice || 0;
                        const retail = parseFloat(v.price) || 0;
                        const profit = (retail - cost).toFixed(2);
                        const marginPercent =
                          retail > 0
                            ? Math.round(((retail - cost) / retail) * 100)
                            : 0;

                        return (
                          <tr
                            key={v.vid}
                            className={`transition-colors ${
                              v.isActive
                                ? "hover:bg-base-200/30"
                                : "opacity-40 bg-base-200/20"
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
                                    <img
                                      src={v.variantImage}
                                      alt=""
                                      className="object-cover"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-xs text-base-content block">
                                    {v.variantKey || v.title}
                                  </span>
                                  {v.cjSku && (
                                    <span className="text-[10px] font-mono text-base-content/50">
                                      SKU: {v.cjSku}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            {isDropshipped && (
                              <td>
                                <span className="font-medium text-xs text-base-content/80">
                                  ${cost.toFixed(2)}
                                </span>
                              </td>
                            )}
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
                                  onChange={(e) =>
                                    handleVariantPriceChange(
                                      v.vid,
                                      e.target.value,
                                    )
                                  }
                                  className="input input-xs input-bordered w-full pl-6 text-xs font-semibold focus:input-primary"
                                />
                              </div>
                            </td>
                            {isDropshipped && (
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
                            )}
                            <td>
                              <div className="relative w-24">
                                <input
                                  type="number"
                                  step="1"
                                  min="0"
                                  disabled={!v.isActive}
                                  value={v.weight !== undefined ? v.weight : ""}
                                  onChange={(e) =>
                                    handleVariantWeightChange(
                                      v.vid,
                                      e.target.value,
                                    )
                                  }
                                  className="input input-xs input-bordered w-full pr-6 text-xs font-semibold focus:input-primary"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-base-content/50 pointer-events-none">
                                  g
                                </span>
                              </div>
                            </td>
                            <td>
                              <input
                                type="number"
                                min="0"
                                disabled={!v.isActive}
                                value={v.stock}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  setVariants((prev) =>
                                    prev.map((vr) =>
                                      vr.vid === v.vid
                                        ? { ...vr, stock: val }
                                        : vr,
                                    ),
                                  );
                                }}
                                className="input input-xs input-bordered w-20 text-xs focus:input-primary"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 4: Image Selector */}
            <div className="card bg-base-100 border border-base-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-base-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h2 className="font-bold text-base">Gallery Images</h2>
                </div>
                <span className="text-xs text-base-content/60">
                  {selectedImages.length} images active
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {selectedImages.map((img, idx) => {
                  const isThumb = selectedThumbnail === img;

                  return (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-xl overflow-hidden border-2 border-primary shadow-sm group"
                    >
                      <img
                        src={img}
                        alt=""
                        className="size-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => setSelectedThumbnail(img)}
                        className={`absolute bottom-1.5 left-1.5 right-1.5 text-[9px] py-0.5 rounded font-medium text-center transition-all ${
                          isThumb
                            ? "bg-primary text-white"
                            : "bg-black/60 text-white opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isThumb ? "Main Thumbnail" : "Set as Main"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Fixed Action Bar */}
            <div className="sticky bottom-4 z-20 bg-base-100/90 backdrop-blur-md border border-base-200 shadow-xl rounded-2xl p-4 flex items-center justify-between">
              <Link
                href="/dashboard/products-v2"
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="btn btn-sm btn-primary gap-2 px-6 font-semibold shadow"
              >
                {updateMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <LuSave className="size-4" />
                    Save Product Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
