"use client";
import { getProductsByCategory } from "@/api/productApi";
import ShopNav from "@/components/product/ShopNav";
import ProductHeader from "@/components/shop/ProductHeader";
import ProductSidebar from "@/components/shop/ProductSidebar";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "next/navigation";

const page = () => {
  const { category } = useParams();

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 12;
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const brand = searchParams.get("brand") || "";
  const inStock = searchParams.get("inStock") === "true";
  const onSale = searchParams.get("onSale") === "true";
  const sort = searchParams.get("sort") || "newest";

  const queryParams = {
    page,
    limit,
    minPrice,
    maxPrice,
    brand,
    inStock,
    onSale,
    sort,
  };

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["product-list", category, queryParams],
    queryFn: getProductsByCategory,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 10,
  });

  return (
    <>
      <section className="max-w-360 mx-auto px-5 mb-5">
        {isLoading ? (
          <>
            <div className="breadcrumbs text-sm">
              <ul>
                {Array.from({ length: 2 }).map((_, i) => (
                  <li key={i}>
                    <div className="skeleton w-16 xs:w-20 h-6"></div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="skeleton w-56 h-10"></div>
            <div className="skeleton w-full h-6 my-3"></div>
            <div className="skeleton w-full max-w-3/4 h-6"></div>
          </>
        ) : (
          <>
            <ShopNav
              category={data?.category?.name}
              slug={data?.category?.slug}
            />
            <ProductHeader
              title={data?.category?.name}
              description={data?.category?.description}
            />
          </>
        )}
      </section>
      <section className="max-w-360 mx-auto px-5">
        <ProductSidebar
          isLoading={isLoading}
          isFetching={isFetching}
          total={data?.pagination?.total}
          products={data?.products}
        />
      </section>
    </>
  );
};

export default page;
