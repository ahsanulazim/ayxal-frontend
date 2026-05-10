const ProductCard = () => {
  return (
    <div className="card shadow-sm">
      <figure className="relative">
        <div className="badge badge-success absolute top-3 left-3">New</div>
        <img
          src="/assets/product.jpeg"
          alt="Shoes"
          className="aspect-square object-cover"
        />
      </figure>
      <div className="card-body p-3">
        <h2 className="card-title text-xs xs:text-sm font-normal">
          Oiki Elegant Coral Pink Floral Printed Cotton Kurti
        </h2>
        <p className="font-bold text-sm xs:text-lg">
          <span className="font-hind-siliguri">৳</span>5000
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-main btn-sm w-full">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
