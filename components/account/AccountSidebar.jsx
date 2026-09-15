"use client";

import { MyContext } from "@/context/MyProvider";
import { auth } from "@/firebase/firebase.config";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { FaPaw } from "react-icons/fa6";
import {
  LuHeart,
  LuLayoutDashboard,
  LuLogOut,
  LuMapPin,
  LuPackage,
  LuShieldCheck,
  LuStar,
  LuTicket,
  LuUser,
} from "react-icons/lu";
import { toast } from "react-toastify";

const navItems = [
  {
    label: "Overview",
    href: "/account",
    exact: true,
    icon: LuLayoutDashboard,
  },
  {
    label: "My Orders",
    href: "/account/orders",
    icon: LuPackage,
  },
  {
    label: "My Pets",
    href: "/account/pets",
    icon: FaPaw,
  },
  {
    label: "Addresses",
    href: "/account/addresses",
    icon: LuMapPin,
  },
  {
    label: "Wishlist",
    href: "/account/wishlist",
    icon: LuHeart,
  },
  {
    label: "Coupons",
    href: "/account/coupons",
    icon: LuTicket,
  },
  {
    label: "Reviews",
    href: "/account/reviews",
    icon: LuStar,
  },
  {
    label: "Profile",
    href: "/account/profile",
    icon: LuUser,
  },
];

const AccountSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { newUser, setNewUser } = useContext(MyContext);

  const userData = newUser?.user || {};
  const displayName = userData?.name || "PretyPet Shopper";
  const email = userData?.email || "";
  const firstLetter = (displayName[0] || "U").toUpperCase();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (setNewUser) setNewUser(null);
      localStorage.removeItem("user");
      toast.success("Signed out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to sign out");
    }
  };

  const isActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      {/* User Mini Profile Header */}
      <div className="bg-base-100 rounded-2xl p-5 shadow-sm border border-base-200 mb-4">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-main text-white rounded-full w-14 h-14 ring-2 ring-main/30 ring-offset-2 ring-offset-base-100 text-xl font-bold flex items-center justify-center">
              <span>{firstLetter}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base text-base-content truncate">
              {displayName}
            </h3>
            <p className="text-xs text-base-content/60 truncate">{email}</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="badge badge-xs bg-main/10 text-main border-0 font-medium py-1">
                <LuShieldCheck className="size-3 mr-0.5" /> Customer
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="bg-base-100 rounded-2xl p-2 shadow-sm border border-base-200">
        {/* Desktop Vertical Menu */}
        <nav className="hidden lg:flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-main text-white shadow-sm font-semibold"
                    : "text-base-content/80 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                <Icon className={`size-4.5 ${active ? "text-white" : "text-main"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="divider my-1"></div>

          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-all text-left w-full cursor-pointer"
          >
            <LuLogOut className="size-4.5" />
            <span>Sign Out</span>
          </button>
        </nav>

        {/* Mobile Horizontal Scrollable Tabs */}
        <nav className="flex lg:hidden overflow-x-auto no-scrollbar gap-2 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap font-medium transition-all ${
                  active
                    ? "bg-main text-white"
                    : "bg-base-200 text-base-content/80"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            type="button"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap font-medium bg-error/10 text-error cursor-pointer"
          >
            <LuLogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default AccountSidebar;
