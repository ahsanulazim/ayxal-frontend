"use client";

import { getAllProducts } from "@/api/productApi";
import { useQuery } from "@tanstack/react-query";
import { LuStar, LuTrash2 } from "react-icons/lu";
import ProductDeleteModal from "./ProductDeleteModal";
import { useRef } from "react";

const ProductData = () => {
  const productRef = useRef();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  return (
    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
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
            <th>SKU</th>
            <th>Price</th>
            <th>Category</th>
            <th>Featured</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="8" className="text-center">
                Loading...
              </td>
            </tr>
          ) : products.length <= 0 ? (
            <tr>
              <td colSpan="8" className="text-center">
                No Products Found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.slug}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <ProductDeleteModal ref={productRef} id={product._id} />
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={
                            product.productImages[0] ||
                            product.variantDetails[0].swatchImage
                          }
                          alt={product.productName}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{product.productName}</div>
                    </div>
                  </div>
                </td>
                <td>{product.sku || "N/A"}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>
                  <button className="btn btn-circle btn-soft btn-warning">
                    <LuStar />
                  </button>
                </td>
                <td>
                  <span className="badge badge-success">
                    {product.stock < 0 ? "Out of Stock" : "In Stock"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-soft btn-error btn-circle"
                    onClick={() => productRef.current?.showModal()}
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
