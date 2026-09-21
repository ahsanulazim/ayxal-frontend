"use client";

import { LuHeadphones, LuRotateCcw, LuShieldCheck, LuTruck } from "react-icons/lu";

const PERKS = [
  {
    icon: LuTruck,
    title: "Free Express Shipping",
    description: "Enjoy free, tracked doorstep delivery on qualifying orders over $35.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: LuShieldCheck,
    title: "100% Pet-Safe Materials",
    description: "Carefully curated non-toxic ingredients, durable fabrics & vet-approved items.",
    color: "text-main bg-main/10",
  },
  {
    icon: LuRotateCcw,
    title: "30-Day Easy Return Policy",
    description: "Hassle-free refunds or exchanges if your pet isn't completely satisfied.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: LuHeadphones,
    title: "24/7 Pet Care Support",
    description: "Friendly customer assistance and pet product advice whenever you need.",
    color: "text-blue-600 bg-blue-50",
  },
];

const OffersPerks = () => {
  return (
    <section className="bg-base-100 rounded-3xl p-6 sm:p-8 border border-base-200/90 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PERKS.map((perk, index) => {
          const Icon = perk.icon;
          return (
            <div key={index} className="flex items-start gap-4">
              <div className={`p-3 rounded-2xl ${perk.color} shrink-0`}>
                <Icon className="size-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-base-content">
                  {perk.title}
                </h4>
                <p className="text-xs text-base-content/60 leading-relaxed">
                  {perk.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OffersPerks;
