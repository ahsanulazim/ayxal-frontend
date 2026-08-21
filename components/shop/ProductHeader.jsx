const ProductHeader = ({ title, description }) => {
  return (
    <header className="">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        {title || "Category Name"}
      </h1>

      <p className="mt-2 text-gray-500">
        {description || "Category Description"}
      </p>
    </header>
  );
};

export default ProductHeader;
