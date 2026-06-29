import { useFieldContext } from "./CustomFormHook";

const NumberField = ({ label, placeholder }) => {
  const field = useFieldContext();

  const { isTouched, errors } = field.state.meta;

  return (
    <>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <input
        type="number"
        className="input w-full"
        placeholder={placeholder}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(Number(e.target.value))}
      />
      {isTouched && errors?.length > 0 && (
        <p className="text-error">{errors[0].message}</p>
      )}
    </>
  );
};

export default NumberField;
