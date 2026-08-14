"use client";
import { MyContext } from "@/context/MyProvider";
import moment from "moment";
import { useContext, useRef, useState } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import BrandDeleteModal from "./BrandDeleteModal";

const BrandData = () => {
  const { brands, brandsLoading, brandsError } = useContext(MyContext);
  const [brandId, setBrandId] = useState("");

  const brandRef = useRef();

  return (
    <div className="my-5">
      <BrandDeleteModal ref={brandRef} id={brandId} />
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-base-200">
              <th>Logo</th>
              <th>Brand</th>
              <th>value</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {brandsLoading ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex items-center justify-center">
                    <span className="loading loading-spinner"></span>
                  </div>
                </td>
              </tr>
            ) : brandsError ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex items-center justify-center">
                    <span className="text-error">Failed to load brands</span>
                  </div>
                </td>
              </tr>
            ) : brands?.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex items-center justify-center">
                    <span className="text-warning">No brands found</span>
                  </div>
                </td>
              </tr>
            ) : (
              brands?.map((brand) => (
                <tr key={brand.value}>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={brand.logo.url} alt={brand.label} />
                      </div>
                    </div>
                  </td>
                  <td>{brand.label}</td>
                  <td>{brand.value}</td>
                  <td>{moment(brand.createdAt).format("MMMM Do, YYYY")}</td>
                  <td>
                    <div className="flex gap-3">
                      <button className="btn btn-circle btn-soft btn-info">
                        <LuSquarePen />
                      </button>
                      <button
                        className="btn btn-circle btn-soft btn-error"
                        onClick={() => {
                          brandRef.current.showModal();
                          setBrandId(brand._id);
                        }}
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
  );
};

export default BrandData;
