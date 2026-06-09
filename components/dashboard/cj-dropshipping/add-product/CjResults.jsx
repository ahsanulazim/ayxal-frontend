import CjProductCard from "./CjProductCard";

const CjResults = ({ products }) => {
  console.log(products);

  return (
    <>
      {products.length > 0 && (
        <>
          <div className="">
            <h1 className="font-bold text-xl mb-3">Search Results</h1>
          </div>

          <div className="grid grid-cols-7 @[112rem]:grid-cols-8 gap-2">
            {products.map((product) => (
              <CjProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default CjResults;
