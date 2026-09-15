import api from "@/axios/axiosInstance";
import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import CjImportLayout from "@/components/dashboard/cj-dropshipping/import/CjImportLayout";
import Link from "next/link";
import { LuArrowLeft, LuCircleAlert } from "react-icons/lu";

const Page = async ({ params }) => {
  const { store } = await params;

  let productData = null;
  let errorMsg = null;

  try {
    const res = await api.get(`/cj-dropship/product-details`, {
      params: { pid: store },
    });
    productData = res.data;
  } catch (error) {
    console.error("Failed to load CJ product details for import:", error);
    errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Failed to load product from CJ";
  }

  if (!productData?.product) {
    return (
      <div className="space-y-6">
        <Breadcrumbs title="CJ Dropshipping" subtitle="Customize & Import" />
        <div className="card bg-base-100 border border-base-200 p-8 text-center max-w-md mx-auto space-y-4">
          <div className="size-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
            <LuCircleAlert className="size-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">
              Product Not Found or Rate Limited
            </h2>
            <p className="text-xs text-base-content/60 mt-1">
              {errorMsg ||
                "Unable to retrieve specifications for this product from CJ."}
            </p>
          </div>
          <Link
            href="/dashboard/cj-dropshipping"
            className="btn btn-sm btn-outline gap-1"
          >
            <LuArrowLeft className="size-4" /> Back to CJ Shortlist
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs title="CJ Dropshipping" subtitle="Customize & Import" />
      <CjImportLayout cjData={productData} />
    </div>
  );
};

export default Page;
