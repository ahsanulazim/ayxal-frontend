"use client";

import React, { useEffect, useRef, useState, useId } from "react";

export default function FormRichText({
  field,
  label = "Product Description",
  placeholder = "Write a comprehensive description about this product...",
  helperText = "",
  className = "",
}) {
  const reactId = useId();
  const holderId = `editorjs-stepper-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const editorRef = useRef(null);
  const isInitialized = useRef(false);
  const [isReady, setIsReady] = useState(false);

  const value = field?.state?.value;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let editorInstance = null;

    const initEditor = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        const [
          { default: EditorJS },
          { default: Header },
          { default: EditorjsList },
          { default: Checklist },
          { default: RawTool },
        ] = await Promise.all([
          import("@editorjs/editorjs"),
          import("@editorjs/header"),
          import("@editorjs/list"),
          import("@editorjs/checklist"),
          import("@editorjs/raw"),
        ]);

        const tools = {
          header: {
            class: Header,
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
          checklist: Checklist,
          list: {
            class: EditorjsList,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          raw: RawTool,
        };

        let parsedData = undefined;
        if (value) {
          if (typeof value === "object" && value.blocks) {
            parsedData = value;
          } else if (typeof value === "string") {
            try {
              const json = JSON.parse(value);
              if (json && json.blocks) parsedData = json;
            } catch (e) {
              parsedData = {
                time: Date.now(),
                blocks: [
                  {
                    type: "paragraph",
                    data: { text: value },
                  },
                ],
              };
            }
          }
        }

        editorInstance = new EditorJS({
          holder: holderId,
          placeholder: placeholder,
          data: parsedData,
          tools: tools,
          minHeight: 120,
          async onChange(api) {
            const outputData = await api.saver.save();
            field?.handleChange(outputData);
          },
          onReady: () => {
            setIsReady(true);
          },
        });

        editorRef.current = editorInstance;
      } catch (err) {
        console.error("EditorJS initialization error:", err);
      }
    };

    initEditor();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        try {
          editorRef.current.destroy();
        } catch (e) {
          // ignore destroy errors during unmount
        }
        editorRef.current = null;
        isInitialized.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holderId]);

  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label py-1.5 flex justify-between items-center text-sm font-semibold text-base-content/90">
          <span>{label}</span>
          {helperText && (
            <span className="text-xs text-base-content/50 font-normal">
              {helperText}
            </span>
          )}
        </label>
      )}

      <div className="relative min-h-[160px] rounded-2xl border border-base-300 bg-base-100 p-4 transition-all duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-xs rounded-2xl z-10 text-xs text-base-content/60 gap-2">
            <span className="loading loading-spinner loading-xs text-primary" />
            Loading rich editor...
          </div>
        )}
        <div id={holderId} className="prose prose-sm max-w-none text-base-content" />
      </div>
    </div>
  );
}
