"use client";

import { useMemo, useState } from "react";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import ProductSpecifications from "./ProductSpecifications";

import { getDefaultVariationIndex, getImageUrl } from "./utils";

export default function ProductDetails({ product }) {
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(() =>
    getDefaultVariationIndex(product?.variations),
  );

  const [quantity, setQuantity] = useState(1);

  const selectedVariation =
    product?.hasVariations && product?.variations?.length
      ? product.variations[selectedVariationIndex]
      : null;

  const galleryImages = useMemo(() => {
    const images = [];

    const addImage = (image) => {
      const url = getImageUrl(image);
      if (url && !images.includes(url)) {
        images.push(url);
      }
    };

    addImage(selectedVariation?.thumbnail);

    selectedVariation?.images?.forEach(addImage);

    addImage(product?.thumbnail);

    product?.images?.forEach(addImage);

    return images;
  }, [product, selectedVariation]);

  const handleVariationChange = (index) => {
    setSelectedVariationIndex(index);
    setQuantity(1);
  };

  return (
    <main className="mx-auto max-w-360 p-5">
      <section className="grid gap-10 lg:grid-cols-2 xl:gap-16">
        <ProductGallery
          key={selectedVariationIndex}
          images={galleryImages}
          title={product.title}
        />

        <ProductInfo
          product={product}
          selectedVariation={selectedVariation}
          selectedVariationIndex={selectedVariationIndex}
          quantity={quantity}
          setQuantity={setQuantity}
          onVariationChange={handleVariationChange}
        />
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[1.4fr_.6fr]">
        <ProductDescription description={product.description} />

        <ProductSpecifications product={product} />
      </section>

      {!!product.tags?.length && (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">Related Tags</h2>

          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="badge">
                {tag}
              </span>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
