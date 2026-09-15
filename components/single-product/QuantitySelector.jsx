import { LuMinus, LuPlus } from "react-icons/lu";

export default function QuantitySelector({ quantity, stock, onChange }) {
  const outOfStock = stock <= 0;

  const decrease = () => {
    onChange(Math.max(1, quantity - 1));
  };

  const increase = () => {
    if (outOfStock) return;
    onChange(Math.min(stock, quantity + 1));
  };

  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-zinc-900">Quantity</span>
        {stock > 0 && (
          <span className="text-xs text-zinc-400">
            Max available: {stock}
          </span>
        )}
      </div>

      <div className="inline-flex items-center rounded-xl border border-zinc-200 bg-white p-1 shadow-xs">
        <button
          type="button"
          onClick={decrease}
          disabled={quantity <= 1 || outOfStock}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <LuMinus className="w-3.5 h-3.5" />
        </button>

        <span className="flex min-w-12 items-center justify-center px-2 text-sm font-bold text-zinc-900 select-none">
          {quantity}
        </span>

        <button
          type="button"
          onClick={increase}
          disabled={outOfStock || quantity >= stock}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <LuPlus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
