import { useFieldArray, useFormContext } from "react-hook-form";
import { LuPlus, LuTrash2 } from "react-icons/lu";

const VitalInformationStep = ({ register, control, errors }) => {
  const { append, fields, remove } = useFieldArray({
    control,
    name: "vitalInformations",
  });

  return (
    <form className="fieldset">
      <h1 className="text-xl font-bold">Vital Information</h1>
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-3 items-center w-full">
            <div className="flex flex-col w-1/2 fieldset">
              <input
                type="text"
                placeholder="Label"
                className="input w-full"
                {...register(`vitalInformations.${index}.label`)}
              />
              {errors.vitalInformations?.[index]?.label && (
                <span className="text-error text-xs">
                  {errors.vitalInformations[index].label.message}
                </span>
              )}
            </div>
            <div className="flex flex-col w-1/2 fieldset">
              <input
                type="text"
                placeholder="Value"
                className="input w-full"
                {...register(`vitalInformations.${index}.value`)}
              />
              {errors.vitalInformations?.[index]?.value && (
                <span className="text-error text-xs">
                  {errors.vitalInformations[index].value.message}
                </span>
              )}
            </div>
            <button
              type="button"
              className="btn btn-error btn-sm btn-square"
              onClick={() => remove(index)}
            >
              <LuTrash2 />
            </button>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-success btn-sm btn-square"
          onClick={() => append({ label: "", value: "" })}
        >
          <LuPlus />
        </button>
      </div>
    </form>
  );
};

export default VitalInformationStep;
