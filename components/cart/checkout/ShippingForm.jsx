"use client";

import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { useContext, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { MyContext } from "@/context/MyProvider";
import { useCart } from "@/context/CartContext";
import { createOrder, verifyOrderPayment } from "@/api/orderApi";
import { calculateDynamicShipping } from "@/api/shippingApi";
import { toast } from "react-toastify";
import ShippingMethodSelector from "./ShippingMethodSelector";
import StripePaymentElement from "./StripePaymentElement";
import { isStripeClientReady } from "@/lib/stripe";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/validator/checkoutValidator";
import {
  getCountries,
  getStatesOfCountry,
  getCitiesOfState,
} from "@countrystatecity/countries-browser";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuBuilding,
  LuFileText,
  LuShieldCheck,
  LuCheck,
  LuCircleAlert,
} from "react-icons/lu";

// Default fallback countries in priority order while async catalog loads
const DEFAULT_PRIORITY_COUNTRIES = [
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
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const { newUser } = useContext(MyContext);
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    cart,
    selectedShipping,
    setSelectedShipping,
    shippingCost,
    cartSubtotal,
    cartGrandTotal,
  } = useCart();

  const [countryOptions, setCountryOptions] = useState(
    DEFAULT_PRIORITY_COUNTRIES,
  );
  const [stateOptions, setStateOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState(null);

  const {
    handleSubmit,
    register,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
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
  const selectedState = watch("state") || "";
  const enteredCity = watch("city") || "";
  const enteredZip = watch("zip") || "";

  // Auto-fill profile data if user is logged in
  useEffect(() => {
    if (newUser?.user) {
      if (newUser.user.email) setValue("email", newUser.user.email);
      if (newUser.user.displayName) {
        const parts = newUser.user.displayName.trim().split(" ");
        setValue("firstName", parts[0] || "");
        setValue("lastName", parts.slice(1).join(" ") || "");
      }
      if (newUser.user.phoneNumber) {
        setValue("phone", newUser.user.phoneNumber);
      }
    }
  }, [newUser, setValue]);

  // 1. Fetch full global country list from @countrystatecity/countries-browser
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await getCountries();
        if (isMounted && Array.isArray(list) && list.length > 0) {
          const priorityCodes = [
            "US",
            "CA",
            "GB",
            "AU",
            "DE",
            "FR",
            "IT",
            "ES",
            "NL",
          ];
          const priority = [];
          const rest = [];

          list.forEach((c) => {
            const item = {
              value: c.iso2,
              label: `${c.emoji ? c.emoji + " " : ""}${c.name} (${c.iso2})`,
            };
            if (priorityCodes.includes(c.iso2)) {
              priority.push({
                ...item,
                priorityIndex: priorityCodes.indexOf(c.iso2),
              });
            } else {
              rest.push(item);
            }
          });

          priority.sort((a, b) => a.priorityIndex - b.priorityIndex);
          rest.sort((a, b) => a.label.localeCompare(b.label));

          setCountryOptions([...priority, ...rest]);
        }
      } catch (err) {
        console.warn("Could not load country catalog:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch States/Provinces dynamically when Country changes
  useEffect(() => {
    if (!selectedCountry) {
      setStateOptions([]);
      return;
    }

    let isMounted = true;
    setStatesLoading(true);

    (async () => {
      try {
        const states = await getStatesOfCountry(selectedCountry);
        if (isMounted) {
          const formatted = (states || []).map((s) => ({
            value: s.iso2 || s.name,
            label:
              s.iso2 && s.iso2 !== s.name ? `${s.name} (${s.iso2})` : s.name,
          }));
          setStateOptions(formatted);
        }
      } catch (err) {
        console.error(
          "Failed to load states for country:",
          selectedCountry,
          err,
        );
        if (isMounted) setStateOptions([]);
      } finally {
        if (isMounted) setStatesLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedCountry]);

  // 3. Fetch Cities dynamically when Country and State change
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCityOptions([]);
      return;
    }

    let isMounted = true;
    setCitiesLoading(true);

    (async () => {
      try {
        const cities = await getCitiesOfState(selectedCountry, selectedState);
        if (isMounted) {
          const formatted = (cities || []).map((c) => ({
            value: c.name,
            label: c.name,
          }));
          setCityOptions(formatted);
        }
      } catch (err) {
        console.error("Failed to load cities for state:", selectedState, err);
        if (isMounted) setCityOptions([]);
      } finally {
        if (isMounted) setCitiesLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [selectedCountry, selectedState]);

  // Re-trigger zip validation if state or country changes
  useEffect(() => {
    if (enteredZip) {
      trigger("zip");
    }
  }, [selectedState, selectedCountry, trigger, enteredZip]);

  // 4. Dynamic Freight Calculation from CJ Dropshipping
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
          // Automatically select recommended or cheapest method
          setSelectedShipping((prev) => {
            if (prev && res.options.some((o) => o.id === prev.id)) {
              return res.options.find((o) => o.id === prev.id);
            }
            return (
              res.recommendedOption || res.cheapestOption || res.options[0]
            );
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
    }, 450);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [
    selectedCountry,
    selectedState,
    enteredCity,
    enteredZip,
    cart,
    setSelectedShipping,
  ]);

  // Sync processing state with parent
  useEffect(() => {
    if (setIsPending) {
      setIsPending(isProcessing);
    }
  }, [isProcessing, setIsPending]);

  const onSubmit = async (data) => {
    if (!selectedShipping && shippingOptions.length > 0) {
      toast.warning("Please select a shipping method before proceeding");
      return;
    }

    setPaymentError(null);
    setIsProcessing(true);

    try {
      // 1. Validate Stripe PaymentElement if active
      if (stripe && elements) {
        const { error: submitError } = await elements.submit();
        if (submitError) {
          const msg = submitError.message || "Please check your payment information";
          setPaymentError(msg);
          toast.error(msg);
          setIsProcessing(false);
          return;
        }
      }

      // 2. Prepare Order Payload
      const orderData = {
        user: newUser ? newUser.user : "guest",
        customer: {
          ...data,
          phone: data.phone.replace(/\D/g, ""), // Sanitize phone to pure digits
        },
        products: cart,
        shipping: selectedShipping,
        shippingCost: shippingCost,
        subtotal: cartSubtotal,
        total: cartGrandTotal,
        clientUrl:
          typeof window !== "undefined" ? window.location.origin : undefined,
      };

      // 3. Create Order on Backend (creates order and PaymentIntent)
      const orderRes = await createOrder(orderData);
      if (!orderRes?.success) {
        throw new Error(orderRes?.message || "Failed to create order");
      }

      const { orderId, orderNumber, clientSecret, paymentIntentId, paymentUrl } = orderRes;

      // 4. Confirm Payment via Stripe on-site (Direct, self-hosted checkout)
      if (stripe && elements && clientSecret && !clientSecret.startsWith("sim_")) {
        const returnUrl = `${window.location.origin}/cart/checkout/payment-success?order_id=${orderId}&order_number=${orderNumber}`;

        const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: returnUrl,
            payment_method_data: {
              billing_details: {
                name: `${data.firstName || ""} ${data.lastName || ""}`.trim() || data.name,
                email: data.email,
                phone: data.phone,
                address: {
                  line1: data.address,
                  city: data.city,
                  state: data.state,
                  postal_code: data.zip,
                  country: data.country || "US",
                },
              },
            },
          },
          redirect: "if_required",
        });

        if (confirmError) {
          const msg =
            confirmError.message ||
            "Payment failed. Please verify card details or try another card.";
          setPaymentError(msg);
          toast.error(msg);
          setIsProcessing(false);
          return;
        }

        if (
          paymentIntent &&
          (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")
        ) {
          try {
            await verifyOrderPayment(paymentIntent.id, orderId);
          } catch (vErr) {
            console.warn("Live verification warning:", vErr);
          }
          toast.success("Payment completed successfully!");
          router.push(
            `/cart/checkout/payment-success?order_id=${orderId}&order_number=${orderNumber}&payment_intent=${paymentIntent.id}`,
          );
          return;
        }
      }

      // 5. Fallback for test simulation mode
      if (clientSecret?.startsWith("sim_") || !stripe) {
        try {
          await verifyOrderPayment(paymentIntentId || `sim_pi_${orderNumber}`, orderId);
        } catch (vErr) {
          console.warn("Simulation verification warning:", vErr);
        }
        toast.success("Order confirmed (Test Mode)");
        router.push(
          `/cart/checkout/payment-success?order_id=${orderId}&order_number=${orderNumber}&session_id=${paymentIntentId || "sim_pi"}`,
        );
        return;
      }

      // 6. Hosted Checkout redirect fallback if needed
      if (paymentUrl) {
        toast.info("Redirecting to secure Stripe checkout...");
        window.location.href = paymentUrl;
        return;
      }

      toast.success("Order received!");
      router.push(
        `/cart/checkout/payment-success?order_id=${orderId}&order_number=${orderNumber}`,
      );
    } catch (error) {
      console.error("Checkout error:", error);
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Checkout could not be initiated";
      setPaymentError(msg);
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (formErrors) => {
    const errorKeys = Object.keys(formErrors);
    if (errorKeys.length > 0) {
      const firstError = formErrors[errorKeys[0]];
      toast.error(
        firstError?.message || "Please complete all required fields accurately",
      );
    }
  };

  // Custom Select styling
  const customSelectStyles = (hasError) => ({
    control: (base, state) => ({
      ...base,
      borderRadius: "0.75rem",
      padding: "2px",
      borderColor: hasError
        ? "#ef4444"
        : state.isFocused
          ? "#00a650"
          : "#e4e4e7",
      boxShadow: state.isFocused ? "0 0 0 1px #00a650" : "none",
      backgroundColor: "#ffffff",
      "&:hover": {
        borderColor: hasError ? "#ef4444" : "#a1a1aa",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 40,
      borderRadius: "0.75rem",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      overflow: "hidden",
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "0.875rem",
      backgroundColor: state.isSelected
        ? "#00a650"
        : state.isFocused
          ? "#f0fdf4"
          : "transparent",
      color: state.isSelected ? "#ffffff" : "#18181b",
      cursor: "pointer",
    }),
  });

  return (
    <form
      ref={ref}
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-y-6"
    >
      {/* Contact Information Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
          <LuUser className="w-5 h-5 text-main" />
          <h3 className="font-bold text-base text-zinc-900">Contact Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-xs font-semibold text-zinc-700 mb-1.5"
            >
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              className={`input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main ${
                errors.firstName ? "border-red-500 bg-red-50/20" : ""
              }`}
              placeholder="e.g. Alex"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-xs font-semibold text-zinc-700 mb-1.5"
            >
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              className={`input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main ${
                errors.lastName ? "border-red-500 bg-red-50/20" : ""
              }`}
              placeholder="e.g. Smith"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1"
            >
              <LuMail className="w-3.5 h-3.5 text-zinc-400" />
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main ${
                errors.email ? "border-red-500 bg-red-50/20" : ""
              }`}
              placeholder="receipt@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="phone"
                className="text-xs font-semibold text-zinc-700 flex items-center gap-1"
              >
                <LuPhone className="w-3.5 h-3.5 text-zinc-400" />
                Phone Number <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-zinc-400">7-15 digits</span>
            </div>
            <input
              id="phone"
              type="tel"
              className={`input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main ${
                errors.phone ? "border-red-500 bg-red-50/20" : ""
              }`}
              placeholder="e.g. +1 555 123 4567"
              {...register("phone")}
            />
            {errors.phone ? (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                {errors.phone.message}
              </p>
            ) : (
              <p className="text-[11px] text-zinc-400 mt-1">
                Required for courier dispatch & delivery updates
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address Section */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <LuMapPin className="w-5 h-5 text-main" />
            <h3 className="font-bold text-base text-zinc-900">
              Shipping Destination & Address
            </h3>
          </div>
          <span className="text-xs text-zinc-400 flex items-center gap-1">
            <LuShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Live
            Address Validation
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
              render={({ field }) => (
                <Select
                  {...field}
                  options={countryOptions}
                  placeholder="Select Destination Country"
                  value={
                    countryOptions.find((opt) => opt.value === field.value) ||
                    countryOptions[0]
                  }
                  onChange={(selected) => {
                    const nextVal = selected?.value || "US";
                    field.onChange(nextVal);
                    // Reset subordinate geographical fields on country switch
                    setValue("state", "");
                    setValue("city", "");
                    setValue("zip", "");
                  }}
                  className="text-sm"
                  styles={customSelectStyles(!!errors.country)}
                />
              )}
            />
            {errors.country && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Street Address */}
          <div>
            <label
              htmlFor="address"
              className="text-xs font-semibold text-zinc-700 mb-1.5 flex items-center gap-1"
            >
              <LuBuilding className="w-3.5 h-3.5 text-zinc-400" />
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              className={`input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main ${
                errors.address ? "border-red-500 bg-red-50/20" : ""
              }`}
              placeholder="House, apartment, suite, street address"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Cascading State, City, Zip Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* State / Province */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                State / Province <span className="text-red-500">*</span>
              </label>
              {stateOptions.length > 0 ? (
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isClearable
                      isLoading={statesLoading}
                      options={stateOptions}
                      placeholder={
                        statesLoading ? "Loading states..." : "Select State"
                      }
                      value={
                        stateOptions.find((opt) => opt.value === field.value) ||
                        null
                      }
                      onChange={(selected) => {
                        field.onChange(selected ? selected.value : "");
                        // Reset city when state changes
                        setValue("city", "");
                      }}
                      className="text-sm"
                      styles={customSelectStyles(!!errors.state)}
                    />
                  )}
                />
              ) : (
                <input
                  type="text"
                  className={`input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main ${
                    errors.state ? "border-red-500 bg-red-50/20" : ""
                  }`}
                  placeholder="State / Region / Province"
                  {...register("state")}
                />
              )}
              {errors.state && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                  {errors.state.message}
                </p>
              )}
            </div>

            {/* City (Searchable with custom input capability) */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <CreatableSelect
                    {...field}
                    isClearable
                    isLoading={citiesLoading}
                    isDisabled={stateOptions.length > 0 && !selectedState}
                    options={cityOptions}
                    placeholder={
                      stateOptions.length > 0 && !selectedState
                        ? "Pick state first"
                        : citiesLoading
                          ? "Loading cities..."
                          : "Select or type city"
                    }
                    value={
                      field.value
                        ? cityOptions.find(
                            (opt) =>
                              opt.value.toLowerCase() ===
                              field.value.toLowerCase(),
                          ) || {
                            value: field.value,
                            label: field.value,
                          }
                        : null
                    }
                    onChange={(selected) =>
                      field.onChange(selected ? selected.value : "")
                    }
                    formatCreateLabel={(inputValue) => `Use "${inputValue}"`}
                    className="text-sm"
                    styles={customSelectStyles(!!errors.city)}
                  />
                )}
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* Zip / Postal Code with cross-validation status badge */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="zip"
                  className="block text-xs font-semibold text-zinc-700"
                >
                  Zip / Postal Code <span className="text-red-500">*</span>
                </label>
                {selectedCountry === "US" &&
                  selectedState &&
                  enteredZip &&
                  !errors.zip && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <LuCheck className="w-3 h-3" /> Valid for {selectedState}
                    </span>
                  )}
              </div>
              <input
                id="zip"
                type="text"
                className={`input input-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main ${
                  errors.zip ? "border-red-500 bg-red-50/20" : ""
                }`}
                placeholder={
                  selectedCountry === "US"
                    ? "e.g. 90210"
                    : selectedCountry === "CA"
                      ? "e.g. K1A 0B1"
                      : selectedCountry === "GB"
                        ? "e.g. SW1A 1AA"
                        : selectedCountry === "AU"
                          ? "e.g. 2000"
                          : "Postal Code"
                }
                {...register("zip")}
              />
              {errors.zip && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <LuCircleAlert className="w-3.5 h-3.5 shrink-0" />
                  {errors.zip.message}
                </p>
              )}
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
        <label
          htmlFor="comment"
          className="text-xs font-semibold text-zinc-700 mb-2 flex items-center gap-1.5"
        >
          <LuFileText className="w-4 h-4 text-zinc-400" />
          Delivery Instructions / Order Notes (Optional)
        </label>
        <textarea
          id="comment"
          className="textarea textarea-bordered w-full text-sm rounded-xl focus:border-main focus:ring-1 focus:ring-main"
          rows={2}
          placeholder="E.g. Leave package at front porch, gate code #1234..."
          {...register("comment")}
        ></textarea>
      </div>

      {/* Payment Details Section (Custom On-Site Stripe Checkout) */}
      <div className="pt-2">
        {isStripeClientReady ? (
          <StripePaymentElement
            isReady={Boolean(stripe && elements)}
            errorMessage={paymentError}
          />
        ) : (
          <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/70 p-5 text-amber-900 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-sm">
              <LuShieldCheck className="w-5 h-5 text-amber-600" />
              <span>Developer Test Mode Checkout Active</span>
            </div>
            <p className="text-xs mt-1.5 text-amber-800 leading-relaxed">
              Add your Stripe Publishable Key to <code className="bg-amber-100 font-semibold px-1.5 py-0.5 rounded font-mono text-[11px]">.env.local</code> to display live Stripe card fields. In this mode, clicking <strong>Pay</strong> will simulate order placement and verification seamlessly.
            </p>
          </div>
        )}
      </div>
    </form>
  );
};

export default ShippingForm;
