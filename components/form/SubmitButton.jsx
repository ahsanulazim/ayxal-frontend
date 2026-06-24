import { useFormContext } from "./CustomFormHook";

const SubmitButton = ({ label }) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          className="btn btn-main w-full mt-5"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : `Add ${label}`}
        </button>
      )}
    </form.Subscribe>
  );
};

export default SubmitButton;
