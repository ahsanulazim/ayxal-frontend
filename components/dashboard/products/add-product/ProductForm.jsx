"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuCloudUpload, LuX } from "react-icons/lu";
import ReactQuill from "react-quill-new";

const ProductForm = ({ ref }) => {
  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  const queryClient = useQueryClient();

  //quill formats
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
  ];

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }], // Heading options
      ["bold", "italic", "underline", "strike"], // Text styles
      [{ list: "ordered" }, { list: "bullet" }], // Lists
      [{ align: [] }], // Alignment
      ["blockquote", "code-block"], // Block styles
      ["link", "image"], // Links & Images
      ["clean"], // Remove formatting
    ],
  };

  const [images, setImages] = useState([]);
  const [coverIndex, setCoverIndex] = useState(0); // default first image cover

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previewUrls]);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previewUrls]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    if (index === coverIndex) setCoverIndex(0); // reset cover if removed
  };

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-3 gap-5"
    >
      <div className="col-span-2">
        <div className="fieldset bg-base-100 p-5 rounded-box">
          <h2 className="font-bold text-xl">Basic Information</h2>
          <label htmlFor="productName" className="label">
            Product Name<span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="Women's Fashionable Kurti"
            {...register("productName", { required: "Title is required" })}
          />
          {errors.productName && (
            <p className="text-red-600">{errors.productName.message}</p>
          )}

          <label className="label">
            Slug<span className="text-red-600">*</span>
          </label>
          <label className="input w-full">
            <span className="label">https://oiki.store/products/</span>
            <input
              type="text"
              placeholder="womens-fashionable-kurti"
              {...register("slug", { required: "Product Slug is Required" })}
            />
          </label>

          {errors.slug && <p className="text-red-600">{errors.slug.message}</p>}

          <label htmlFor="productDescription" className="label">
            Product Description<span className="text-red-600">*</span>
          </label>
          <Controller
            name="productDescription"
            rules={{ required: "Product Description is required" }}
            control={control}
            render={({ field }) => (
              <ReactQuill
                className="border border-gray-300 rounded-md"
                {...field}
                modules={modules}
                formats={formats}
              />
            )}
          />
          {errors.productDescription && (
            <p className="text-red-600">{errors.productDescription.message}</p>
          )}
        </div>
        <div className="fieldset bg-base-100 p-5 rounded-box mt-5">
          <h2 className="font-bold text-xl">Pricing</h2>
          <div className="flex gap-5 items-center">
            <div className="flex-1">
              <label htmlFor="price" className="label">
                Price<span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                className="input w-full"
                placeholder="1000"
                {...register("price", { required: "Price is required" })}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="discount" className="label">
                Discount
              </label>
              <input
                type="number"
                className="input w-full"
                placeholder="1000"
                {...register("discount", { required: false })}
              />
            </div>
          </div>
          {errors.price && (
            <p className="text-red-600">{errors.price.message}</p>
          )}
        </div>
        <div className="fieldset bg-base-100 p-5 rounded-box mt-5">
          <h2 className="font-bold text-xl">Product Variants</h2>

          <label htmlFor="price" className="label">
            Options
          </label>
          <select defaultValue="" className="select">
            <option value="" disabled={true}>
              options
            </option>
            <option>Size</option>
            <option>Color</option>
            <option>Fabric</option>
          </select>
        </div>
      </div>
      <div>
        <div className="fieldset bg-base-100 p-5 rounded-box">
          <h2 className="font-bold text-xl">Product Images</h2>
          <label className="label">Upload Images</label>
          <label
            className="border border-dashed border-main bg-main/5 rounded-box p-5 cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center">
              <LuCloudUpload className="text-main size-25" />
              <h3 className="text-base text-center max-w-55">
                Drag and Drop or click here to Upload Images
              </h3>
            </div>
            <input
              className="hidden"
              type="file"
              multiple
              accept="image/*"
              {...register("productImage", {
                required: "Upload atleast one product Image",
                validate: {
                  lessThan5MB: (files) =>
                    files[0].size <= 5 * 1024 * 1024 ||
                    "File size must be less than 5MB",
                },
                onChange: (e) => handleImageUpload(e),
              })}
            />
          </label>
          {/* Preview thumbnails */}
          {images.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {images.map((src, i) => (
                <div key={i} className="relative">
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="w-24 h-24 object-cover rounded-box border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer"
                  >
                    <LuX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {errors.productImage && (
            <p className="text-red-600">{errors.productImage.message}</p>
          )}
        </div>
        <div className="fieldset bg-base-100 p-5 rounded-box mt-5">
          <h2 className="font-bold text-xl">Inventory</h2>
          <label htmlFor="sku" className="label">
            SKU
          </label>
          <input
            type="text"
            className="input w-full"
            placeholder="OIKIXYZ"
            {...register("sku", { required: false })}
          />

          <label className="label">Stock</label>
          <input
            type="number"
            placeholder="10"
            className="input w-full"
            {...register("stock", { required: false })}
          />
        </div>
        <div className="fieldset bg-base-100 p-5 rounded-box mt-5">
          <h2 className="font-bold text-xl">Categories</h2>
          <label htmlFor="category" className="label">
            Select Category
          </label>
          <select
            defaultValue=""
            className="select w-full"
            {...register("category", { required: "Category is required" })}
          >
            <option value="" disabled={true}>
              Select a Category
            </option>
            <option value="kurti">Kurti</option>
            <option value="three-piece">Three-piece</option>
            <option value="two-piece">Two-piece</option>
          </select>
          {errors.category && (
            <p className="text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
