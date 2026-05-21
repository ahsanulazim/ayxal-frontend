const ProductCardSkeleton = () => {
  return (
    <div className="card shadow-sm overflow-clip">
      <div className="skeleton h-55 w-full"></div>
      <div className="card-body p-3">
        <div className="skeleton w-full h-6"></div>
        <div className="skeleton w-25 h-6"></div>
        <div className="skeleton w-35 h-8"></div>
        <div className="card-actions justify-end">
          <div className="skeleton h-8 w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
