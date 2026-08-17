import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import ImageTool from "@editorjs/image";
import LinkTool from "@editorjs/link";
import RawTool from "@editorjs/raw";

export const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    levels: [1, 2, 3, 4, 5, 6],
    defaultLevel: 3,
  },
  checklist: Checklist,
  List: {
    class: EditorjsList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: `${process.env.NEXT_PUBLIC_SERVER_URL}/upload/editorUpload`, // Your backend file uploader endpoint
        byUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}/upload/editorUploadExternal`, // Your endpoint that provides uploading by Url
      },
    },
  },
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: "http://localhost:8008/fetchUrl", // Your backend endpoint for url data fetching,
    },
  },
  raw: RawTool,
};
