export default function FormFieldError({ field }) {
  if (field.state.meta.isValid) {
    return null;
  }

  const message = field.state.meta.errors
    ?.map((error) => (typeof error === "string" ? error : error?.message))
    .filter(Boolean)
    .join(", ");

  if (!message) {
    return null;
  }

  return (
    <p role="alert" className="mt-1 text-sm text-error">
      {message}
    </p>
  );
}
