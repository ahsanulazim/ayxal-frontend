"use client";

import dynamic from "next/dynamic";
import { useFieldContext } from "./CustomFormHook";

const ClientSideEditor = dynamic(() => import("./CKEditorField"), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] bg-base-200 animate-pulse rounded" />
  ),
});

const DescriptionField = ({ label }) => {
  const field = useFieldContext();
  const { errors, isTouched } = field.state.meta;

  return (
    <div className="fieldset">
      <label className="label" htmlFor={field.name}>
        {label}
      </label>
      <div>
        <ClientSideEditor
          id={field.name}
          value={field.state.value}
          onChange={(data) => field.handleChange(data)}
          onBlur={field.handleBlur}
        />
      </div>
      {isTouched && errors?.length > 0 && (
        <p className="text-error">{errors[0].message}</p>
      )}
    </div>
  );
};

export default DescriptionField;
