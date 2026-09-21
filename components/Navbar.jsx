"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LuHeart, LuMenu, LuSearch, LuX } from "react-icons/lu";
import Search from "./Search";
import { FaGift } from "react-icons/fa6";
import Cart from "./Cart";
import AccountBtn from "./AccountBtn";
import { useWishlist } from "@/context/WishlistContext";

const Navbar = () => {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { wishlistCount = 0 } = useWishlist();

  return (
    <header className="bg-base-100 border-b border-b-base-300 sticky top-0 z-30">
      <div className="navbar max-w-360 mx-auto px-4 justify-between gap-2 lg:gap-8">
        {/* Left Section: Mobile Menu & Desktop Logo */}
        <div className="navbar-start w-auto lg:w-auto flex items-center">
          <label
            htmlFor="my-drawer-2"
            aria-label="open sidebar"
            className="cursor-pointer lg:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-base-200 transition-colors"
          >
            <LuMenu className="inline-block h-6 w-6 text-main" />
          </label>

          <Link href="/">
            <Image
              src="/assets/pretypet-logo.svg"
              alt="PrettyPet logo"
              width={130}
              height={70}
              priority
              className="h-8 lg:h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Center Section: Desktop Search & Centered Mobile Logo */}
        <div className="navbar-center flex-1 flex justify-center items-center">
          {/* Desktop Search Bar */}
          <div className="hidden lg:flex w-full justify-center max-w-xl">
            <Search />
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="navbar-end w-auto lg:w-auto flex items-center justify-end gap-1 sm:gap-2">
          {/* Offers Button */}
          <Link href="/offers">
            <button className="btn btn-outline border-main rounded-full mr-2 max-lg:hidden hover:[&>svg]:text-white hover:bg-main hover:text-white">
              <FaGift className="animate-pulse text-main" />
              Offers
            </button>
          </Link>

          {/* Account Button */}
          <AccountBtn />

          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="btn btn-ghost btn-circle btn-sm sm:btn-md lg:hidden"
            aria-label="Toggle mobile search"
          >
            {mobileSearchOpen ? (
              <LuX className="h-5 w-5 text-main" />
            ) : (
              <LuSearch className="h-5 w-5" />
            )}
          </button>

          {/* Wishlist Link */}
          <Link
            href="/account/wishlist"
            className="indicator"
            aria-label="View wishlist"
          >
            {wishlistCount > 0 && (
              <span className="indicator-item badge-xs badge badge-secondary bg-main border-main">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
            <span className="">
              <LuHeart className="size-5" />
            </span>
          </Link>

          {/* Cart Drawer Toggle */}
          <Cart />
        </div>
      </div>

      {/* Mobile Search Bar Drawer / Expandable */}
      {mobileSearchOpen && (
        <div className="lg:hidden border-t border-base-200 bg-base-100/95 backdrop-blur-md px-4 py-3 shadow-md animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-md mx-auto">
            <Search
              isMobile={true}
              onCloseMobile={() => setMobileSearchOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
