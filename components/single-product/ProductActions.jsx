import { LuHeart, LuShoppingCart } from "react-icons/lu";

export default function ProductActions({ outOfStock, onAddToCart, onBuyNow }) {
  return (
    <>
      <div className="mt-8 grid gap-3 grid-cols-2 sticky bottom-16 bg-base-200 py-2 lg:static lg:bg-transparent lg:p-0">
        <button
          disabled={outOfStock}
          onClick={onAddToCart}
          className={`btn lg:btn-lg btn-outline ${!outOfStock && "btn-main-outline"}`}
        >
          <LuShoppingCart />

          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        <button
          disabled={outOfStock}
          onClick={onBuyNow}
          className={`btn lg:btn-lg ${!outOfStock && "btn-main"}`}
        >
          Buy Now
        </button>
      </div>

      <button className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-50">
        <LuHeart size={18} />
        Add to Wishlist
      </button>
    </>
  );
}
