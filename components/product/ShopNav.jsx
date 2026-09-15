import Link from "next/link";
import { LuChevronRight, LuHouse } from "react-icons/lu";

const ShopNav = ({ category, slug, product }) => {
  const categoryTitle = typeof category === "object" ? category?.name : category;
  const categorySlug = typeof slug === "object" ? slug?.slug : slug;

  return (
    <nav aria-label="Breadcrumb" className="py-2.5">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-zinc-500 font-medium">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-zinc-600 hover:text-main transition-colors p-1 -m-1 rounded-md"
            title="Home"
          >
            <LuHouse className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {categoryTitle && (
          <>
            <li className="text-zinc-300">
              <LuChevronRight className="w-3.5 h-3.5" />
            </li>
            <li>
              <Link
                href={categorySlug ? `/products/${categorySlug}` : "/products"}
                className="hover:text-main transition-colors capitalize hover:underline"
              >
                {categoryTitle}
              </Link>
            </li>
          </>
        )}

        {product?.title && (
          <>
            <li className="text-zinc-300">
              <LuChevronRight className="w-3.5 h-3.5" />
            </li>
            <li className="text-zinc-900 font-semibold truncate max-w-[200px] sm:max-w-md md:max-w-lg">
              {product.title}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};

export default ShopNav;
