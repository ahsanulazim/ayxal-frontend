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
      value: product.noBrand ? "No Brand" : product.brand || "PretyPet",
    },

    product.freeShipping != null
      ? {
          label: "Shipping",
          value: product.freeShipping ? "Free Shipping" : "Standard Shipping",
        }
      : null,
  ].filter(Boolean);

  return (
    <div className="rounded-3xl border border-zinc-200/80 bg-white p-6 sm:p-8 shadow-xs">
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
        Product Specifications
      </h2>

      <div className="mt-6 divide-y divide-zinc-100 border-t border-b border-zinc-100">
        {specifications.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-2 py-3.5 text-sm"
          >
            <span className="font-medium text-zinc-500">{item.label}</span>
            <span className="font-semibold text-zinc-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
