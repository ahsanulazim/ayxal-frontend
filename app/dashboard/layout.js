"use client";

import ActiveLink from "@/components/dashboard/ActiveLink";
import DashNav from "@/components/dashboard/DashNav";
import { MyContext } from "@/context/MyProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import {
  LuBox,
  LuBuilding2,
  LuFileBox,
  LuGalleryThumbnails,
  LuLayoutDashboard,
  LuMapPin,
  LuNotebook,
  LuPackageSearch,
  LuSwatchBook,
  LuTruck,
  LuUser,
  LuSparkles,
} from "react-icons/lu";

const Layout = ({ children }) => {
  const { newUser, loading } = useContext(MyContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!newUser) {
        router.push("/login");
      } else if (newUser?.user?.role !== "admin") {
        router.push("/account");
      }
    }
  }, [loading, newUser, router]);

  if (loading || !newUser || newUser?.user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-300">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <DashNav />
        {/* Page content here */}
        <main className="bg-base-300 p-4 min-h-[calc(100dvh-64px)]">
          {children}
        </main>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-100 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* List item */}
            <li>
              <ActiveLink
                href="/dashboard"
                exact={true}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Dashboard"
              >
                {/* Home icon */}
                <LuLayoutDashboard className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Dashboard</span>
              </ActiveLink>
            </li>

            <li>
              <ActiveLink
                href="/dashboard/orders"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Orders"
              >
                {/* Home icon */}
                <LuFileBox className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Orders</span>
              </ActiveLink>
            </li>

            <li>
              <ActiveLink
                href="/dashboard/products"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Products"
              >
                {/* Home icon */}
                <LuBox className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Products</span>
              </ActiveLink>
            </li>

            {/* <li>
              <ActiveLink
                href="/dashboard/products-v2"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Products V2"
              >
                <LuSparkles className="my-1.5 inline-block size-4 text-primary" />
                <span className="is-drawer-close:hidden flex items-center justify-between flex-1">
                  <span>Products (V2)</span>
                  <span className="badge badge-primary badge-xs">New</span>
                </span>
              </ActiveLink>
            </li> */}

            {/* List item */}
            <li>
              <ActiveLink
                href="/dashboard/carousel"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Carousel"
              >
                <LuGalleryThumbnails className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Carousel</span>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink
                href="/dashboard/categories"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Categories"
              >
                {/* Settings icon */}
                <LuNotebook className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Categories</span>
              </ActiveLink>
            </li>

            <li>
              <ActiveLink
                href="/dashboard/brand"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Brands"
              >
                {/* Settings icon */}
                <LuBuilding2 className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Brands</span>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink
                href="/dashboard/attributes"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Attributes"
              >
                {/* Settings icon */}
                <LuSwatchBook className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Attributes</span>
              </ActiveLink>
            </li>

            <li>
              <ActiveLink
                href="/dashboard/cj-dropshipping"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="CJ Dropshipping"
              >
                {/* Home icon */}
                <LuPackageSearch className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">CJ Dropshipping</span>
              </ActiveLink>
            </li>
            <li>
              <ActiveLink
                href="/dashboard/location"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Location"
              >
                {/* Home icon */}
                <LuMapPin className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Location</span>
              </ActiveLink>
            </li>

            <li>
              <ActiveLink
                href="/dashboard/users"
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                dataTip="Users"
              >
                {/* Home icon */}
                <LuUser className="my-1.5 inline-block size-4" />
                <span className="is-drawer-close:hidden">Users</span>
              </ActiveLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Layout;
