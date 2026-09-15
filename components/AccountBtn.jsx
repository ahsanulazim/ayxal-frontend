"use client";

import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import { useContext } from "react";
import { LuLayoutDashboard, LuUser, LuUserCheck } from "react-icons/lu";

const AccountBtn = () => {
  const { newUser } = useContext(MyContext);

  const isAdmin = newUser?.user?.role === "admin";
  const targetHref = !newUser ? "/login" : isAdmin ? "/dashboard" : "/account";

  return (
    <Link href={targetHref}>
      <button className="hidden lg:inline-flex btn btn-main rounded-full">
        {!newUser ? (
          <>
            <LuUser className="size-[1.2rem]" />
            Account
          </>
        ) : isAdmin ? (
          <>
            <LuLayoutDashboard className="size-[1.2rem]" />
            Dashboard
          </>
        ) : (
          <>
            <LuUserCheck className="size-[1.2rem]" />
            My Account
          </>
        )}
      </button>
    </Link>
  );
};

export default AccountBtn;
