import { useFieldContext } from "./CustomFormHook";

const DescriptionField = ({ label }) => {
  const field = useFieldContext();

  const { errors, isTouched } = field.state.meta;

  return (
    <div>
      <label className="label" htmlFor={field.name}>
        {label}
      </label>
    </div>
  );
};

export default DescriptionField;
