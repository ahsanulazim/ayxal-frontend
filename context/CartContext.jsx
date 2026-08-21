"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

const CART_KEY = "cart";

/* =========================================================
   HELPERS
========================================================= */

const getProductId = (product) => {
  if (!product?._id) return "";

  if (typeof product._id === "string") {
    return product._id;
  }

  return product?._id?.$oid || "";
};

const getImageUrl = (image) => {
  if (!image) return "";

  if (typeof image === "string") {
    return image;
  }

  return image?.url || "";
};

const calculateFinalPrice = (price = 0, discount = 0) => {
  const numericPrice = Number(price) || 0;
  const numericDiscount = Number(discount) || 0;

  if (!numericDiscount) {
    return numericPrice;
  }

  return numericPrice - (numericPrice * numericDiscount) / 100;
};

const createCartItem = ({ product, variation = null, quantity = 1 }) => {
  const productId = getProductId(product);

  const price = product?.hasVariations
    ? Number(variation?.price || 0)
    : Number(product?.basePrice || 0);

  const discount = product?.hasVariations
    ? Number(variation?.discount || 0)
    : Number(product?.baseDiscount || 0);

  const stock = product?.hasVariations
    ? Number(variation?.stock || 0)
    : Number(product?.baseStock || 0);

  const finalPrice = calculateFinalPrice(price, discount);

  const selectedAttributes = {};

  if (product?.hasVariations && variation && product?.attributes?.length) {
    product.attributes.forEach((attribute) => {
      selectedAttributes[attribute] = variation?.[attribute] ?? null;
    });
  }

  const variationKey =
    product?.hasVariations && variation
      ? (product.attributes || [])
          .map((attribute) => `${attribute}:${variation?.[attribute] ?? ""}`)
          .join("|")
      : "";

  const key = variationKey ? `${productId}::${variationKey}` : productId;

  return {
    key,

    productId,

    slug: product?.slug || "",

    title: product?.title || "",

    thumbnail:
      getImageUrl(variation?.thumbnail) || getImageUrl(product?.thumbnail),

    hasVariations: Boolean(product?.hasVariations),

    selectedAttributes,

    price,

    discount,

    finalPrice,

    stock,

    quantity: Number(quantity) || 1,
  };
};

/* =========================================================
   PROVIDER
========================================================= */

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  /* =======================================================
     LOAD CART
  ======================================================= */

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error("Cart localStorage error:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  /* =======================================================
     SAVE CART
  ======================================================= */

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Cart localStorage save error:", error);
    }
  }, [cart, loaded]);

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = ({ product, variation = null, quantity = 1 }) => {
    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    /*
     * Variation product হলে
     * exact variation required
     */
    if (product?.hasVariations && !variation) {
      return {
        success: false,
        message: "Please select product options",
      };
    }

    const numericQuantity = Number(quantity);

    if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
      return {
        success: false,
        message: "Invalid quantity",
      };
    }

    const stock = product?.hasVariations
      ? Number(variation?.stock || 0)
      : Number(product?.baseStock || 0);

    if (stock <= 0) {
      return {
        success: false,
        message: "Out of stock",
      };
    }

    if (numericQuantity > stock) {
      return {
        success: false,
        message: `Only ${stock} available`,
      };
    }

    const cartItem = createCartItem({
      product,
      variation,
      quantity: numericQuantity,
    });

    if (!cartItem?.key) {
      return {
        success: false,
        message: "Unable to add product",
      };
    }

    const existingItem = cart.find((item) => item.key === cartItem.key);

    /*
     * New cart item
     */
    if (!existingItem) {
      setCart((currentCart) => [...currentCart, cartItem]);

      return {
        success: true,
        message: "Added to cart",
      };
    }

    /*
     * Same product + same variation
     */
    const updatedQuantity = Number(existingItem.quantity) + numericQuantity;

    if (updatedQuantity > stock) {
      return {
        success: false,
        message: `Only ${stock} available`,
      };
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.key === cartItem.key
          ? {
              ...item,

              quantity: updatedQuantity,

              /*
               * Latest product data refresh
               */
              stock: cartItem.stock,
              price: cartItem.price,
              discount: cartItem.discount,
              finalPrice: cartItem.finalPrice,
              thumbnail: cartItem.thumbnail,
            }
          : item,
      ),
    );

    return {
      success: true,
      message: "Cart updated",
    };
  };

  /* =======================================================
     REMOVE FROM CART
  ======================================================= */

  const removeFromCart = (key) => {
    if (!key) {
      return {
        success: false,
        message: "Invalid cart item",
      };
    }

    const exists = cart.some((item) => item.key === key);

    if (!exists) {
      return {
        success: false,
        message: "Item not found",
      };
    }

    setCart((currentCart) => currentCart.filter((item) => item.key !== key));

    return {
      success: true,
      message: "Item removed",
    };
  };

  /* =======================================================
     UPDATE QUANTITY
  ======================================================= */

  const updateCartQuantity = (key, quantity) => {
    const numericQuantity = Number(quantity);

    const cartItem = cart.find((item) => item.key === key);

    if (!cartItem) {
      return {
        success: false,
        message: "Item not found",
      };
    }

    /*
     * 0 হলে remove
     */
    if (numericQuantity <= 0) {
      return removeFromCart(key);
    }

    if (!Number.isInteger(numericQuantity)) {
      return {
        success: false,
        message: "Invalid quantity",
      };
    }

    if (numericQuantity > Number(cartItem.stock)) {
      return {
        success: false,
        message: `Only ${cartItem.stock} available`,
      };
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.key === key
          ? {
              ...item,
              quantity: numericQuantity,
            }
          : item,
      ),
    );

    return {
      success: true,
      message: "Quantity updated",
    };
  };

  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseCartQuantity = (key) => {
    const cartItem = cart.find((item) => item.key === key);

    if (!cartItem) {
      return {
        success: false,
        message: "Item not found",
      };
    }

    return updateCartQuantity(key, Number(cartItem.quantity) + 1);
  };

  /* =======================================================
     DECREASE QUANTITY
  ======================================================= */

  const decreaseCartQuantity = (key) => {
    const cartItem = cart.find((item) => item.key === key);

    if (!cartItem) {
      return {
        success: false,
        message: "Item not found",
      };
    }

    return updateCartQuantity(key, Number(cartItem.quantity) - 1);
  };

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {
    setCart([]);

    return {
      success: true,
      message: "Cart cleared",
    };
  };

  /* =======================================================
     CHECK ITEM EXISTS
  ======================================================= */

  const isInCart = ({ product, variation = null }) => {
    if (!product) return false;

    const cartItem = createCartItem({
      product,
      variation,
      quantity: 1,
    });

    if (!cartItem?.key) return false;

    return cart.some((item) => item.key === cartItem.key);
  };

  /* =======================================================
     GET CART ITEM
  ======================================================= */

  const getCartItem = ({ product, variation = null }) => {
    if (!product) return null;

    const cartItem = createCartItem({
      product,
      variation,
      quantity: 1,
    });

    if (!cartItem?.key) return null;

    return cart.find((item) => item.key === cartItem.key) || null;
  };

  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
  }, [cart]);

  /* =======================================================
     UNIQUE ITEM COUNT
  ======================================================= */

  const cartItemCount = useMemo(() => {
    return cart.length;
  }, [cart]);

  /* =======================================================
     CART SUBTOTAL
  ======================================================= */

  const cartSubtotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.finalPrice || 0) * Number(item.quantity || 0),
      0,
    );
  }, [cart]);

  /* =======================================================
     ORIGINAL TOTAL BEFORE DISCOUNT
  ======================================================= */

  const cartOriginalTotal = useMemo(() => {
    return cart.reduce(
      (total, item) =>
        total + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  }, [cart]);

  /* =======================================================
     SAVINGS
  ======================================================= */

  const cartSavings = useMemo(() => {
    return Math.max(0, cartOriginalTotal - cartSubtotal);
  }, [cartOriginalTotal, cartSubtotal]);

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      cart,

      loaded,

      cartCount,

      cartItemCount,

      cartSubtotal,

      cartOriginalTotal,

      cartSavings,

      addToCart,

      removeFromCart,

      updateCartQuantity,

      increaseCartQuantity,

      decreaseCartQuantity,

      clearCart,

      isInCart,

      getCartItem,
    }),
    [
      cart,
      loaded,
      cartCount,
      cartItemCount,
      cartSubtotal,
      cartOriginalTotal,
      cartSavings,
    ],
  );

  return <CartContext value={value}>{children}</CartContext>;
};

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
