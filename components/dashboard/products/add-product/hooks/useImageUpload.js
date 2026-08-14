import api from "@/axios/axiosInstance";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

export const useImageUpload = (
  onUploadComplete,
  multiple = false,
  currentCount = 0,
) => {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progresses, setProgresses] = useState({});

  const { getRootProps, getInputProps, isDragActive, errors } = useDropzone({
    multiple,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;

      if (multiple && currentCount + acceptedFiles.length > 10) {
        toast.error(
          `Maximum 10 images are allowed. You currently have ${currentCount} images.`,
        );
        return;
      }

      setLoading(true);

      // Initialize progress map
      const initialProgresses = {};
      acceptedFiles.forEach((file) => {
        initialProgresses[file.name] = 0;
      });
      setProgresses(initialProgresses);

      // Create local previews with metadata
      const localPreviews = acceptedFiles.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        isLocal: true,
      }));
      setPreviews(localPreviews);

      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);

          const response = await api.post("/upload/single", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total,
              );
              setProgresses((prev) => ({
                ...prev,
                [file.name]: percentCompleted,
              }));
            },
          });
          return response.data; // returns { url, public_id }
        });

        const results = await Promise.all(uploadPromises);

        if (multiple) {
          onUploadComplete(results);
        } else {
          onUploadComplete(results[0]);
        }

        toast.success("Upload complete!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed");
        setPreviews([]);
      } finally {
        setLoading(false);
      }
    },
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    loading,
    progresses,
    previews,
    errors,
  };
};
