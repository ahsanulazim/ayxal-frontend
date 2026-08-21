import Link from "next/link";
import { LuHouse } from "react-icons/lu";

const ShopNav = ({ category, slug, product }) => {
  return (
    <div className="">
      <nav className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/">
              <LuHouse />
            </Link>
          </li>
          {category && product?.title ? (
            <>
              <li>
                <Link href={`/products/${slug}`}>{category}</Link>
              </li>
              <li>{product?.title}</li>
            </>
          ) : (
            category && <li>{category}</li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default ShopNav;
