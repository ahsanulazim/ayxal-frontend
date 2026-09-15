"use client";

import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "@/context/MyProvider";
import { useCart } from "@/context/CartContext";
import { useMutation } from "@tanstack/react-query";
import { createOrder } from "@/api/orderApi";
import { calculateDynamicShipping } from "@/api/shippingApi";
import { toast } from "react-toastify";
import ShippingMethodSelector from "./ShippingMethodSelector";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuBuilding,
  LuFileText,
  LuShieldCheck,
} from "react-icons/lu";

const COUNTRY_OPTIONS = [
  { value: "US", label: "🇺🇸 United States (US)" },
  { value: "CA", label: "🇨🇦 Canada (CA)" },
  { value: "GB", label: "🇬🇧 United Kingdom (GB)" },
  { value: "AU", label: "🇦🇺 Australia (AU)" },
  { value: "DE", label: "🇩🇪 Germany (DE)" },
  { value: "FR", label: "🇫🇷 France (FR)" },
  { value: "IT", label: "🇮🇹 Italy (IT)" },
  { value: "ES", label: "🇪🇸 Spain (ES)" },
  { value: "NL", label: "🇳🇱 Netherlands (NL)" },
];

const ShippingForm = ({ ref, setIsPending }) => {
  const { locations, locationsLoading, newUser } = useContext(MyContext);
  const {
    cart,
    selectedShipping,
    setSelectedShipping,
    shippingCost,
    cartSubtotal,
    cartGrandTotal,
  } = useCart();

  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState(null);

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "US",
      address: "",
      city: "",
      state: "",
      zip: "",
      comment: "",
    },
  });

  const selectedCountry = watch("country") || "US";
  const selectedState = watch("state");
  const enteredZip = watch("zip");
  const enteredCity = watch("city");

  const stateOptions = locationsLoading
    ? [{ value: "", label: "Loading states...", isDisabled: true }]
    : locations?.locations?.[0]?.states?.map((loc) => ({
        value: loc?.name || loc?.abbreviation,
        label: `${loc?.name} (${loc?.abbreviation})`,
      })) || [];

  // Dynamic Freight Calculation from CJ Dropshipping
  useEffect(() => {
    if (!cart || cart.length === 0) return;

    let isMounted = true;
    const timer = setTimeout(async () => {
      setShippingLoading(true);
      setShippingError(null);

      try {
        const res = await calculateDynamicShipping({
          countryCode: selectedCountry,
          province: selectedState || "",
          city: enteredCity || "",
          zip: enteredZip || "",
          items: cart.map((item) => ({
            productId: item.productId,
            vid: item.vid || item.cjVid,
            cjVid: item.cjVid || item.vid,
            quantity: item.quantity,
          })),
        });

        if (isMounted && res?.success && Array.isArray(res.options)) {
          setShippingOptions(res.options);
          // Automatically pick recommended or cheapest method
          setSelectedShipping((prev) => {
            if (prev && res.options.some((o) => o.id === prev.id)) {
              return res.options.find((o) => o.id === prev.id);
            }
            return res.recommendedOption || res.cheapestOption || res.options[0];
          });
        }
      } catch (err) {
        if (isMounted) {
          console.error("CJ Shipping calculation error:", err);
          setShippingError(err.message || "Failed to load live shipping rates");
        }
      } finally {
        if (isMounted) {
          setShippingLoading(false);
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [selectedCountry, selectedState, enteredZip, cart, setSelectedShipping]);

  // Order submission mutation with Stripe checkout
  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      if (data?.paymentUrl) {
        toast.info("Redirecting to secure Stripe checkout...");
        window.location.href = data.paymentUrl;
      } else {
        toast.error("Could not generate Stripe payment session. Please try again.");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || error.message || "Checkout could not be initiated",
      );
    },
  });

  useEffect(() => {
    if (setIsPending) {
      setIsPending(isPending);
    }
  }, [isPending, setIsPending]);

  const onSubmit = (data) => {
    if (!selectedShipping && shippingOptions.length > 0) {
      toast.warning("Please select a shipping method before proceeding");
      return;
    }

    const orderData = {
      user: newUser ? newUser.user : "guest",
      customer: data,
      products: cart,
      shipping: selectedShipping,
      shippingCost: shippingCost,
      subtotal: cartSubtotal,
      total: cartGrandTotal,
      clientUrl: typeof window !== "undefined" ? window.location.origin : undefined,
    };

    mutate(orderData);
  };

  return (
    <form ref={ref} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact Information Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
          <LuUser className="w-5 h-5 text-main" />
          <h3 className="font-bold text-base text-zinc-900">Contact Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              className="input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main"
              placeholder="e.g. Alex"
              {...register("firstName", { required: "First Name is required" })}
            />
            {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              className="input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main"
              placeholder="e.g. Smith"
              {...register("lastName", { required: "Last Name is required" })}
            />
            {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1">
              <LuMail className="w-3.5 h-3.5 text-zinc-400" />
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              className="input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main"
              placeholder="receipt@example.com"
              {...register("email", {
                required: "Email is required for order receipt",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1">
              <LuPhone className="w-3.5 h-3.5 text-zinc-400" />
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              className="input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main"
              placeholder="+1 (555) 000-0000"
              {...register("phone", { required: "Phone number is required for courier delivery" })}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <LuMapPin className="w-5 h-5 text-main" />
            <h3 className="font-bold text-base text-zinc-900">Shipping Address</h3>
          </div>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <LuShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Real-time delivery rates
          </span>
        </div>

        <div className="space-y-4">
          {/* Country Selection */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
              Country / Destination <span className="text-red-500">*</span>
            </label>
            <Controller
              name="country"
              control={control}
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={COUNTRY_OPTIONS}
                  placeholder="Select Destination Country"
                  value={COUNTRY_OPTIONS.find((opt) => opt.value === field.value) || COUNTRY_OPTIONS[0]}
                  onChange={(selected) => field.onChange(selected.value)}
                  className="text-sm"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "0.75rem",
                      padding: "2px",
                      borderColor: "#e4e4e7",
                    }),
                  }}
                />
              )}
            />
            {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
          </div>

          {/* Street Address */}
          <div>
            <label htmlFor="address" className="block text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1">
              <LuBuilding className="w-3.5 h-3.5 text-zinc-400" />
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              className="input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main"
              placeholder="Apartment, suite, unit, building, street"
              {...register("address", { required: "Street Address is required" })}
            />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
          </div>

          {/* City, State, Zip Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                className="input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main"
                placeholder="City"
                {...register("city", { required: "City is required" })}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                State / Province <span className="text-red-500">*</span>
              </label>
              {selectedCountry === "US" && stateOptions.length > 0 ? (
                <Controller
                  name="state"
                  control={control}
                  rules={{ required: "State is required" }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={stateOptions}
                      placeholder="Select State"
                      value={stateOptions.find((opt) => opt.value === field.value) || null}
                      onChange={(selected) => field.onChange(selected.value)}
                      className="text-sm"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "0.75rem",
                          padding: "2px",
                          borderColor: "#e4e4e7",
                        }),
                      }}
                    />
                  )}
                />
              ) : (
                <input
                  type="text"
                  className="input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main"
                  placeholder="State / Region"
                  {...register("state", { required: "State is required" })}
                />
              )}
              {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
            </div>

            <div>
              <label htmlFor="zip" className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Zip / Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                id="zip"
                type="text"
                className="input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main"
                placeholder="e.g. 90210"
                {...register("zip", { required: "Zip Code is required" })}
              />
              {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip.message}</p>}
            </div>
          </div>
        </div>

        {/* Dynamic Shipping Method Selection */}
        <ShippingMethodSelector
          options={shippingOptions}
          selectedShipping={selectedShipping}
          onSelectShipping={setSelectedShipping}
          isLoading={shippingLoading}
          error={shippingError}
        />
      </div>

      {/* Special Delivery Instructions */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <label htmlFor="comment" className="block text-xs font-semibold text-zinc-700 mb-2 flex items-center gap-1.5">
          <LuFileText className="w-4 h-4 text-zinc-400" />
          Delivery Instructions / Order Notes (Optional)
        </label>
        <textarea
          id="comment"
          className="textarea textarea-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main"
          rows={2}
          placeholder="E.g. Leave package at front door, gate code #1234..."
          {...register("comment")}
        ></textarea>
      </div>
    </form>
  );
};

export default ShippingForm;
