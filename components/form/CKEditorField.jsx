"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CKEditorField = ({ value, onChange, onBlur, id }) => {
  return (
    <CKEditor
      id={id}
      editor={ClassicEditor}
      data={value || ""}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      onBlur={onBlur}
      onReady={(editor) => {
        editor.editing.view.change((writer) => {
          writer.setStyle(
            "min-height",
            "200px",
            editor.editing.view.document.getRoot(),
          );
        });
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
          return {
            upload() {
              return loader.file.then(
                (file) =>
                  new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve({ default: reader.result });
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                  }),
              );
            },
            abort() {},
          };
        };
      }}
    />
  );
};

export default CKEditorField;
