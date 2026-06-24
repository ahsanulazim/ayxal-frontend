"use client";
import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFieldContext } from "./CustomFormHook";
import { LuX } from "react-icons/lu";

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
        const newMappedFiles = acceptedFiles.map((image) =>
          Object.assign(image, { preview: URL.createObjectURL(image) }),
        );
        const allImages = [...images, ...newMappedFiles];
        setImages(allImages);
        field.handleChange(allImages);
      },
      maxFiles: 10,
      maxSize: 2 * 1024 * 1024,
    });

  const handleRemove = (i) => {
    URL.revokeObjectURL(images[i].preview);
    const newImages = images.filter((_, index) => index !== i);
    field.handleChange(newImages.map((image) => image.file));
    setImages(newImages);
  };

  useEffect(() => {
    return () => images.forEach((image) => URL.revokeObjectURL(image.preview));
  }, [images]);

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
        <aside className="grid grid-cols-8 gap-4 mt-5 items-center">
          {images.map((image, i) => (
            <div
              className="thumb aspect-square justify-center relative"
              key={`${image.name}-${i}`}
            >
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
