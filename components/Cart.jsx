"use client";

import Link from "next/link";
import { LuShoppingBag, LuTrash2 } from "react-icons/lu";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { cartCount, removeFromCart, cartSubtotal, cart } = useCart();

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-circle btn-ghost">
        <div className="indicator">
          <LuShoppingBag className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="badge badge-xs badge-primary indicator-item bg-main border-main">
              {cartCount}
            </span>
          )}
        </div>
      </div>
      <div
        className={`dropdown-content bg-base-100 rounded-box z-1 w-75 xs:w-90 shadow-sm `}
        tabIndex="-1"
      >
        <ul
          className={`menu flex-nowrap w-full p-0 ${
            cart.length > 3 ? "h-64 overflow-y-auto" : "h-fit"
          }`}
        >
          {cart.length === 0 ? (
            <li>
              <div className="hover:bg-transparent text-center block">
                <h2>Empty Cart</h2>
                <h3>No items in cart</h3>
              </div>
            </li>
          ) : (
            cart.map((item) => (
              <li key={item.key}>
                <div className="p-2 hover:rounded-box">
                  <img
                    src={item.thumbnail}
                    className="rounded-box size-15 object-cover"
                    alt={item.title}
                  />
                  <div>
                    <h3 className="line-clamp-2">{item.title}</h3>
                    <p className="text-xs font-bold">
                      {item.quantity} x $
                      {item.hasVariations ? item.finalPrice : item.basePrice} =
                      $
                      {(
                        item.quantity *
                        (item.hasVariations
                          ? item.finalPrice
                          : item.product?.sellPrice)
                      ).toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="btn btn-square btn-sm btn-error"
                    onClick={() => removeFromCart(item.key)}
                  >
                    <LuTrash2 />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        {cart.length > 0 && (
          <div className="p-3 border-t border-base-300">
            <p className="mb-2">
              Total:{" "}
              <span className="font-bold">${cartSubtotal.toFixed(2)}</span>
            </p>
            <div className="flex gap-3">
              <Link href="/cart" className="flex-1">
                <button className="btn btn-main btn-sm w-full">Cart</button>
              </Link>
              <Link href="/cart/checkout" className="flex-1">
                <button className="btn btn-main btn-sm w-full">Checkout</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
