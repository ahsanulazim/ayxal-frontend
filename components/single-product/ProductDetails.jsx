"use client";

import { useMemo, useState } from "react";

import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import ProductDescription from "./ProductDescription";
import ProductSpecifications from "./ProductSpecifications";

import {
  getImageUrl,
  getInitialSelectedAttributes,
  findSelectedVariation,
} from "./utils";

export default function ProductDetails({ product }) {
  const [selectedAttributes, setSelectedAttributes] = useState(() =>
    getInitialSelectedAttributes(product),
  );

  const [quantity, setQuantity] = useState(1);

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
      product?.attributes,
    );
  }, [
    product?.variations,
    product?.attributes,
    product?.hasVariations,
    selectedAttributes,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Gallery
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

    /*
     * Selected combination image first
     */
    addImage(selectedVariation?.thumbnail);

    selectedVariation?.images?.forEach(addImage);

    /*
     * Generic product gallery
     */
    addImage(product?.thumbnail);

    product?.images?.forEach(addImage);

    return images;
  }, [product, selectedVariation]);

  /*
  |--------------------------------------------------------------------------
  | Attribute change
  |--------------------------------------------------------------------------
  */

  const handleAttributesChange = (nextSelectedAttributes) => {
    setSelectedAttributes(nextSelectedAttributes);
    setQuantity(1);
  };

  return (
    <main className="mx-auto max-w-360 p-5">
      <section className="grid gap-10 grid-cols-1 lg:grid-cols-2 xl:gap-16">
        <ProductGallery
          key={JSON.stringify(selectedAttributes)}
          images={galleryImages}
          title={product.title}
        />

        <ProductInfo
          product={product}
          selectedVariation={selectedVariation}
          selectedAttributes={selectedAttributes}
          onAttributesChange={handleAttributesChange}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[1.4fr_.6fr] items-start">
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
