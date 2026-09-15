"use client";

import { useState } from "react";
import { LuX } from "react-icons/lu";

const AddAddressModal = ({ isOpen, onClose, onAddAddress, isLoading }) => {
  const [formData, setFormData] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    isDefault: false,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.street.trim() || !formData.city.trim()) {
      return;
    }
    onAddAddress(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-base-100 rounded-3xl w-full max-w-lg shadow-2xl border border-base-200 overflow-hidden">
        <div className="p-6 border-b border-base-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-base-content">Add New Address</h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Saved addresses make your pet supplies checkout faster!
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
          >
            <LuX className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium text-xs">Address Label</span>
              </label>
              <select
                name="label"
                value={formData.label}
                onChange={handleChange}
                className="select select-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
              >
                <option value="Home">Home 🏠</option>
                <option value="Office">Office 🏢</option>
                <option value="Pet Daycare">Pet Daycare 🐾</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium text-xs">Recipient Full Name *</span>
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleChange}
                className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium text-xs">Phone Number *</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="e.g. +1 555-0199"
              value={formData.phone}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium text-xs">Street Address *</span>
            </label>
            <input
              type="text"
              name="street"
              required
              placeholder="House, street, apartment or suite"
              value={formData.street}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label">
                <span className="label-text font-medium text-xs">City *</span>
              </label>
              <input
                type="text"
                name="city"
                required
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium text-xs">State / Province</span>
              </label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium text-xs">Postal Code</span>
              </label>
              <input
                type="text"
                name="zip"
                placeholder="Zip"
                value={formData.zip}
                onChange={handleChange}
                className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium text-xs">Country</span>
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="input input-bordered w-full rounded-xl focus:border-main focus:outline-hidden"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                className="checkbox checkbox-sm checkbox-primary rounded-md"
              />
              <span className="text-xs font-medium text-base-content/80">
                Set as default shipping address
              </span>
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-base-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost rounded-xl"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-main rounded-xl px-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Save Address"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
