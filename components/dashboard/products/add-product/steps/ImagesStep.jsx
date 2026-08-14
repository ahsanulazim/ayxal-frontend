import { useContext } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import ImageUploadField from "../fields/ImageUploadField";
import { MyContext } from "@/context/MyProvider";

const ImagesStep = ({ control }) => {
  const { attributes } = useContext(MyContext);
  const { fields } = useFieldArray({
    control,
    name: "variations",
  });

  const watchedVariations =
    useWatch({
      control,
      name: "variations",
    }) || [];

  return (
    <div className="flex flex-col gap-5">
      <ImageUploadField
        control={control}
        name="thumbnail"
        label="Product Thumbnail"
      />
      <ImageUploadField
        control={control}
        name="images"
        label="Product Gallery"
        multiple
      />
      {/* variants */}
      {fields.map((field, index) => {
        const variant = watchedVariations[index] || field;
        const attributeKeys = Object.keys(variant).filter(
          (key) =>
            ![
              "id",
              "stock",
              "price",
              "discount",
              "thumbnail",
              "images",
            ].includes(key),
        );
        const variantName = attributeKeys
          .map((key) => {
            const val = variant[key];
            if (!val) return "";
            const attrDef = attributes.find((a) => a.value === key);
            if (attrDef && attrDef.options) {
              const option = attrDef.options.find((opt) => opt.value === val);
              if (option) return option.label;
            }
            return String(val)
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          })
          .filter(Boolean)
          .join(" - ");

        return (
          <div key={field.id} className="bg-base-100 p-4 rounded-box">
            <h3 className="font-semibold mb-2">
              {variantName || `Variant ${index + 1}`}
            </h3>
            <div className="mb-5">
              <ImageUploadField
                control={control}
                name={`variations.${index}.thumbnail`}
                label="Variant Thumbnail"
                boxColor="bg-base-300"
              />
            </div>
            <div>
              <ImageUploadField
                control={control}
                name={`variations.${index}.images`}
                multiple
                label="Variant Gallery"
                boxColor="bg-base-300"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImagesStep;
