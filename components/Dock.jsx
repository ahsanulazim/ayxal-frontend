"use client";

import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import { useContext } from "react";
import { FaGift } from "react-icons/fa6";
import { LuHouse, LuShoppingBag, LuUser } from "react-icons/lu";

const Dock = () => {
  const { newUser } = useContext(MyContext);
  const isAdmin = newUser?.user?.role === "admin";
  const accountHref = !newUser ? "/login" : isAdmin ? "/dashboard" : "/account";

  return (
    <div className="dock bg-main text-neutral-content sticky lg:hidden">
      <Link href="/">
        <LuHouse className="size-[1.2em]" />
        <span className="dock-label">Home</span>
      </Link>

      <Link href="/offers">
        <FaGift className="size-[1.2em] animate-pulse" />
        <span className="dock-label">Offers</span>
      </Link>

      <Link href="/cart">
        <LuShoppingBag className="size-[1.2em]" />
        <span className="dock-label">Cart</span>
      </Link>
      <Link href={accountHref}>
        <LuUser className="size-[1.2em]" />
        <span className="dock-label">Account</span>
      </Link>
    </div>
  );
};

export default Dock;
