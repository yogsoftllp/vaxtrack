import Stripe from "stripe";

const stripeApiKey = process.env.STRIPE_SECRET_KEY || "";

let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripeClient && stripeApiKey) {
    stripeClient = new Stripe(stripeApiKey, { apiVersion: "2023-10-16" });
  }
  return stripeClient as any;
}

export async function createPaymentIntent(amount: number, currency: string = "usd", metadata: Record<string, any> = {}): Promise<Stripe.PaymentIntent | null> {
  try {
    if (!stripeApiKey) {
      console.warn("Stripe API key not configured");
      return null;
    }

    const stripe = getStripeClient();
    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
    });

    return intent;
  } catch (error) {
    console.error("Failed to create payment intent:", error);
    return null;
  }
}

export async function confirmPaymentIntent(intentId: string): Promise<Stripe.PaymentIntent | null> {
  try {
    if (!stripeApiKey) return null;

    const stripe = getStripeClient();
    const intent = await stripe.paymentIntents.retrieve(intentId);
    return intent;
  } catch (error) {
    console.error("Failed to confirm payment intent:", error);
    return null;
  }
}

export async function createCheckoutSession(params: {
  lineItems: Array<{ price: string; quantity: number }>;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}): Promise<Stripe.Checkout.Session | null> {
  try {
    if (!stripeApiKey) return null;

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: params.lineItems,
      mode: "payment",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
    });

    return session;
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    return null;
  }
}

export async function retrieveCheckoutSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  try {
    if (!stripeApiKey) return null;

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error("Failed to retrieve session:", error);
    return null;
  }
}
