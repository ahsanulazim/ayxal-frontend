import Link from "next/link";
import { LuHouse } from "react-icons/lu";

const ShopNav = ({ category, product }) => {
  const cleanCategory = category?.replace(/-/g, " ");
  return (
    <section>
      <div className="max-w-360 mx-auto px-5">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href="/">
                <LuHouse />
              </Link>
            </li>
            {category && product?.title ? (
              <>
                <li>
                  <Link href={`/products/${category}`}>{cleanCategory}</Link>
                </li>
                <li>{product?.title}</li>
              </>
            ) : (
              category && <li>{cleanCategory}</li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ShopNav;
