import { LuHeart, LuShoppingCart } from "react-icons/lu";

export default function ProductActions({ outOfStock, onAddToCart }) {
  return (
    <>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button
          disabled={outOfStock}
          onClick={onAddToCart}
          className={`btn btn-lg btn-outline ${!outOfStock && "btn-main-outline"}`}
        >
          <LuShoppingCart />

          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        <button
          disabled={outOfStock}
          className={`btn btn-lg ${!outOfStock && "btn-main"}`}
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
