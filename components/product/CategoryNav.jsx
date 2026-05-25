import { LuFilter } from "react-icons/lu";

const CategoryNav = ({ category }) => {
  const cleanCategory = category.replace(/-/g, " ");

  return (
    <div className="navbar bg-base-100 shadow-sm rounded-box py-0">
      <div className="flex-1">
        <label
          htmlFor="my-drawer-3"
          className="btn max-xs:btn-square drawer-button lg:hidden mr-2"
        >
          <LuFilter /> <span className="hidden xs:block">Filter</span>
        </label>
        <span className="font-semibold uppercase">{cleanCategory}</span>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <select defaultValue="" className="select">
              <option value="" disabled={true}>
                Default
              </option>
              <option value="">Newest</option>
              <option value="">Price: Low to High</option>
              <option value="">Price: High to Low</option>
            </select>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CategoryNav;
