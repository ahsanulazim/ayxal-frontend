import CjTable from "@/components/dashboard/cj-dropshipping/CjTable";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";

const page = () => {
  return (
    <>
      <section className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Products in the Store</h1>
          <p className="text-sm opacity-50">
            Add, remove, update, import, sync from CJ Dropshipping
          </p>
        </div>
        <Link href="/dashboard/cj-dropshipping/add-product">
          <button className="btn btn-main">
            <LuPlus /> Add Products
          </button>
        </Link>
      </section>
      <section>
        <CjTable />
      </section>
    </>
  );
};

export default page;
