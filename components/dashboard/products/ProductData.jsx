"use client";

import { LuStar, LuTrash2 } from "react-icons/lu";
import ProductDeleteModal from "./ProductDeleteModal";
import { useRef, useState } from "react";
import moment from "moment";

const ProductData = ({ products, productsLoading, productsError }) => {
  const productRef = useRef();
  const [productId, setProductId] = useState("");

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
      <ProductDeleteModal ref={productRef} id={productId} />
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Featured</th>
            <th>Stock</th>
            <th>Created</th>
            <th>Last Update</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productsLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <tr key={i}>
                <th>
                  <div className="skeleton size-6"></div>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="mask mask-squircle">
                      <div className="skeleton aspect-square size-12"></div>
                    </div>
                    <div className="skeleton h-6 w-xl flex-1"></div>
                  </div>
                </td>
                <td>
                  <div className="skeleton h-6 w-34"></div>
                </td>
                <td>
                  <div className="skeleton h-6 w-28"></div>
                </td>
                <td>
                  <div className="skeleton size-10 rounded-full"></div>
                </td>
                <td>
                  <div className="skeleton h-6 w-16"></div>
                </td>
                <td>
                  <div className="skeleton h-6 w-28"></div>
                </td>
                <td>
                  <div className="skeleton h-6 w-28"></div>
                </td>
                <td>
                  <div className="skeleton size-10 rounded-full"></div>
                </td>
              </tr>
            ))
          ) : productsError ? (
            <tr>
              <td colSpan="9" className="text-center">
                Failed to fetch products
              </td>
            </tr>
          ) : products?.products.length <= 0 ? (
            <tr className="h-96">
              <td colSpan="9" className="text-center">
                No Products Found
              </td>
            </tr>
          ) : (
            products?.products?.map((product) => (
              <tr key={product._id}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={
                            product?.thumbnail?.url ||
                            product?.thumbnail ||
                            "/default-product.jpg"
                          }
                          alt={product.title}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold line-clamp-1">
                        {product.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap">{product.category}</td>
                <td className="whitespace-nowrap">${product.price}</td>
                <td>
                  <button className="btn btn-circle btn-soft btn-warning">
                    <LuStar />
                  </button>
                </td>
                <td>
                  <span
                    className={`whitespace-nowrap ${product.stock < 1 ? "badge  badge-error" : ""}`}
                  >
                    {product.stock < 1 ? "Out of Stock" : product.stock}
                  </span>
                </td>
                <td className="whitespace-nowrap">
                  {moment(product.createdAt).format("MMM Do, YY")}
                </td>
                <td className="whitespace-nowrap">
                  {moment(product.updatedAt).format("MMM Do, YY")}
                </td>
                <td>
                  <button
                    className="btn btn-soft btn-error btn-circle"
                    onClick={() => {
                      setProductId(product._id);
                      productRef.current?.showModal();
                    }}
                  >
                    <LuTrash2 />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductData;
