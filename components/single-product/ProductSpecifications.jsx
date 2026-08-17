import { formatLabel } from "./utils";

export default function ProductSpecifications({ product }) {
  const specifications = [
    ...(product.vitalInformations || []),

    product.weight != null
      ? {
          label: "Weight",
          value: `${product.weight} g`,
        }
      : null,

    product.dimensions
      ? {
          label: "Dimensions",
          value: `${product.dimensions.length} × ${product.dimensions.width} × ${product.dimensions.height} mm`,
        }
      : null,

    {
      label: "Category",
      value: formatLabel(product.category),
    },

    {
      label: "Brand",
      value: product.noBrand ? "No Brand" : product.brand || "Not specified",
    },
  ].filter(Boolean);

  return (
    <div className="rounded-2xl shadow-md bg-base-100 p-6 sm:p-8">
      <h2 className="text-2xl font-bold">Specifications</h2>

      <div className="mt-5">
        {specifications.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="grid grid-cols-[120px_1fr] gap-4 py-4 text-sm"
          >
            <span className="text-zinc-500">{item.label}</span>

            <span className="font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
