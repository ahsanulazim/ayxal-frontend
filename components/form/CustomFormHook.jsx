"use client";

import {
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form-nextjs";
import TextField from "./TextField";
import SelectField from "./SelectField";
import ImageUploader from "./ImageUploader";
import SubmitButton from "./SubmitButton";
import DescriptionField from "./DescriptionField";

export const { useFieldContext, useFormContext, fieldContext, formContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    ImageUploader,
    DescriptionField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
