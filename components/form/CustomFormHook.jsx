"use client";

import {
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form-nextjs";
import TextField from "./TextField";
import SelectField from "./SelectField";
import ImageUploader from "./ImageUploader";
import SubmitButton from "./SubmitButton";

export const { useFieldContext, useFormContext, fieldContext, formContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    ImageUploader,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
