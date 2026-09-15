"use client";

import { FaCat, FaDog, FaDove } from "react-icons/fa6";
import { LuCake, LuHeart, LuScale, LuShieldAlert, LuTrash2 } from "react-icons/lu";

const getPetIcon = (type) => {
  switch ((type || "").toLowerCase()) {
    case "cat":
      return <FaCat className="size-6 text-amber-500" />;
    case "bird":
      return <FaDove className="size-6 text-sky-500" />;
    case "dog":
    default:
      return <FaDog className="size-6 text-main" />;
  }
};

const calculateAge = (dob) => {
  if (!dob) return null;
  try {
    const dobTime = new Date(dob).getTime();
    if (isNaN(dobTime)) return null;
    const diff = new Date().getFullYear() - new Date(dob).getFullYear();
    if (diff > 0) return `${diff} yr${diff > 1 ? "s" : ""}`;
    return "Puppy/Kitten";
  } catch {
    return null;
  }
};

const PetCard = ({ pet, onDelete }) => {
  const age = calculateAge(pet.birthDate);

  return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
      {/* Decorative pet badge */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-main/5 rounded-bl-full pointer-events-none group-hover:bg-main/10 transition-colors" />

      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-base-200 flex items-center justify-center shadow-inner">
              {getPetIcon(pet.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg text-base-content">{pet.name}</h4>
                <span className="badge badge-sm badge-outline text-main border-main/40 font-medium">
                  {pet.type}
                </span>
              </div>
              <p className="text-xs text-base-content/60">{pet.breed || "Mixed Breed"}</p>
            </div>
          </div>

          <button
            onClick={() => onDelete(pet.id)}
            className="btn btn-ghost btn-xs btn-circle text-error/60 hover:text-error hover:bg-error/10 cursor-pointer"
            title="Remove Pet"
          >
            <LuTrash2 className="size-4" />
          </button>
        </div>

        {/* Pet details chips */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          {pet.birthDate && (
            <div className="flex items-center gap-1.5 bg-base-200/70 px-2.5 py-1.5 rounded-lg text-base-content/80">
              <LuCake className="size-3.5 text-main shrink-0" />
              <span className="truncate">{age || pet.birthDate}</span>
            </div>
          )}
          {pet.weight && (
            <div className="flex items-center gap-1.5 bg-base-200/70 px-2.5 py-1.5 rounded-lg text-base-content/80">
              <LuScale className="size-3.5 text-main shrink-0" />
              <span className="truncate">{pet.weight} lbs / kg</span>
            </div>
          )}
        </div>

        {/* Allergies or Special Notes */}
        {pet.allergies && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 flex items-start gap-2">
            <LuShieldAlert className="size-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <span className="font-semibold">Allergies/Diet: </span>
              <span>{pet.allergies}</span>
            </div>
          </div>
        )}

        {pet.notes && (
          <p className="mt-2.5 text-xs text-base-content/70 line-clamp-2 italic">
            &ldquo;{pet.notes}&rdquo;
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between text-xs text-main font-medium">
        <span className="flex items-center gap-1">
          <LuHeart className="size-3.5 fill-main" /> PretyPet VIP
        </span>
        <span className="text-base-content/50">ID: {pet.id?.slice(-5)}</span>
      </div>
    </div>
  );
};

export default PetCard;
