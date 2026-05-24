import Link from "next/link";
import { LuChevronDown, LuLayoutGrid } from "react-icons/lu";

const Filter = () => {
  const categoryFilters = [
    "All Categories",
    "Clothing",
    "Shoes",
    "Bags",
    "Accessories",
    "Jewelry",
    "Home & Living",
    "Beauty & Personal Care",
    "Kids",
  ];

  const sizeFilters = [
    { id: "all", label: "All Sizes" },
    { id: "small", label: "Small (S)" },
    { id: "medium", label: "Medium (M)" },
    { id: "large", label: "Large (L)" },
    { id: "xlarge", label: "X-Large (XL)" },
    { id: "xxlarge", label: "XX-Large (XXL)" },
  ];

  const priceFilters = [
    { id: "all", label: "All Prices" },
    { id: "under-500", label: "Under ৳500" },
    { id: "500-1000", label: "৳500 - ৳1000" },
    { id: "1000-2000", label: "৳1000 - ৳2000" },
    { id: "2000-5000", label: "৳2000 - ৳5000" },
    { id: "over-5000", label: "Over ৳5000" },
  ];

  return (
    <section className="px-5">
      <div className="max-w-360 mx-auto w-full">
        <div className="grid grid-cols-5">
          <div className="col-span-1">
            <div className="drawer drawer-open auto-cols-auto">
              <input
                id="my-drawer-3"
                type="checkbox"
                className="drawer-toggle"
              />
              <div className="drawer-content col-start-1 flex flex-col items-center justify-center">
                {/* Page content here */}
                <label
                  htmlFor="my-drawer-3"
                  className="btn drawer-button lg:hidden"
                >
                  Open drawer
                </label>
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="my-drawer-3"
                  aria-label="close sidebar"
                  className="drawer-overlay"
                ></label>
                <ul className="menu bg-base-200 w-full p-4">
                  {/* Sidebar content here */}
                  <li>
                    <a>Sidebar Item 1</a>
                  </li>
                  <li>
                    <a>Sidebar Item 2</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-span-4"></div>
        </div>
      </div>
    </section>
  );
};

export default Filter;
