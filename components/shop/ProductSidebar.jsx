import ProductCard from "../ui/ProductCard";
import ProductCardSkeleton from "../ui/skeleton/ProductCardSkeleton";
import ProductFilter from "./ProductFilter";
import ProductToolbar from "./ProductToolbar";

const ProductSidebar = ({ total, products, isFetching, isLoading }) => {
  return (
    <div className="drawer lg:drawer-open lg:gap-5">
      <input id="filter" type="checkbox" className="drawer-toggle lg:hidden" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <ProductToolbar total={total} isFetching={isFetching} />
        {/* Page content here */}
        <main className="py-5">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3 md:gap-5">
            {isLoading
              ? Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))
              : products?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
          </div>
        </main>
      </div>
      <aside className="drawer-side">
        <label
          htmlFor="filter"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {/* Sidebar content here */}
        {/* <ul className="menu bg-base-100 min-h-full w-80 p-4">
          <li>
            <a>Sidebar Item 1</a>
          </li>
          <li>
            <a>Sidebar Item 2</a>
          </li>
        </ul> */}
        <ProductFilter />
      </aside>
    </div>
  );
};

export default ProductSidebar;
