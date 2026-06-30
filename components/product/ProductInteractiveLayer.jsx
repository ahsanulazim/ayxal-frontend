"use client";

import { useState, useMemo, useContext } from "react";
import ProductImages from "./ProductImages";
import { FaStar } from "react-icons/fa6";
import TrustBadges from "./TrustBadges";
import { MyContext } from "@/context/MyProvider";
import { toast } from "react-toastify";

const ProductInteractiveLayer = ({ product }) => {
  // 1. Initial State Definition
  // Stock ache emon prothom color select hobe; kono color e stock na thakle first color
  const initialVariant = product?.variants?.[0];

  const [selectedColor, setSelectedColor] = useState(
    initialVariant?.variantKey || "",
  );

  // Active color variants er filtering optimization memoize kora holo
  const activeVariant = useMemo(() => {
    return product?.variants?.find((v) => v.variantKey === selectedColor);
  }, [product, selectedColor]);

  // add to cart
  const { addToCart } = useContext(MyContext);

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!activeVariant) {
      toast.error("Please select a color");
      return;
    }
    const result = addToCart(product, activeVariant, quantity === 1);
    if (result) {
      toast.success("Added to cart");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full mt-6">
      {/* LEFT BLOCK: Dynamic React Image Sliders Node */}
      <div className="lg:col-span-5 w-full">
        <ProductImages product={product} selectedColor={selectedColor} />
      </div>

      {/* RIGHT BLOCK: Dynamic Interactive Control Panel */}
      <div className="lg:col-span-7">
        <div className="badge badge-success badge-soft mb-3">
          <FaStar /> Best Seller
        </div>
        <h1 className="font-bold text-2xl lg:text-4xl">
          {product?.productNameEn}
        </h1>
        {/* PRICE DISPLAY BLOCK (Dynamic Discount Check) */}
        <div className="">
          <span className="font-bold text-2xl lg:text-3xl text-main">
            $
            {product?.sellPrice
              ? Number(product.sellPrice.split("-")[0]) + 15
              : 0}
          </span>
        </div>

        <div className="bg-base-100 p-4 xs:p-5 rounded-box shadow-xs h-fit my-5">
          {/* 1. COLOR VARIANT SELECTOR */}
          <div>
            <h3 className="font-bold text-sm flex items-center gap-1">
              Color:{" "}
              <span className="text-neutral-400 font-normal">
                {selectedColor}
              </span>
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {product?.variants?.map((variant) => (
                <button
                  key={variant.variantKey}
                  onClick={() => {
                    setSelectedColor(variant.variantKey);
                    // Notun color er stock ache emon prothom size select korbo
                    setSelectedSize(
                      variant?.sizes?.find((s) => s.stock > 0)?.size || "",
                    );
                    setQuantity(1);
                  }}
                  className="cursor-pointer"
                >
                  <div
                    className={`size-12 rounded-lg overflow-hidden border ${selectedColor === variant.variantKey ? "border-main" : "border-base-300"}`}
                  >
                    <img
                      src={variant?.variantImage}
                      alt={variant.variantKey}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. STOCK & QUANTITY CONTROLS */}
          <div className="my-4 pt-2 border-t border-base-300">
            <div className="my-4 flex items-center gap-3">
              <span className="text-sm font-bold">Quantity:</span>
              <div className="join border border-base-300 rounded-box bg-base-100">
                <button className="btn btn-sm btn-ghost join-item">-</button>
                <span className="px-4 py-1 flex items-center font-semibold text-sm">
                  1
                </span>
                <button className="btn btn-sm btn-ghost join-item">+</button>
              </div>
            </div>
          </div>

          {/* ACTION TRIGGER BUNDLES */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleAddToCart}
              className={`btn btn-neutral flex-1`}
            >
              Add to Cart
            </button>
            <button
              className={`btn btn-main flex-1`}
              onClick={() =>
                addToCart(product, activeVariant, quantity === 1, true)
              }
            >
              Buy Now
            </button>
          </div>
        </div>
        <TrustBadges />
      </div>
    </div>
  );
};

export default ProductInteractiveLayer;
