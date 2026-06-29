"use client";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFieldContext } from "./CustomFormHook";
import { LuArrowLeft, LuArrowRight, LuX } from "react-icons/lu";

const ImageUploader = ({ label }) => {
  const uploaderRef = useRef();

  const [images, setImages] = useState([]);
  const field = useFieldContext();

  const { isTouched, errors } = field.state.meta;

  const { acceptedFiles, getInputProps, getRootProps, isDragActive } =
    useDropzone({
      accept: {
        "image/*": [],
      },
      onDrop: (acceptedFiles) => {
        const newMappedFiles = acceptedFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));
        const allImages = [...images, ...newMappedFiles];
        setImages(allImages);
        field.handleChange(allImages.map((image) => image.file));
      },
      maxFiles: 10,
      maxSize: 2 * 1024 * 1024,
    });

  const handleRemove = (i) => {
    const newImages = images.filter((_, index) => index !== i);
    field.handleChange(newImages.map((image) => image.file));
    setImages(newImages);
  };

  const changeImageOrder = (i, dir) => {
    const newImages = [...images];
    const targetIndex = i + dir;

    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const temp = newImages[i];
    newImages[i] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    setImages(newImages);
    field.handleChange(newImages.map((image) => image.file));
  };

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, []);

  return (
    <>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <div
        {...getRootProps({
          className: `border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition
          ${isDragActive ? "border-primary bg-blue-50/50" : "border-gray-300 hover:border-gray-400"}
          ${isTouched && errors?.length ? "border-red-500 bg-red-50/20" : ""}`,
        })}
      >
        <input {...getInputProps()} name={field.name} />
        {isDragActive ? (
          <p>Drop files here...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {images.length > 0 && (
        <aside className="grid grid-cols-6 gap-4 mt-5 items-center">
          {images.map((image, i) => (
            <div
              className="rounded-sm border border-[#eaeaea] box-border p-1"
              key={`${image.name}-${i}`}
            >
              <div className="inline-flex aspect-square justify-center relative">
                <button
                  type="button"
                  className="btn btn-error btn-xs btn-square top-2 right-2 absolute"
                  onClick={() => handleRemove(i)}
                >
                  <LuX />
                </button>
                <img
                  src={image.preview}
                  className="w-full h-auto object-contain"
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  className={`btn btn-square btn-xs ${i === 0 ? "" : "btn-main"}`}
                  onClick={() => changeImageOrder(i, -1)}
                  disabled={i === 0}
                >
                  <LuArrowLeft />
                </button>
                <button
                  className={`btn btn-square btn-xs ${i === images.length - 1 ? "" : "btn-main"}`}
                  onClick={() => changeImageOrder(i, 1)}
                  disabled={i === images.length - 1}
                >
                  <LuArrowRight />
                </button>
              </div>
            </div>
          ))}
        </aside>
      )}
      {isTouched && errors?.length > 0 && (
        <p className="text-error">{errors[0].message}</p>
      )}
    </>
  );
};

export default ImageUploader;
