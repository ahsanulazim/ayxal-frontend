"use client";

import { getAllProducts } from "@/api/productApi";
import { MyContext } from "@/context/MyProvider";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useContext, useState } from "react";
import { FaPaw } from "react-icons/fa6";
import { LuPlus, LuShoppingBag, LuSparkles } from "react-icons/lu";
import { toast } from "react-toastify";

const PetRecommendations = ({ pets = [] }) => {
  const { addToCart } = useContext(MyContext);
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);

  const { data: allProductsResp, isLoading } = useQuery({
    queryKey: ["allProducts", 1, "", 40],
    queryFn: getAllProducts,
  });

  if (!pets || pets.length === 0) return null;

  const activePet = pets[selectedPetIndex] || pets[0];
  const allProducts = allProductsResp?.products || [];

  // Filter products by active pet type (dog, cat, bird, etc.)
  const petTypeQuery = (activePet.type || "").toLowerCase();
  const matchedProducts = allProducts.filter((p) => {
    const title = (p.productNameEn || "").toLowerCase();
    const category = (p.category || "").toLowerCase();
    if (petTypeQuery === "dog") {
      return title.includes("dog") || title.includes("puppy") || category.includes("dog");
    }
    if (petTypeQuery === "cat") {
      return title.includes("cat") || title.includes("kitten") || category.includes("cat");
    }
    if (petTypeQuery === "bird") {
      return title.includes("bird") || title.includes("parrot") || category.includes("bird");
    }
    return true;
  });

  // Fallback to general products if pet-specific matches are fewer than 3
  const displayProducts =
    matchedProducts.length >= 2 ? matchedProducts.slice(0, 4) : allProducts.slice(0, 4);

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(
        {
          pid: product.pid,
          productNameEn: product.productNameEn,
          sellPrice: product.sellPrice,
          bigImage: product.bigImage,
        },
        "default",
        1,
      );
      toast.success(`Added ${product.productNameEn.slice(0, 20)}... to cart!`);
    }
  };

  return (
    <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-4">
      {/* Header and Pet Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
              <LuSparkles className="size-5 text-amber-500" /> Tailored for {activePet.name}
            </h3>
            <span className="badge badge-sm badge-outline text-main border-main/40 font-semibold capitalize">
              {activePet.type}
            </span>
          </div>
          <p className="text-xs text-base-content/60 mt-0.5">
            Specially curated supplies for your {activePet.breed || activePet.type}
          </p>
        </div>

        {/* Pet Switcher if user has > 1 pet */}
        {pets.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {pets.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPetIndex(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedPetIndex === idx
                    ? "bg-main text-white shadow-xs"
                    : "bg-base-200 text-base-content/70 hover:bg-base-300"
                }`}
              >
                {p.name} ({p.type})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-56 bg-base-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <p className="text-xs text-base-content/60 py-4">
          Looking for custom items for {activePet.name}...
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {displayProducts.map((product) => {
            const price = product.sellPrice
              ? Number(product.sellPrice.split("-")[0]) + 15
              : 19.99;

            return (
              <div
                key={product.pid || product._id}
                className="group bg-base-200/50 hover:bg-base-100 rounded-2xl p-3 border border-transparent hover:border-main/30 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square w-full rounded-xl bg-base-200 overflow-hidden relative mb-2">
                    {product.bigImage ? (
                      <img
                        src={product.bigImage}
                        alt={product.productNameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-base-content/40">
                        <FaPaw className="size-8" />
                      </div>
                    )}
                  </div>

                  <h4 className="font-semibold text-xs text-base-content line-clamp-2 leading-snug">
                    {product.productNameEn}
                  </h4>
                  <p className="font-bold text-sm text-main mt-1">
                    ${price.toFixed(2)}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-base-200/60">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-main btn-xs rounded-lg w-full text-[11px] gap-1"
                  >
                    <LuShoppingBag className="size-3" /> Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PetRecommendations;
