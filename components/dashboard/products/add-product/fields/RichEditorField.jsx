"use client";

import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "../constants/tool";
import { htmlToEditorJs } from "../helper/htmlToEditorJs";

const RichEditorField = ({ onChange, value, error, editorBlock }) => {
  const editorRef = useRef();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!editorRef.current && !isInitialized.current) {
      isInitialized.current = true;
      const initialData =
        typeof value === "string" ? htmlToEditorJs(value) : value;

      const editor = new EditorJS({
        holder: editorBlock,
        placeholder: "Write Description...",
        data:
          initialData && typeof initialData === "object"
            ? initialData
            : undefined,
        tools: EDITOR_JS_TOOLS,

        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
      });

      editorRef.current = editor;
    }

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  return (
    <div
      id={editorBlock}
      className="bg-base-100 rounded-box border border-gray-600 p-5"
    />
  );
};

export default RichEditorField;
