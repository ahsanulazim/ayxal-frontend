/**
 * Modular Stripe Appearance and Font Configuration
 * Matches PretyPet brand aesthetics, typography (DM Sans), and theme variables
 */

export const stripeFonts = [
  {
    cssSrc:
      "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap",
  },
];

export const stripeAppearance = {
  theme: "flat",
  variables: {
    colorPrimary: "#0a7c6e", // PretyPet Teal Brand Color
    colorBackground: "#ffffff",
    colorText: "#18181b", // zinc-900
    colorDanger: "#ef4444", // red-500
    colorTextSecondary: "#71717a", // zinc-500
    colorTextPlaceholder: "#a1a1aa", // zinc-400
    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSizeBase: "14px",
    borderRadius: "12px", // rounded-xl
    spacingUnit: "4px",
    spacingGridRow: "16px",
    spacingGridColumn: "16px",
  },
  rules: {
    ".Tab": {
      border: "1px solid #e4e4e7",
      borderRadius: "12px",
      backgroundColor: "#ffffff",
      padding: "10px 14px",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      transition: "all 0.15s ease-in-out",
    },
    ".Tab:hover": {
      borderColor: "#0a7c6e",
      color: "#0a7c6e",
      backgroundColor: "rgba(10, 124, 110, 0.04)",
    },
    ".Tab--selected": {
      borderColor: "#0a7c6e",
      backgroundColor: "rgba(10, 124, 110, 0.06)",
      color: "#0a7c6e",
      boxShadow: "0 0 0 1px #0a7c6e",
    },
    ".Tab--selected:focus": {
      borderColor: "#0a7c6e",
      boxShadow: "0 0 0 2px rgba(10, 124, 110, 0.25)",
    },
    ".TabIcon--selected": {
      fill: "#0a7c6e",
      color: "#0a7c6e",
    },
    ".TabLabel": {
      fontWeight: "600",
      fontSize: "13px",
    },
    ".Input": {
      border: "1px solid #e4e4e7",
      borderRadius: "12px",
      padding: "11px 14px",
      fontSize: "14px",
      backgroundColor: "#ffffff",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    },
    ".Input:focus": {
      borderColor: "#0a7c6e",
      boxShadow: "0 0 0 2px rgba(10, 124, 110, 0.2)",
      outline: "none",
    },
    ".Input--invalid": {
      borderColor: "#ef4444",
      backgroundColor: "rgba(254, 242, 242, 0.5)",
      boxShadow: "0 0 0 2px rgba(239, 68, 68, 0.15)",
    },
    ".Label": {
      fontWeight: "600",
      fontSize: "12px",
      marginBottom: "6px",
      color: "#3f3f46", // zinc-700
    },
    ".Block": {
      borderRadius: "12px",
      borderColor: "#e4e4e7",
    },
    ".Error": {
      fontSize: "12px",
      marginTop: "4px",
      color: "#ef4444",
    },
  },
};

/**
 * Builds standard Stripe Elements options for checkout
 * @param {number} totalAmount - Cart grand total in USD
 */
export const buildStripeElementsOptions = (totalAmount = 0) => {
  const amountInCents = Math.max(50, Math.round(Number(totalAmount || 1) * 100));
  return {
    mode: "payment",
    amount: amountInCents,
    currency: "usd",
    fonts: stripeFonts,
    appearance: stripeAppearance,
  };
};
