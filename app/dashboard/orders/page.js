import Breadcrumbs from "@/components/dashboard/Breadcrumbs";
import OrderData from "@/components/dashboard/orders/OrderData";

const OrdersPage = () => {
  return (
    <div className="space-y-5 pb-10">
      <Breadcrumbs title="Orders" />

      {/* Header Section */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
            Order Management
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Monitor customer orders, track Stripe payment statuses, and manage fulfillment.
          </p>
        </div>
      </section>

      {/* Main Order Data Component */}
      <section>
        <OrderData />
      </section>
    </div>
  );
};

export default OrdersPage;
