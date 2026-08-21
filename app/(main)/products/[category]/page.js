"use client";
import { getProductsByCategory } from "@/api/productApi";
import Filter from "@/components/product/Filter";
import ShopNav from "@/components/product/ShopNav";
import ProductHeader from "@/components/shop/ProductHeader";
import ProductSidebar from "@/components/shop/ProductSidebar";
import { useQuery } from "@tanstack/react-query";
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product-list", category, queryParams],
    queryFn: getProductsByCategory,
  });

  console.log("data", data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="max-w-360 mx-auto px-5 mb-5">
        <ShopNav category={data?.category?.name} slug={data?.category?.slug} />
        <ProductHeader title={data?.category?.name} />
      </section>
      {/* <Filter category={category} /> */}
      <section className="max-w-360 mx-auto px-5">
        <ProductSidebar
          total={data?.pagination?.total}
          products={data?.products}
        />
      </section>
    </>
  );
};

export default page;
