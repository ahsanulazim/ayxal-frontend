"use client";

import ProductCard from "@/components/ui/ProductCard";
import ProductCardSkeleton from "@/components/ui/skeleton/ProductCardSkeleton";

const SearchGrid = ({ isLoading, products = [] }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id || product.slug} product={product} />
      ))}
    </div>
  );
};

export default SearchGrid;
