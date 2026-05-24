import Filter from "@/components/product/Filter";
import ShopNav from "@/components/product/ShopNav";

const page = async ({ params }) => {
  const { category } = await params;

  return (
    <>
      <ShopNav category={category} />
      <Filter />
    </>
  );
};

export default page;
