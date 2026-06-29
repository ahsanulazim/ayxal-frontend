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
import SelectType from "./SelectType";
import NumberField from "./NumberField";
import CheckBoxField from "./CheckBoxField";

export const { useFieldContext, useFormContext, fieldContext, formContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    SelectField,
    ImageUploader,
    DescriptionField,
    SelectType,
    NumberField,
    CheckBoxField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
