"use client";

import CategoryCard from "../ui/CategoryCard";
import { useContext } from "react";
import { MyContext } from "@/context/MyProvider";

const Categories = () => {
  const { categories, categoriesLoading, categoriesError } =
    useContext(MyContext);

  return (
    <section className="px-5 mb-5">
      <div className="max-w-360 mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold text-main">
          Popular Categories
        </h2>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 lg:gap-5 mt-5">
          {categoriesLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton aspect-square h-30 lg:h-40 w-full"
                ></div>
              ))
            : categoriesError
              ? "Cannot get categories"
              : categories.map((category) => (
                  <CategoryCard key={category.slug} category={category} />
                ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
