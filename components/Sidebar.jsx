"use client";
import Link from "next/link";
import Alert from "./Alert";
import Dock from "./Dock";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Image from "next/image";
import { MyContext } from "@/context/MyProvider";
import { useContext } from "react";

const Sidebar = ({ children }) => {
  const { categories, categoriesLoading, categoriesError } =
    useContext(MyContext);

  return (
    <div className="drawer">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col relative">
        {/* Alert */}
        {/* <Alert /> */}
        {/* Navbar */}
        <Navbar />
        {/* Page content here */}
        <main className="bg-base-200">{children}</main>
        <Footer />
        <Dock />
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="bg-base-200 min-h-full w-80 p-4">
          <Link href="/" className="">
            <Image
              src="/assets/pretypet-logo.svg"
              alt="prety pet logo"
              width={100}
              height={100}
              className="min-w-25"
            />
          </Link>
          <ul className="menu px-0">
            {/* Sidebar content here */}
            <li className="menu-title">Categories</li>
            {categoriesLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <li key={i}>
                  <span className="skeleton h-8 w-52 my-2"></span>
                </li>
              ))
            ) : categoriesError ? (
              <li>
                <span>Categories Error</span>
              </li>
            ) : (
              categories.map((category) => (
                <li key={category.slug}>
                  <Link href={`/products/${category.slug}`}>
                    {category.name}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
