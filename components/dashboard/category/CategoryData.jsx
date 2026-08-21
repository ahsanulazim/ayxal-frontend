"use client";
import { MyContext } from "@/context/MyProvider";
import moment from "moment";
import { useContext, useRef, useState } from "react";
import { LuSquarePen, LuTrash2 } from "react-icons/lu";
import CategoryDeleteModal from "./CategoryDeleteModal";
import EditCategoryModal from "./EditCategoryModal";

const CategoryData = () => {
  const { categories, categoriesLoading, categoriesError } =
    useContext(MyContext);

  const [categoryId, setCategoryId] = useState("");
  const categoryDelRef = useRef(null);
  const categoryEditRef = useRef(null);

  return (
    <div className="my-5">
      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <EditCategoryModal categoryId={categoryId} ref={categoryEditRef} />
        <CategoryDeleteModal ref={categoryDelRef} id={categoryId} />
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-base-200">
              <th>Thumbnail</th>
              <th>Category</th>
              <th>Slug</th>
              <th>Items</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {categoriesLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td>
                    <div className="mask mask-squircle">
                      <div className="skeleton aspect-square size-12"></div>
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
                    <div className="skeleton h-6 w-28"></div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="skeleton size-8 rounded-full"></div>
                      <div className="skeleton size-8 rounded-full"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : categoriesError ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex items-center justify-center">
                    <span className="text-error">
                      Failed to load categories
                    </span>
                  </div>
                </td>
              </tr>
            ) : categories?.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex items-center justify-center">
                    <span className="text-warning">No categories found</span>
                  </div>
                </td>
              </tr>
            ) : (
              categories?.map((category) => (
                <tr key={category._id}>
                  <td>
                    {category.thumbnail ? (
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          <img
                            src={category.thumbnail.url}
                            alt={category.name}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar avatar-placeholder">
                        <div className="bg-neutral text-neutral-content w-12 rounded-full">
                          <span className="text-xl">
                            {category.name.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </td>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>{category?.itemsCount || 0}</td>
                  <td>{moment(category.createdAt).format("MMMM Do, YYYY")}</td>
                  <td>
                    <div className="flex gap-3">
                      <button
                        className="btn btn-circle btn-soft btn-info"
                        onClick={() => {
                          setCategoryId(category._id);
                          categoryEditRef.current.showModal();
                        }}
                      >
                        <LuSquarePen />
                      </button>
                      <button
                        className="btn btn-circle btn-soft btn-error"
                        onClick={() => {
                          setCategoryId(category._id);
                          categoryDelRef.current.showModal();
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

export default CategoryData;
