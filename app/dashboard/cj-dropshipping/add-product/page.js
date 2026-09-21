import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CjSearch from "@/components/dashboard/cj-dropshipping/add-product/CjSearch";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";

const page = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs title="CJ Dropshipping" subtitle="Search Catalog" />
        <Link
          href="/dashboard/cj-dropshipping"
          className="btn btn-ghost btn-sm gap-1.5 text-xs text-base-content/70 hover:text-base-content"
        >
          <LuArrowLeft className="size-3.5" /> Back to Import List
        </Link>
      </div>
      <section className="mb-5">
        <CjSearch />
      </section>
    </div>
  );
};

export default page;
