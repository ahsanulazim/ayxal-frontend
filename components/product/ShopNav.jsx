import Link from "next/link";
import { LuHouse } from "react-icons/lu";

const ShopNav = () => {
  return (
    <section>
      <div className="max-w-360 mx-auto">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href="/">
                <LuHouse />
              </Link>
            </li>
            <li>
              <Link href="#">Kurti</Link>
            </li>
            <li>Product Name</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ShopNav;
