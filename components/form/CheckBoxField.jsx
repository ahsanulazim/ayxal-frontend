"use client";

import { useFieldContext } from "./CustomFormHook";
import { LuX } from "react-icons/lu";

const CheckBoxField = ({ data, label }) => {
  const field = useFieldContext();

  if (!field) return null;

  // TanStack Form-এর ভ্যালু (ডিফল্ট খালি অ্যারে)
  const currentValue = field.state.value || [];

  // বাটন ক্লিকের টগল লজিক
  const handleToggle = (variation) => {
    let updatedValue;
    if (currentValue.includes(variation)) {
      // অলরেডি থাকলে বাদ যাবে
      updatedValue = currentValue.filter((item) => item !== variation);
    } else {
      // না থাকলে অ্যারেতে যোগ হবে
      updatedValue = [...currentValue, variation];
    }
    field.handleChange(updatedValue); // ফর্মে ডেটা সিঙ্ক
  };

  return (
    <div className="collapse collapse-arrow bg-base-100 border border-base-300 rounded-box">
      {/* কলাপ্স ওপেন/ক্লোজ করার জন্য peer চেকবক্স */}
      <input type="checkbox" className="peer" defaultChecked />

      <div className="collapse-title font-semibold text-sm flex items-center justify-between pr-10">
        <span>{label}</span>
        {/* কয়টা সিলেক্টেড আছে তার একটা ব্যাজ */}
        {currentValue.length > 0 && (
          <span className="badge bg-main text-white badge-sm ml-2">
            {currentValue.length} Selected
          </span>
        )}
      </div>

      <div className="collapse-content">
        {/* daisyUI-এর 'filter' ক্লাস পুরোপুরি বাদ দিয়ে কাস্টম ফ্লেক্স লেআউট */}
        <div className="flex flex-wrap gap-2 pt-2">
          {data?.variations?.map((variation, i) => {
            const isChecked = currentValue.includes(variation);

            return (
              <button
                key={`${variation}-${i}`}
                type="button" // ফর্ম সাবমিট হওয়া আটকাতে মাস্ট!
                onClick={() => handleToggle(variation)}
                className={`btn btn-sm
                  ${isChecked ? "btn-main" : ""}`}
              >
                {variation}
              </button>
            );
          })}

          {/* অল ক্লিয়ার বাটন */}
          {currentValue.length > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-error btn-square"
              onClick={() => field.handleChange([])}
              title="Clear All"
            >
              <LuX size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckBoxField;
