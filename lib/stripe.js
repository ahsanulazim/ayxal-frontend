import { loadStripe } from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const isKeyValid =
  Boolean(publishableKey) &&
  !publishableKey.includes("placeholder") &&
  (publishableKey.startsWith("pk_test_") || publishableKey.startsWith("pk_live_"));

export const stripePromise = isKeyValid ? loadStripe(publishableKey) : null;

export const isStripeClientReady = isKeyValid;
