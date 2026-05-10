import ProductCard from "../ui/ProductCard";

const NewArrival = () => {
  return (
    <section className="px-5 mb-5">
      <div className="max-w-360 mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold text-main">
          New Arrivals
        </h2>
        <div className="mt-5 grid grid-cols-2 xs:grid-cols-3 lg:grid-cols-6 gap-5">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
