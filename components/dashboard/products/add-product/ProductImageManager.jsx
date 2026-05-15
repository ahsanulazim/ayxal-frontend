"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/react"; // Direct package theke import
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuCloudUpload, LuX } from "react-icons/lu";

// Sortable Item Component
const SortableImage = ({ src, index, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: src });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative cursor-grab active:cursor-grabbing"
    >
      <img
        src={src}
        alt={`preview-${index}`}
        className="w-24 h-24 object-cover rounded-box border shadow-sm"
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Jate delete korar somoy drag trigger na hoy
          onRemove(index);
        }}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"
      >
        <LuX size={14} />
      </button>
    </div>
  );
};

// Main Component
export default function ProductImageManager() {
  const [images, setImages] = useState([]); // Apnar image state

  // Sensors config: Drag start hobar age ektu distance move korte hobe
  // Jate click korle ba delete-e press korle drag activate na hoy
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages((prevItems) => {
        const oldIndex = prevItems.indexOf(active.id);
        const newIndex = prevItems.indexOf(over.id);
        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="fieldset bg-base-100 p-5 rounded-box border border-base-200">
      <h2 className="font-bold text-xl">Product Images</h2>
      <label className="label">Upload Images</label>

      {/* Upload Area */}
      <label className="border border-dashed border-main bg-main/5 rounded-box p-8 cursor-pointer flex flex-col items-center hover:bg-main/10 transition-colors">
        <LuCloudUpload className="text-main size-12 mb-2" />
        <h3 className="text-sm text-center">
          Drag and Drop or click here to Upload Images
        </h3>
        <input
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          onChange={(e) => {
            /* Handle upload logic to setImages */
          }}
        />
      </label>

      {/* Sortable Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={images}
          strategy={rectSortingStrategy} // Grid layout er jonno best
        >
          <div className="flex gap-4 mt-6 flex-wrap">
            {images.map((src, i) => (
              <SortableImage
                key={src}
                src={src}
                index={i}
                onRemove={removeImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
