import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

async function fulfillCheckout(session: Stripe.Checkout.Session, stripe: Stripe) {
  const userId = session.metadata?.userId || session.client_reference_id;
  if (!userId) {
    console.error("Checkout session completed without a userId reference:", session.id);
    return;
  }

  let validity = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  if (typeof session.subscription === "string") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription);
    if (subscription.current_period_end) {
      validity = new Date(subscription.current_period_end * 1000);
    }
  }

  await prisma.membership.create({
    data: {
      userId,
      membershipId: session.id,
      membershipType: "PREMIUM",
      paymentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      paymentStatus: session.payment_status,
      totalAmt: (session.amount_total ?? 0) / 100,
      paymentDate: new Date(),
      paymentValidity: validity,
      membershipStatus: "ACTIVE",
    },
  });
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !endpointSecret) {
    return NextResponse.json(
      { error: "Webhook is not configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    if (!signature) throw new Error("Missing stripe-signature header");
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillCheckout(session, stripe);
    }
  } catch (error) {
    console.error("Error handling webhook event:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
