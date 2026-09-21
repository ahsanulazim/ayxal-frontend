"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import ProductSpecifications from "./ProductSpecifications";
import ProductCard from "@/components/ui/ProductCard";

import {
  getImageUrl,
  getInitialSelectedAttributes,
  findSelectedVariation,
  getNormalizedAttributes,
} from "./utils";
import {
  LuFileText,
  LuSlidersHorizontal,
  LuTruck,
  LuRotateCcw,
  LuTag,
  LuSparkles,
} from "react-icons/lu";

export default function ProductDetails({
  product: initialProduct,
  categoryInfo,
  relatedProducts = [],
}) {
  const product = useMemo(() => {
    if (!initialProduct) return initialProduct;
    const activeVariations = Array.isArray(initialProduct.variations)
      ? initialProduct.variations.filter((v) => v.isActive !== false)
      : [];
    return {
      ...initialProduct,
      variations: activeVariations,
      hasVariations: activeVariations.length > 0,
    };
  }, [initialProduct]);

  const [selectedAttributes, setSelectedAttributes] = useState(() =>
    getInitialSelectedAttributes(product),
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const attributes = useMemo(() => getNormalizedAttributes(product), [product]);

  /*
  |--------------------------------------------------------------------------
  | Exact selected variation
  |--------------------------------------------------------------------------
  */
  const selectedVariation = useMemo(() => {
    if (!product?.hasVariations) {
      return null;
    }

    return findSelectedVariation(
      product?.variations,
      selectedAttributes,
      attributes,
    );
  }, [product, attributes, selectedAttributes]);

  /*
  |--------------------------------------------------------------------------
  | Gallery images builder
  |--------------------------------------------------------------------------
  */
  const galleryImages = useMemo(() => {
    const images = [];

    const addImage = (image) => {
      const url = getImageUrl(image);
      if (url && !images.includes(url)) {
        images.push(url);
      }
    };

    // Selected combination image first
    addImage(selectedVariation?.thumbnail);
    selectedVariation?.images?.forEach(addImage);

    // Generic product gallery
    addImage(product?.thumbnail);
    product?.images?.forEach(addImage);

    return images;
  }, [product, selectedVariation]);

  const handleAttributesChange = (nextSelectedAttributes) => {
    setSelectedAttributes(nextSelectedAttributes);
    setQuantity(1);
  };

  const discount = selectedVariation?.discount ?? product.baseDiscount ?? 0;

  const tabs = [
    {
      id: "description",
      label: "Description",
      icon: LuFileText,
    },
    {
      id: "specifications",
      label: "Specifications",
      icon: LuSlidersHorizontal,
    },
    {
      id: "shipping",
      label: "Shipping & Delivery",
      icon: LuTruck,
    },
    {
      id: "returns",
      label: "Returns & Warranty",
      icon: LuRotateCcw,
    },
  ];

  return (
    <main className="mx-auto max-w-360 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Section: Gallery & Info */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">
        {/* Product Gallery (5 cols on lg, 6 on xl) */}
        <div className="lg:col-span-6 xl:col-span-6">
          <ProductGallery
            key={JSON.stringify(selectedAttributes)}
            images={galleryImages}
            title={product.title}
            discount={discount}
          />
        </div>

        {/* Product Info & Buy Box (7 cols on lg, 6 on xl) */}
        <div className="lg:col-span-6 xl:col-span-6">
          <ProductInfo
            product={product}
            selectedVariation={selectedVariation}
            selectedAttributes={selectedAttributes}
            onAttributesChange={handleAttributesChange}
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="mt-16 sm:mt-20">
        <div className="border-b border-zinc-200">
          <nav
            className="flex space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar"
            aria-label="Tabs"
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 sm:px-3 text-sm sm:text-base font-semibold border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? "border-main text-main"
                      : "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content Panels */}
        <div className="mt-8">
          {activeTab === "description" && (
            <div className="grid gap-8 lg:grid-cols-[1.4fr_.6fr] items-start">
              <ProductDescription description={product.description} />
              <ProductSpecifications product={product} />
            </div>
          )}

          {activeTab === "specifications" && (
            <div className="max-w-3xl">
              <ProductSpecifications product={product} />
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs max-w-3xl">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4">
                Shipping &amp; Delivery Information
              </h2>
              <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                  <LuTruck className="w-5 h-5 text-main shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-zinc-900 mb-1">
                      Standard Home Delivery
                    </h3>
                    <p>
                      Estimated dispatch within 24-48 hours. Typical arrival in
                      2-4 business days.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                  <LuSparkles className="w-5 h-5 text-main shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-zinc-900 mb-1">
                      Pet-Friendly Packaging
                    </h3>
                    <p>
                      All items are securely packaged using recyclable, pet-safe
                      and chew-resistant materials to ensure pristine condition
                      upon arrival.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "returns" && (
            <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs max-w-3xl">
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-4">
                Returns &amp; Satisfaction Guarantee
              </h2>
              <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
                <p>
                  At PretyPet, we want you and your beloved furry companions to
                  be 100% delighted with your purchase.
                </p>
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-900">
                  <h3 className="font-bold mb-1">30-Day Hassle-Free Returns</h3>
                  <p className="text-xs sm:text-sm">
                    If an item arrives damaged, defective, or simply does not
                    suit your pet, return it within 30 days of delivery for a
                    full refund or instant replacement.
                  </p>
                </div>
                <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 text-xs sm:text-sm">
                  <li>
                    Items must be in original or gently inspected condition with
                    packaging.
                  </li>
                  <li>Proof of purchase or order ID required.</li>
                  <li>
                    Our customer support is always available 7 days a week to
                    assist.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product Tags */}
      {!!product.tags?.length && (
        <section className="mt-12 pt-8 border-t border-zinc-100">
          <div className="flex items-center gap-2 mb-3 text-zinc-800 font-bold text-sm">
            <LuTag className="w-4 h-4 text-main" />
            <span>Related Tags:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Link
                key={tag}
                href={`/products?search=${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-main/10 hover:text-main transition-colors border border-zinc-200/60"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 sm:mt-24 pt-10 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900">
                You Might Also Like
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                More popular pet essentials from this category
              </p>
            </div>

            {categoryInfo?.slug && (
              <Link
                href={`/products/${categoryInfo.slug}`}
                className="hidden sm:inline-flex items-center text-sm font-semibold text-main hover:underline"
              >
                View All &rarr;
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct._id?.toString() || relProduct.slug}
                product={relProduct}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
