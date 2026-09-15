"use client";

import { LuCheck, LuMapPin, LuPhone, LuStar, LuTrash2, LuUser } from "react-icons/lu";

const AddressCard = ({ address, onSetDefault, onDelete, isSettingDefault }) => {
  return (
    <div
      className={`bg-base-100 rounded-2xl p-5 border transition-all flex flex-col justify-between relative ${
        address.isDefault
          ? "border-main shadow-xs ring-1 ring-main/20"
          : "border-base-200 hover:border-base-300 shadow-sm"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="badge badge-sm bg-base-200 text-base-content font-medium">
              {address.label || "Home"}
            </span>
            {address.isDefault && (
              <span className="badge badge-sm bg-main text-white gap-1 border-0">
                <LuStar className="size-3 fill-current" /> Default Address
              </span>
            )}
          </div>

          <button
            onClick={() => onDelete(address.id)}
            className="btn btn-ghost btn-xs btn-circle text-error/60 hover:text-error hover:bg-error/10 cursor-pointer"
            title="Delete address"
          >
            <LuTrash2 className="size-4" />
          </button>
        </div>

        <div className="space-y-1.5 text-sm">
          <p className="font-semibold text-base-content flex items-center gap-2">
            <LuUser className="size-4 text-main shrink-0" />
            <span>{address.fullName}</span>
          </p>

          {address.phone && (
            <p className="text-xs text-base-content/70 flex items-center gap-2">
              <LuPhone className="size-3.5 text-base-content/50 shrink-0" />
              <span>{address.phone}</span>
            </p>
          )}

          <div className="text-xs text-base-content/80 flex items-start gap-2 pt-1">
            <LuMapPin className="size-3.5 text-base-content/50 shrink-0 mt-0.5" />
            <div>
              <p>{address.street}</p>
              <p>
                {[address.city, address.state, address.zip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-base-content/50 mt-0.5">{address.country || "United States"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-base-200 flex items-center justify-between">
        {!address.isDefault ? (
          <button
            onClick={() => onSetDefault(address.id)}
            disabled={isSettingDefault}
            className="btn btn-ghost btn-xs text-main hover:bg-main/10 font-medium px-2"
          >
            <LuCheck className="size-3.5" /> Set as Default
          </button>
        ) : (
          <span className="text-xs text-main font-medium flex items-center gap-1">
            <LuCheck className="size-3.5" /> Active Shipping Address
          </span>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
