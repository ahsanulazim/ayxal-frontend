"use client";

import { LuEye, LuTrash2 } from "react-icons/lu";
import AttributeDeleteModal from "./AttributeDeleteModal";
import { useContext, useRef, useState } from "react";
import Link from "next/link";
import { MyContext } from "@/context/MyProvider";

const AttributeTable = () => {
  const { attributes, attributesLoading, attributesError } =
    useContext(MyContext);

  const attributeDeleteRef = useRef();
  const [selectedSlug, setSelectedSlug] = useState(null);

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {attributesLoading ? (
            <tr>
              <td colSpan="4" className="text-center">
                Loading...
              </td>
            </tr>
          ) : attributesError ? (
            <tr>
              <td colSpan="4" className="text-center">
                No Data Found
              </td>
            </tr>
          ) : attributes?.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No Data Found
              </td>
            </tr>
          ) : (
            attributes?.map((attribute) => (
              <tr key={attribute.slug}>
                <td>{attribute.name}</td>
                <td>{attribute.slug}</td>
                <td>
                  <span className="badge badge-info badge-soft border-info">
                    {attribute.attributeType}
                  </span>
                </td>
                <td>
                  <div className="flex gap-3">
                    <Link
                      href={`/dashboard/attributes/${attribute.slug}`}
                      className="btn btn-success btn-circle btn-soft"
                    >
                      <LuEye />
                    </Link>
                    <button
                      className="btn btn-error btn-circle btn-soft"
                      onClick={() => {
                        setSelectedSlug(attribute.slug);
                        attributeDeleteRef.current.showModal();
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
      <AttributeDeleteModal ref={attributeDeleteRef} slug={selectedSlug} />
    </div>
  );
};

export default AttributeTable;
