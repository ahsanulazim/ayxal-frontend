import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CjTable from "@/components/dashboard/cj-dropshipping/CjTable";
import Link from "next/link";
import { LuSearch, LuSparkles, LuCheckCircle2, LuArrowRight } from "react-icons/lu";

const page = () => {
  return (
    <div className="space-y-6">
      <Breadcrumbs title="CJ Dropshipping" subtitle="Import List" />

      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-base-content">
              CJ Import List (Staging)
            </h1>
            <span className="badge badge-primary badge-soft text-xs font-semibold">
              Workflow Staging
            </span>
          </div>
          <p className="text-xs text-base-content/60 mt-1 max-w-xl">
            Shortlist winning items from CJ Dropshipping, customize their retail prices and descriptions, and publish them to your live storefront.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/cj-dropshipping/add-product">
            <button className="btn btn-main btn-sm gap-1.5 shadow-sm">
              <LuSearch className="size-4" /> Search CJ Catalog
            </button>
          </Link>
        </div>
      </section>

      {/* 3-Step Lifecycle Visual Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-base-100 border border-base-200 p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
          <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            1
          </div>
          <div>
            <h3 className="font-semibold text-xs text-base-content">Shortlist from CJ</h3>
            <p className="text-[11px] text-base-content/60 mt-0.5">
              Search CJ&apos;s global catalog and add candidate products to this staging list.
            </p>
          </div>
        </div>

        <div className="bg-base-100 border border-base-200 p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
          <div className="size-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center font-bold text-xs shrink-0">
            2
          </div>
          <div>
            <h3 className="font-semibold text-xs text-base-content">Customize & Mark Up</h3>
            <p className="text-[11px] text-base-content/60 mt-0.5">
              Filter unwanted variants, adjust profit margins, and edit titles/descriptions.
            </p>
          </div>
        </div>

        <div className="bg-base-100 border border-base-200 p-3.5 rounded-xl flex items-start gap-3 shadow-xs">
          <div className="size-8 rounded-lg bg-success/10 text-success flex items-center justify-center font-bold text-xs shrink-0">
            3
          </div>
          <div>
            <h3 className="font-semibold text-xs text-base-content">Publish & Sync</h3>
            <p className="text-[11px] text-base-content/60 mt-0.5">
              Live products appear in your store and automatically keep stock synced with CJ.
            </p>
          </div>
        </div>
      </div>

      <section>
        <CjTable />
      </section>
    </div>
  );
};

export default page;
