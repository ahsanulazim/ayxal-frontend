/**
 * Formats payment details into user-friendly badge labels and metadata
 */
export const formatPaymentMethod = (order) => {
  const details = order?.paymentDetails;

  if (!details) {
    const rawMethod = order?.paymentMethod || "stripe";
    return {
      title: rawMethod === "stripe" ? "Credit / Debit Card" : rawMethod,
      subtitle: "Processed securely via Stripe",
      badgeText: "Card",
      brand: "card",
      last4: "",
      wallet: null,
      gateway: "Stripe",
      fullText: "Credit / Debit Card (Stripe)",
      receiptUrl: null,
    };
  }

  const brandRaw = details.brand || "card";
  const brandUpper = brandRaw.charAt(0).toUpperCase() + brandRaw.slice(1);
  const last4 = details.last4 ? `•••• ${details.last4}` : "";

  let walletName = null;
  if (details.wallet) {
    if (details.wallet === "apple_pay") walletName = "Apple Pay";
    else if (details.wallet === "google_pay") walletName = "Google Pay";
    else if (details.wallet === "link") walletName = "Stripe Link";
    else walletName = details.wallet;
  }

  const title = walletName || `${brandUpper} ${last4}`.trim();
  const subtitle = walletName && last4 ? `${brandUpper} (${last4})` : "Processed securely via Stripe";
  const badgeText = walletName ? walletName : details.last4 ? `${brandUpper} ••${details.last4}` : brandUpper;
  const fullText = walletName
    ? `${walletName} (${brandUpper} ${last4})`
    : `${brandUpper} ${last4}`.trim();

  return {
    title,
    subtitle,
    badgeText,
    brand: brandRaw.toLowerCase(),
    brandName: brandUpper,
    last4: details.last4 || "",
    wallet: walletName,
    gateway: "Stripe",
    fullText: fullText || "Card (Stripe)",
    receiptUrl: details.receiptUrl || null,
  };
};
