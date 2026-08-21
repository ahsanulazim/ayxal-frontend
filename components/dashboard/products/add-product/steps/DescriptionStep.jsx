import { useState } from "react";
import { LuX } from "react-icons/lu";
import dynamic from "next/dynamic";
import { Controller } from "react-hook-form";

const RichEditorField = dynamic(() => import("../fields/RichEditorField"), {
  ssr: false,
});

const DescriptionStep = ({
  register,
  control,
  watch,
  setValue,
  trigger,
  errors,
}) => {
  const [tag, setTag] = useState("");

  const tagValue = watch("tags") || [];

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const enteredTags = tag
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const uniqueNewTags = enteredTags.filter((t) => !tagValue.includes(t));
      if (uniqueNewTags.length > 0) {
        setValue("tags", [...tagValue, ...uniqueNewTags]);
        await trigger("tags");
        setTag("");
      }
    }
  };

  const removeTag = async (i) => {
    setValue(
      "tags",
      tagValue.filter((_, index) => index !== i),
    );
    await trigger("tags");
  };

  return (
    <div className="fieldset">
      <label htmlFor="tags" className="label">
        Tags
      </label>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write tag Name and press enter to add it"
            className="input w-full"
          />
        )}
      />
      {errors.tags && (
        <span className="text-error text-xs">{errors.tags.message}</span>
      )}
      <div className="flex flex-wrap gap-2 mt-2">
        {tagValue.map((t, i) => (
          <div key={i} className="badge badge-success">
            {t}
            <button
              type="button"
              onClick={() => removeTag(i)}
              className="cursor-pointer"
            >
              <LuX />
            </button>
          </div>
        ))}
      </div>
      {errors.tags && (
        <span className="text-error text-xs">{errors.tags.message}</span>
      )}
      <label htmlFor="description" className="label">
        Description
      </label>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <RichEditorField
            value={field.value}
            onChange={field.onChange}
            editorBlock="editorjs-container"
          />
        )}
      />
    </div>
  );
};

export default DescriptionStep;
