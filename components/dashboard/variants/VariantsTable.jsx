"use client";

import { LuEye, LuTrash2 } from "react-icons/lu";
import VariantModal from "./VariantModal";
import { useRef, useState } from "react";

const VariantsTable = () => {
  const [isButton, setisButton] = useState(true);
  const variantRef = useRef();

  return (
    <div className="col-span-3">
      <VariantModal ref={variantRef} isButton={isButton} />
      <h2 className="text-lg font-bold">All Variants</h2>
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 mt-5">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <td>Cy Ganderton</td>
              <td>Quality Control Specialist</td>
              <td>
                <div className="flex gap-3">
                  <button
                    className="btn btn-circle btn-success"
                    onClick={() => {
                      variantRef.current.showModal();
                      setisButton(false);
                    }}
                  >
                    <LuEye />
                  </button>
                  <button className="btn btn-circle btn-error">
                    <LuTrash2 />
                  </button>
                </div>
              </td>
            </tr>
            {/* row 2 */}
            <tr>
              <td>Hart Hagerty</td>
              <td>Desktop Support Technician</td>
              <td>
                <div className="flex gap-3">
                  <button
                    className="btn btn-circle btn-success"
                    onClick={() => {
                      variantRef.current.showModal();
                      setisButton(true);
                    }}
                  >
                    <LuEye />
                  </button>
                  <button className="btn btn-circle btn-error">
                    <LuTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VariantsTable;
