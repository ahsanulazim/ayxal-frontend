"use client";

import StatCard from "@/components/account/StatCard";
import PetRecommendations from "@/components/account/PetRecommendations";
import { MyContext } from "@/context/MyProvider";
import { getMyOrders } from "@/api/orderApi";
import { getUserData } from "@/api/usersApi";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useContext } from "react";
import { FaPaw } from "react-icons/fa6";
import {
  LuCircleHelp,
  LuClock,
  LuExternalLink,
  LuHeart,
  LuMapPin,
  LuPackage,
  LuShoppingBag,
  LuSparkles,
} from "react-icons/lu";

const AccountOverviewPage = () => {
  const { newUser } = useContext(MyContext);
  const email = newUser?.user?.email;

  // Fetch full user data (pets, addresses, wishlist)
  const { data: userDataResp, isLoading: isUserLoading } = useQuery({
    queryKey: ["userData", email],
    queryFn: () => getUserData(email),
    enabled: !!email,
  });

  // Fetch customer orders
  const { data: ordersResp, isLoading: isOrdersLoading } = useQuery({
    queryKey: ["myOrders", email, { limit: 5 }],
    queryFn: () => getMyOrders({ email, limit: 5 }),
    enabled: !!email,
  });

  const user = userDataResp?.user || newUser?.user || {};
  const orders = ordersResp?.orders || [];
  const totalOrders = ordersResp?.pagination?.total ?? orders.length;
  const pets = user?.pets || [];
  const addresses = user?.addresses || [];
  const wishlist = user?.wishlist || [];

  const getStatusBadge = (status) => {
    switch ((status || "").toLowerCase()) {
      case "delivered":
        return "badge-success text-white";
      case "shipped":
        return "badge-info text-white";
      case "processing":
      case "paid":
        return "badge-warning text-white";
      case "cancelled":
        return "badge-error text-white";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-main to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold">
            <LuSparkles className="size-3.5" /> PretyPet Member
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user?.name ? user.name.split(" ")[0] : "Friend"}! 🐾
          </h2>
          <p className="text-white/80 text-xs sm:text-sm">
            Track your pet supplies orders, manage pet health profiles, and
            enjoy member-exclusive perks.
          </p>
        </div>

        {/* Decorative background paw */}
        <FaPaw className="absolute right-4 -bottom-6 size-44 text-white/10 pointer-events-none rotate-12" />
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Orders"
          count={totalOrders}
          subtitle="View order history"
          icon={LuPackage}
          href="/account/orders"
        />
        <StatCard
          title="My Pets"
          count={pets.length}
          subtitle={
            pets.length
              ? `${pets.length} pet profile${pets.length > 1 ? "s" : ""}`
              : "Add a pet"
          }
          icon={FaPaw}
          href="/account/pets"
        />
        <StatCard
          title="Addresses"
          count={addresses.length}
          subtitle="Shipping destinations"
          icon={LuMapPin}
          href="/account/addresses"
        />
        <StatCard
          title="Wishlist"
          count={wishlist.length}
          subtitle="Saved items"
          icon={LuHeart}
          href="/account/wishlist"
        />
      </div>

      {/* Smart Pet Personalized Recommendations */}
      {pets.length > 0 && <PetRecommendations pets={pets} />}

      {/* Pet Registration Callout if 0 pets */}
      {pets.length === 0 && (
        <div className="bg-base-100 rounded-3xl p-6 border border-dashed border-main/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-main/10 text-main flex items-center justify-center shrink-0">
              <FaPaw className="size-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-base-content">
                Add Your Pet&apos;s Profile 🐶🐱
              </h4>
              <p className="text-xs text-base-content/70">
                Unlock breed-specific food recommendations, weight tracking, and
                birthday discounts!
              </p>
            </div>
          </div>
          <Link
            href="/account/pets"
            className="btn btn-main btn-sm rounded-xl px-4 shrink-0"
          >
            Add Pet Now
          </Link>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
              <LuClock className="size-5 text-main" /> Recent Orders
            </h3>
            <p className="text-xs text-base-content/60">
              Your latest pet supplies purchases
            </p>
          </div>
          <Link
            href="/account/orders"
            className="text-xs font-semibold text-main hover:underline flex items-center gap-1"
          >
            View All ({totalOrders}) <LuExternalLink className="size-3.5" />
          </Link>
        </div>

        {isOrdersLoading ? (
          <div className="space-y-3 py-4">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="h-20 bg-base-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-base-200 flex items-center justify-center text-base-content/40">
              <LuShoppingBag className="size-7" />
            </div>
            <h4 className="font-semibold text-base-content">
              No orders placed yet
            </h4>
            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
              Treat your furry companions with high-quality food, toys, and
              grooming essentials.
            </p>
            <Link href="/" className="btn btn-main btn-sm rounded-xl px-5 mt-2">
              Explore Pet Shop
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-base-200">
            {orders.slice(0, 3).map((order) => {
              const productCount = (order.products || []).reduce(
                (sum, p) => sum + (p.quantity || 1),
                0,
              );
              return (
                <div
                  key={order._id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-2 last:pb-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-base-200 overflow-hidden shrink-0 flex items-center justify-center border border-base-300">
                      {order.products?.[0]?.thumbnail ? (
                        <img
                          src={order.products[0].thumbnail}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <LuPackage className="size-5 text-base-content/40" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-base-content">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`badge badge-sm font-semibold capitalize ${getStatusBadge(order.orderStatus)}`}
                        >
                          {order.orderStatus || "Pending"}
                        </span>
                      </div>
                      <p className="text-xs text-base-content/60 mt-0.5">
                        {productCount} item{productCount > 1 ? "s" : ""} •{" "}
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "Recent"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-bold text-base text-base-content">
                      ${Number(order.total || 0).toFixed(2)}
                    </span>
                    <Link
                      href={`/account/orders/${order._id}`}
                      className="btn btn-outline btn-xs btn-main rounded-lg px-3"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Help & Support Quick Box */}
      <div className="bg-base-100 rounded-3xl p-5 border border-base-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-main/10 text-main flex items-center justify-center shrink-0">
            <LuCircleHelp className="size-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-base-content">
              Need help with an order?
            </h4>
            <p className="text-xs text-base-content/60">
              Our 24/7 pet care specialists are ready to assist you.
            </p>
          </div>
        </div>
        <Link
          href="mailto:support@pretypet.com"
          className="btn btn-ghost btn-sm text-main hover:bg-main/10 rounded-xl"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default AccountOverviewPage;
