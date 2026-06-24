import { useFieldContext } from "./CustomFormHook";

const TextField = ({ label, placeholder }) => {
  const field = useFieldContext();

  const { errors, isTouched } = field.state.meta;

  return (
    <>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <input
        type="text"
        className="input w-full"
        placeholder={placeholder}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {isTouched && errors?.length > 0 && (
        <p className="text-error">{errors[0].message}</p>
      )}
    </>
  );
};

export default TextField;
