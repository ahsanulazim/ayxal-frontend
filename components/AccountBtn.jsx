"use client";

import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import { useContext } from "react";
import { LuLayoutDashboard, LuUser } from "react-icons/lu";

const AccountBtn = () => {
  const { newUser } = useContext(MyContext);

  return (
    <Link href={!newUser ? "/login" : "/dashboard"}>
      <button className="hidden lg:inline-flex btn btn-main rounded-full">
        {!newUser ? (
          <>
            <LuUser className="size-[1.2rem]" />
            Account
          </>
        ) : (
          <>
            <LuLayoutDashboard className="size-[1.2rem]" />
            Dashboard
          </>
        )}
      </button>
    </Link>
  );
};

export default AccountBtn;
