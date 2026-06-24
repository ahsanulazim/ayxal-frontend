import { useFieldContext } from "./CustomFormHook";

const SelectField = ({ label, data, isLoading, isError }) => {
  const field = useFieldContext();

  const { isTouched, errors } = field.state.meta;

  return (
    <>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <select
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        className="select w-full"
      >
        <option value="" disabled={true}>
          Select {label}
        </option>
        {isLoading ? (
          <option disabled={true}>Loading...</option>
        ) : isError ? (
          <option disabled={true}>Error loading {label}</option>
        ) : data?.length === 0 ? (
          <option disabled={true}>No {label} found</option>
        ) : (
          data?.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))
        )}
      </select>
      {isTouched && errors?.length > 0 && (
        <p className="text-error">{errors[0].message}</p>
      )}
    </>
  );
};

export default SelectField;
