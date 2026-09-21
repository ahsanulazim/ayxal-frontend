"use client";

import { LuHeart } from "react-icons/lu";

const WishlistHeader = ({ count = 0 }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-base-200 pb-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-base-content flex items-center gap-2">
          <LuHeart className="size-6 text-main fill-main/20" /> My Saved Pet Wishlist
        </h2>
        <p className="text-xs text-base-content/60 mt-1">
          Saved pet treats, grooming items, and accessories you love.
        </p>
      </div>

      {count > 0 && (
        <span className="badge badge-main text-white font-bold text-xs self-start sm:self-auto py-1 px-3">
          {count} {count === 1 ? "Item Saved" : "Items Saved"}
        </span>
      )}
    </div>
  );
};

export default WishlistHeader;
