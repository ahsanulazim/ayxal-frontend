"use client";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Italic,
  Essentials,
  Paragraph,
  Heading,
  List,
  Link,
  BlockQuote,
  Image, // Base Image system (Inline & Block দুইটাই হ্যান্ডেল করে)
  ImageInsert,
  ImageToolbar, // ছবির নিচের টুলবার পপআপ
  ImageCaption, // ছবির নিচে ক্যাপশন লেখার সুবিধা
  ImageStyle, // ছবি বামে, ডানে নাকি সেন্টারে থাকবে সেটি ঠিক করার অপশন
  ImageResize, // ছবি ড্র্যাগ করে ছোট-বড় করার জন্য
  LinkImage, // ছবিতে লিংক যুক্ত করার এক্সট্রা ফিচার (অফিসিয়াল রিকমেন্ডেড)
  Base64UploadAdapter,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";

const CKEditorField = ({ value, onChange, onBlur, id }) => {
  return (
    <CKEditor
      config={{
        licenseKey: "GPL",
        plugins: [
          Essentials,
          Bold,
          Italic,
          Paragraph,
          Heading,
          List,
          Link,
          BlockQuote,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
          ImageInsert,
          LinkImage, // Plugin লিস্টে যুক্ত করা হলো
          Base64UploadAdapter,
        ],
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "link",
          "insertImage", // এটি দিয়ে মেইন টুলবারে ড্রপডাউন বাটন আসবে
          "|",
          "bulletedList",
          "numberedList",
          "blockQuote",
          "undo",
          "redo",
        ],
        image: {
          // contextual image toolbar কনফিগারেশন (ডকুমেন্টেশন অনুযায়ী)
          toolbar: [
            "imageStyle:inline",
            "imageStyle:block",
            "imageStyle:side",
            "|",
            "toggleImageCaption",
            "imageTextAlternative",
            "|",
            "linkImage", // ছবিতে ক্লিক করলে লিংকের অপশনটি এটার জন্য আসবে
          ],
          insert: {
            // 'auto' দিলে ব্রাউজার কার্সারের পজিশন বুঝে ইমেজ টাইপ (Inline vs Block) সিলেক্ট করবে
            type: "auto",
          },
        },
      }}
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
            "300px", // আপনার আগের ২০০px এর জায়গায় ৩০০px বা পছন্দমত দিতে পারেন
            editor.editing.view.document.getRoot(),
          );
        });
      }}
    />
  );
};

export default CKEditorField;
