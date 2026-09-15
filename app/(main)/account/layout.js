"use client";

import AccountSidebar from "@/components/account/AccountSidebar";
import Spinner from "@/components/skeleton/Spinner";
import { MyContext } from "@/context/MyProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { LuLayoutDashboard, LuShieldAlert } from "react-icons/lu";

const AccountLayout = ({ children }) => {
  const { newUser, loading } = useContext(MyContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !newUser) {
      router.push("/login");
    }
  }, [loading, newUser, router]);

  if (loading || !newUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const isAdmin = newUser?.user?.role === "admin";

  return (
    <div className="bg-base-200/50 min-h-[calc(100dvh-150px)] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Switcher Banner if role === admin */}
        {isAdmin && (
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <LuShieldAlert className="size-4 text-amber-600" />
              <span>
                You are currently viewing the customer portal as an{" "}
                <strong>Administrator</strong>.
              </span>
            </div>
            <Link
              href="/dashboard"
              className="btn btn-xs bg-amber-500 text-white hover:bg-amber-600 border-0 rounded-lg flex items-center gap-1"
            >
              <LuLayoutDashboard className="size-3" /> Go to Admin Dashboard
            </Link>
          </div>
        )}

        {/* Main 2-Column Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <AccountSidebar />
          <main className="flex-1 w-full min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;
