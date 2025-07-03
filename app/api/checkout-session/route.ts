import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY as string) || "");

const createCheckout = async (req: NextRequest) => {
  const { email } = await req.json();
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
      customer_email: email,
    });
    return NextResponse.json({ paymentIntent }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};

export { createCheckout as GET, createCheckout as POST };
