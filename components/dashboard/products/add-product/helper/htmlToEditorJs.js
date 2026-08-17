/**
 * Converts raw HTML string (e.g. from CJ Dropshipping) into Editor.js blocks format
 * @param {string | object} htmlString - HTML string or existing Editor.js data object
 * @returns {object | null} Editor.js compatible data object { time, blocks, version }
 */
export function htmlToEditorJs(htmlString) {
  if (!htmlString) return null;

  // If it's already an Editor.js object
  if (
    typeof htmlString === "object" &&
    Array.isArray(htmlString.blocks) &&
    htmlString.blocks.length > 0
  ) {
    return htmlString;
  }

  if (typeof htmlString !== "string") return null;

  const trimmed = htmlString.trim();
  if (!trimmed) return null;

  // If it's a JSON string representing EditorJS blocks, parse it directly
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed?.blocks) && parsed.blocks.length > 0) {
        return parsed;
      }
    } catch {
      // not JSON, continue with HTML parsing
    }
  }

  // DOMParser requires browser environment
  if (typeof window === "undefined") {
    return null;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(trimmed, "text/html");
  const blocks = [];

  const addImageBlock = (imgSrc, caption = "") => {
    if (!imgSrc) return;
    blocks.push({
      type: "image",
      data: {
        file: { url: imgSrc },
        caption: caption,
        withBorder: false,
        withBackground: false,
        stretched: false,
      },
    });
  };

  const addParagraphBlock = (text) => {
    const cleanText = text
      .replace(/^(<br\s*\/?>\s*)+/gi, "")
      .replace(/(<br\s*\/?>\s*)+$/gi, "")
      .trim();

    if (!cleanText || cleanText === "<br>" || cleanText === "<br/>") return;

    blocks.push({
      type: "paragraph",
      data: {
        text: cleanText,
      },
    });
  };

  const traverseNodes = (nodes) => {
    Array.from(nodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
          addParagraphBlock(text);
        }
        return;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const tagName = node.tagName.toLowerCase();

      // Skip script / style / empty tags
      if (tagName === "script" || tagName === "style") return;

      // 1. Direct Image tag
      if (tagName === "img") {
        const src = node.getAttribute("src");
        const alt = node.getAttribute("alt") || "";
        addImageBlock(src, alt);
        return;
      }

      // 2. Headings (h1 - h6)
      if (/^h[1-6]$/.test(tagName)) {
        const level = parseInt(tagName.replace("h", ""), 10);
        const text = node.innerHTML.trim();
        if (text) {
          blocks.push({
            type: "header",
            data: {
              text: text,
              level: level,
            },
          });
        }
        return;
      }

      // 3. Lists (ul, ol)
      if (tagName === "ul" || tagName === "ol") {
        const items = Array.from(node.querySelectorAll(":scope > li"))
          .map((li) => li.innerHTML.trim())
          .filter(Boolean);

        if (items.length > 0) {
          blocks.push({
            type: "List",
            data: {
              style: tagName === "ol" ? "ordered" : "unordered",
              items: items,
            },
          });
        }
        return;
      }

      // 4. Tables
      if (tagName === "table") {
        const rows = Array.from(node.querySelectorAll("tr"));
        const content = rows.map((tr) =>
          Array.from(tr.querySelectorAll("th, td")).map((cell) =>
            cell.innerHTML.trim()
          )
        );
        if (content.length > 0) {
          blocks.push({
            type: "table",
            data: {
              withHeadings: node.querySelector("th") !== null,
              content: content,
            },
          });
        }
        return;
      }

      // 5. Blockquote
      if (tagName === "blockquote") {
        const text = node.innerHTML.trim();
        if (text) {
          blocks.push({
            type: "quote",
            data: {
              text: text,
              caption: "",
              alignment: "left",
            },
          });
        }
        return;
      }

      // 6. If the container element contains <img> tags
      const imgElements = node.querySelectorAll("img");
      if (imgElements.length > 0) {
        let currentText = "";

        const flushText = () => {
          if (currentText.trim()) {
            addParagraphBlock(currentText);
            currentText = "";
          }
        };

        const processChild = (child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            currentText += child.textContent;
          } else if (child.nodeType === Node.ELEMENT_NODE) {
            if (child.tagName.toLowerCase() === "img") {
              flushText();
              addImageBlock(
                child.getAttribute("src"),
                child.getAttribute("alt") || ""
              );
            } else if (child.querySelector("img")) {
              Array.from(child.childNodes).forEach(processChild);
            } else {
              currentText += child.outerHTML;
            }
          }
        };

        Array.from(node.childNodes).forEach(processChild);
        flushText();
        return;
      }

      // 7. Standard Paragraph / div / span container
      const innerHtml = node.innerHTML.trim();
      addParagraphBlock(innerHtml);
    });
  };

  traverseNodes(doc.body.childNodes);

  return {
    time: Date.now(),
    blocks: blocks,
    version: "2.31.0",
  };
}
