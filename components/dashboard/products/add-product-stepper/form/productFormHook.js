"use client";

import {
  createFormHook,
  createFormHookContexts,
  useStore,
} from "@tanstack/react-form";
import FormInput from "../fields/FormInput";
import FormSelect from "../fields/FormSelect";
import FormSwitch from "../fields/FormSwitch";
import FormImageDropzone from "../fields/FormImageDropzone";
import FormRichText from "../fields/FormRichText";
import VariantImageUploader from "../fields/VariantImageUploader";

export const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup, extendForm } =
  createFormHook({
    fieldComponents: {
      Input: FormInput,
      Select: FormSelect,
      Switch: FormSwitch,
      ImageDropzone: FormImageDropzone,
      RichText: FormRichText,
      VariantImage: VariantImageUploader,
    },
    fieldContext,
    formContext,
  });

export { useStore };

export function useFormStore(form, selector = (s) => s) {
  return useStore(form.store, selector);
}
