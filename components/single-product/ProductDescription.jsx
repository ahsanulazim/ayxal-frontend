export default function ProductDescription({ description }) {
  if (!description?.blocks?.length) return null;

  return (
    <div className="rounded-2xl shadow-md bg-base-100 p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Product Description</h2>

      <div className="mt-6 space-y-4 leading-7 text-zinc-600">
        {description.blocks.map((block) => {
          if (block.type !== "paragraph" || !block?.data?.text) {
            return null;
          }

          return (
            <div
              key={block.id}
              dangerouslySetInnerHTML={{
                __html: block.data.text,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
