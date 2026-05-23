"use client";

import { getAllOrderData } from "@/api/orderApi";
import TakaSymbol from "@/components/ui/TakaSymbol";
import { useQuery } from "@tanstack/react-query";
import moment from "moment/moment";
import { LuEye, LuSearch, LuTrash2 } from "react-icons/lu";
import OrderDeleteModal from "./OrderDeleteModal";
import { useRef } from "react";

const OrderData = () => {
  const orderRef = useRef(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrderData,
  });

  console.log(data);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div role="tablist" className="tabs tabs-box">
          <a role="tab" className="tab tab-active">
            All
          </a>
          <a role="tab" className="tab ">
            Unpaid
          </a>
          <a role="tab" className="tab ">
            Pending
          </a>
          <a role="tab" className="tab">
            Completed
          </a>
        </div>
        <label className="input rounded-full">
          <input type="search" required placeholder="Search" />
          <LuSearch className="h-[1em] opacity-50" />
        </label>
      </div>
      <div className="my-5">
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="table">
            {/* head */}
            <thead>
              <tr className="bg-base-200">
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Date</th>
                <th>Customer</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>Total</th>
                <th>Item</th>
                <th>Fulfillment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {isLoading ? (
                <tr>
                  <td className="text-center" colSpan={9}>
                    <span className="loading loading-spinner"></span>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td className="text-center" colSpan={9}>
                    <span className="text-error">Error</span>
                  </td>
                </tr>
              ) : data?.orders?.length === 0 ? (
                <tr>
                  <td className="text-center" colSpan={9}>
                    <span>No Order</span>
                  </td>
                </tr>
              ) : (
                data?.orders?.map((order) => (
                  <tr key={order._id}>
                    <th>
                      {" "}
                      <label>
                        <input type="checkbox" className="checkbox" />
                      </label>
                    </th>
                    <td>{moment(order.createdAt).format("MMMM Do, YY")}</td>
                    <td>
                      {order.customer.firstName} {order.customer.lastName}
                    </td>
                    <td>{order.paymentMethod === "cod" ? "COD" : "Zinipay"}</td>
                    <td>
                      <div className="badge badge-warning badge-soft border-warning">
                        <div className="status status-warning"></div> Pending
                      </div>
                    </td>
                    <td>
                      <TakaSymbol />
                      {order.totalPrice}
                    </td>
                    <td>{order.products.length}</td>
                    <td>
                      <div className="badge badge-info badge-soft border-info">
                        <div className="status status-info"></div>{" "}
                        {order.status === "pending" && "Pending"}
                      </div>
                    </td>
                    <td>
                      <div className="flex">
                        <OrderDeleteModal id={order._id} ref={orderRef} />
                        <button className="btn btn-circle btn-ghost btn-success">
                          <LuEye />
                        </button>
                        <button
                          className="btn btn-circle btn-ghost btn-error"
                          onClick={() => orderRef.current.showModal()}
                        >
                          <LuTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderData;
