import Link from "next/link";

const ProductCard = ({ product }) => {
  // Sob variant er moddhe prothom j variant e kono in-stock size ache, seta nebo
  const firstVariantWithStock = product?.variantDetails?.find((v) =>
    v.sizes?.some((s) => s.stock > 0),
  );
  // Kono variant e stock na thakle isOutOfStock = true
  const isOutOfStock = !firstVariantWithStock;
  // Fallback: kono variant e stock na thakle prothom variant e thako
  const firstVariant = firstVariantWithStock || product?.variantDetails?.[0];
  // First in-stock size, na thakle sizes[0]
  const displaySize =
    firstVariant?.sizes?.find((s) => s.stock > 0) || firstVariant?.sizes?.[0];

  return (
    <div className="card bg-base-100 shadow-sm overflow-clip">
      <Link href={`/products/${product.categoryId}/${product.pid}`}>
        <figure className="relative">
          {!isOutOfStock && (
            <div className="badge badge-success max-md:badge-sm absolute top-3 left-3">
              New
            </div>
          )}
          <img
            src={firstVariant?.swatchImage || product.bigImage}
            alt={product.productNameEn}
            className="aspect-square object-cover"
          />
        </figure>
      </Link>
      <div className="card-body p-3">
        <Link href={`/products/${product.categoryId}/${product.pid}`}>
          <h2 className="card-title text-xs xs:text-sm font-normal line-clamp-2">
            {product.productNameEn}
          </h2>
        </Link>

        <p className="font-bold text-sm xs:text-lg">
          ${Number(product.sellPrice.split("-")[0]) + 15}
        </p>
        <div className="card-actions justify-end">
          <Link
            href={`/products/${product.categoryId}/${product.pid}`}
            className={`btn btn-sm w-full btn-main`}
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
