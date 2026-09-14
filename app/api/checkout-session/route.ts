import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@/auth";

const createCheckout = async () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Payments are not configured" },
      { status: 503 }
    );
  }

  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const prices = await stripe.prices.list({
      limit: 1,
    });
    const paymentIntent = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.WEB_URL}/success`,
      cancel_url: `${process.env.WEB_URL}?canceled=true`,
      customer_email: session.user.email,
      client_reference_id: session.user.id,
      metadata: { userId: session.user.id },
      subscription_data: { metadata: { userId: session.user.id } },
    });
    return NextResponse.json({ paymentIntent }, { status: 200 });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
};

export { createCheckout as POST };
