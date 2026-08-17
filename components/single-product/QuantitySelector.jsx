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
    <div className="mt-8">
      <div className="mb-3 font-semibold">Quantity</div>

      <div className="inline-flex overflow-hidden rounded-xl border border-base-300">
        <button
          onClick={decrease}
          disabled={quantity <= 1}
          className="btn btn-ghost"
        >
          <LuMinus />
        </button>

        <div className="flex min-w-12 items-center justify-center px-3 font-semibold">
          {quantity}
        </div>

        <button
          onClick={increase}
          disabled={outOfStock || quantity >= stock}
          className="btn btn-ghost"
        >
          <LuPlus />
        </button>
      </div>
    </div>
  );
}
