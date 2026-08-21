"use client";

import { useCart } from "@/context/CartContext";
import { LuTrash2 } from "react-icons/lu";

const CartedItems = () => {
  const { cart, removeFromCart, increaseCartQuantity, decreaseCartQuantity } =
    useCart();

  return (
    <div className="bg-base-100 rounded-box p-5">
      <h2 className="font-bold text-xl">Your Products</h2>
      <div className="divider"></div>
      <div className="flex flex-col gap-5">
        {cart.map((item) => (
          <div
            key={item.title}
            className="grid grid-cols-1 md:grid-cols-5 items-center gap-5"
          >
            <div className="flex gap-5 md:col-span-3">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="rounded-box size-20"
              />
              <div className="flex-1">
                <h3>{item.title}</h3>
                {item.hasVariations && item.selectedAttributes && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(item.selectedAttributes).map(
                      ([key, value]) => (
                        <span
                          key={key}
                          className="badge badge-accent badge-sm gap-1"
                        >
                          <span className="capitalize">{key}</span>
                          <span>:</span>
                          <strong>{String(value).toUpperCase()}</strong>
                        </span>
                      ),
                    )}
                  </div>
                )}
                <h4 className="text-sm">
                  Price:{" "}
                  <span className="font-bold">
                    ${item.finalPrice.toFixed(2)}
                  </span>
                </h4>
              </div>
            </div>
            <div className="md:col-span-2 flex items-center justify-between">
              <div className="join border border-base-300 rounded-box bg-base-100">
                <button
                  disabled={item.quantity === 1}
                  className="btn btn-sm btn-ghost join-item"
                  onClick={() => decreaseCartQuantity(item.key)}
                >
                  -
                </button>
                <span className="px-4 py-1 flex items-center font-semibold text-sm">
                  {item.quantity}
                </span>
                <button
                  className="btn btn-sm btn-ghost join-item"
                  disabled={item.quantity >= item.stock}
                  onClick={() => increaseCartQuantity(item.key)}
                >
                  +
                </button>
              </div>
              <div className="flex items-center justify-end">
                <h4 className="xs:text-lg font-bold mr-5 whitespace-nowrap">
                  $ {(item.quantity * item.finalPrice).toFixed(2)}
                </h4>
                <button
                  className="btn btn-square btn-sm btn-error"
                  onClick={() => removeFromCart(item.key)}
                >
                  <LuTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartedItems;
