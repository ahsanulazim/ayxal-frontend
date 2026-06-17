"use client";

import { LuTrash2 } from "react-icons/lu";
import TypeDeleteModal from "./TypeDeleteModal";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axiosInstance";
import { getAllVariations } from "@/api/typeApi";

const TypesTable = ({ attributeSlug, attribute }) => {
  const [selectedSlug, setSelectedSlug] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["variations", attributeSlug],
    queryFn: getAllVariations,
  });

  const typeDeleteRef = useRef();

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <TypeDeleteModal ref={typeDeleteRef} slug={selectedSlug} />
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Slug</th>
            <th>Preview</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {isLoading ? (
            <div className="flex items-center justify-center">
              <span className="loading loading-spinner"></span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center">
              <h1 className="text-error">Something went wrong</h1>
            </div>
          ) : data.length <= 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No Data Found
              </td>
            </tr>
          ) : (
            data.map((variation) => (
              <tr key={variation.name}>
                <td>{variation.name}</td>
                <td>{variation.slug}</td>
                <td>
                  {variation.attributeType === "swatch" ? (
                    <div
                      className="size-8 rounded-full border border-base-content/5"
                      style={{ backgroundColor: variation.value }}
                    />
                  ) : (
                    <button className="btn btn-square">
                      {variation.value}
                    </button>
                  )}
                </td>
                <td>
                  <div className="">
                    <button
                      className="btn btn-error btn-square"
                      onClick={() => {
                        setSelectedSlug(variation.slug);
                        typeDeleteRef.current?.showModal();
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
  );
};

export default TypesTable;
