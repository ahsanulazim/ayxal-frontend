import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import OrderDetailsView from "@/components/dashboard/orders/order/OrderDetailsView";
import Link from "next/link";
import { LuArrowLeft, LuPackageX } from "react-icons/lu";

const OrderDetailsPage = async ({ params }) => {
  const { order } = await params;

  let orderData = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/orders/getOrderDetails?orderId=${order}`,
      { cache: "no-store" },
    );
    orderData = await res.json();
  } catch (error) {
    console.error("Error fetching order details:", error);
  }

  if (!orderData?.success || !orderData?.order) {
    return (
      <div className="space-y-6">
        <Breadcrumbs title="Orders" subtitle="Not Found" />
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/80 shadow-xs max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-4">
            <LuPackageX className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900">Order Not Found</h2>
          <p className="text-xs text-zinc-500 mt-1 mb-6">
            The order you are looking for does not exist or may have been deleted.
          </p>
          <Link
            href="/dashboard/orders"
            className="btn btn-main btn-sm rounded-xl px-5 font-bold inline-flex items-center gap-2"
          >
            <LuArrowLeft className="w-4 h-4" /> Return to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Breadcrumbs title="Orders" subtitle={`#${orderData.order.orderNumber}`} />
      <OrderDetailsView initialOrder={orderData.order} />
    </div>
  );
};

export default OrderDetailsPage;
