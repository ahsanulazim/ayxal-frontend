import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import AddVariant from "@/components/dashboard/variants/AddVariant";
import VariantsTable from "@/components/dashboard/variants/VariantsTable";
import Link from "next/link";
import { LuPlus } from "react-icons/lu";

const page = () => {
  return (
    <>
      <Breadcrumbs title="Variants" />
      <section className="mb-5">
        <h2 className="font-bold text-2xl w-1/2">Variants</h2>
      </section>
      <section>
        <div className="grid grid-cols-4 gap-5 items-start">
          <AddVariant />
          <VariantsTable />
        </div>
      </section>
    </>
  );
};

export default page;
