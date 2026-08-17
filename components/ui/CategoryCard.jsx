import Image from "next/image";
import Link from "next/link";

const CategoryCard = ({ category }) => {
  return (
    <Link
      href={`/products/${category.slug}`}
      className="hover:shadow-xl border border-gray-300 rounded-box p-2 sm:p-3 xl:p-5"
    >
      <div>
        <Image
          src={category.thumbnail.url}
          alt={category.name}
          width={300}
          height={300}
          className="rounded-box w-full"
        />
        <h3 className="text-xs xs:text-sm text-center font-medium">
          {category.name}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
