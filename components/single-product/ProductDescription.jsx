export default function ProductDescription({ description }) {
  if (!description) return null;

  let blocks = null;
  let htmlContent = null;

  // Handle if description is a JSON string or raw HTML string
  if (typeof description === "string") {
    const trimmed = description.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed?.blocks) && parsed.blocks.length > 0) {
          blocks = parsed.blocks;
        } else {
          htmlContent = trimmed;
        }
      } catch {
        htmlContent = trimmed;
      }
    } else {
      htmlContent = trimmed;
    }
  } else if (typeof description === "object") {
    if (Array.isArray(description?.blocks) && description.blocks.length > 0) {
      blocks = description.blocks;
    }
  }

  if (!blocks && !htmlContent) return null;

  const renderBlock = (block, index) => {
    if (!block) return null;
    const key = block.id || index;

    switch (block.type) {
      case "header": {
        const level = block.data?.level || 2;
        const HeaderTag = `h${level}`;
        const headingClasses = {
          1: "text-2xl font-bold mt-6 mb-3 text-base-content",
          2: "text-xl font-bold mt-5 mb-2 text-base-content",
          3: "text-lg font-semibold mt-4 mb-2 text-base-content",
          4: "text-base font-semibold mt-3 mb-1 text-base-content",
          5: "text-sm font-semibold mt-2 mb-1 text-base-content",
          6: "text-xs font-semibold mt-2 mb-1 text-base-content",
        };

        return (
          <HeaderTag
            key={key}
            className={headingClasses[level] || headingClasses[2]}
            dangerouslySetInnerHTML={{ __html: block.data?.text || "" }}
          />
        );
      }

      case "paragraph":
        return (
          <p
            key={key}
            className="leading-7"
            dangerouslySetInnerHTML={{ __html: block.data?.text || "" }}
          />
        );

      case "list":
      case "List": {
        const isOrdered = block.data?.style === "ordered";
        const ListTag = isOrdered ? "ol" : "ul";

        return (
          <ListTag
            key={key}
            className={`space-y-1.5 pl-5 ${
              isOrdered ? "list-decimal" : "list-disc"
            }`}
          >
            {block.data?.items?.map((item, i) => {
              const content =
                typeof item === "string" ? item : item?.content || "";
              return (
                <li
                  key={i}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              );
            })}
          </ListTag>
        );
      }

      case "checklist":
        return (
          <div key={key} className="space-y-2 my-2">
            {block.data?.items?.map((item, i) => (
              <label key={i} className="flex items-center gap-2 cursor-default">
                <input
                  type="checkbox"
                  checked={!!item.checked}
                  readOnly
                  className="checkbox checkbox-sm checkbox-primary"
                />
                <span
                  dangerouslySetInnerHTML={{ __html: item.text || "" }}
                />
              </label>
            ))}
          </div>
        );

      case "image": {
        const imageUrl = block.data?.file?.url || block.data?.url;
        if (!imageUrl) return null;

        return (
          <figure key={key} className="my-4">
            <img
              src={imageUrl}
              alt={block.data?.caption || "Product description image"}
              className={`rounded-xl max-w-full h-auto shadow-sm ${
                block.data?.stretched ? "w-full" : ""
              } ${block.data?.withBorder ? "border border-base-300" : ""} ${
                block.data?.withBackground ? "bg-base-200 p-2" : ""
              }`}
            />
            {block.data?.caption && (
              <figcaption
                className="text-xs text-zinc-400 mt-1.5 text-center"
                dangerouslySetInnerHTML={{ __html: block.data.caption }}
              />
            )}
          </figure>
        );
      }

      case "quote":
        return (
          <blockquote
            key={key}
            className="border-l-4 border-primary pl-4 py-1 italic my-3 text-zinc-700 bg-base-200/50 rounded-r-lg"
          >
            <p dangerouslySetInnerHTML={{ __html: block.data?.text || "" }} />
            {block.data?.caption && (
              <cite className="block text-xs not-italic mt-1 text-zinc-500 font-medium">
                — {block.data.caption}
              </cite>
            )}
          </blockquote>
        );

      case "raw":
        return (
          <div
            key={key}
            dangerouslySetInnerHTML={{ __html: block.data?.html || "" }}
          />
        );

      case "delimiter":
        return <hr key={key} className="my-6 border-base-300" />;

      case "table":
        return (
          <div key={key} className="overflow-x-auto my-4">
            <table className="table table-zebra w-full border border-base-300">
              <tbody>
                {block.data?.content?.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        dangerouslySetInnerHTML={{ __html: cell }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        if (block.data?.text || block.data?.html) {
          return (
            <div
              key={key}
              dangerouslySetInnerHTML={{
                __html: block.data.text || block.data.html,
              }}
            />
          );
        }
        return null;
    }
  };

  return (
    <div className="rounded-2xl shadow-md bg-base-100 p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Product Description</h2>

      <div className="mt-6 space-y-4 leading-7 text-zinc-600 wrap-break-word [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-2 [&_p]:mb-2 [&_b]:font-bold [&_strong]:font-bold [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5">
        {blocks
          ? blocks.map((block, idx) => renderBlock(block, idx))
          : <div dangerouslySetInnerHTML={{ __html: htmlContent }} />}
      </div>
    </div>
  );
}
