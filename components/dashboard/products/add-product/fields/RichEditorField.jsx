"use client";

import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "../constants/tool";

const RichEditorField = ({ onChange, value, error, editorBlock }) => {
  const editorRef = useRef();

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: editorBlock,
        placeholder: "Write Description...",
        data: value,
        tools: EDITOR_JS_TOOLS,

        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
      });

      editorRef.current = editor;
    }
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
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
