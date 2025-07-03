// import Stripe from "stripe";
import { NextRequest } from "next/server";
// import { headers } from "next/headers";
// import { prisma } from "@/lib/prisma";

// const stripe = new Stripe(
//   "sk_test_51Qk8U6SBdpnWxAhoACoXGG9ayGWZQDVvJx1psfCOHGx3inNxrF730c0IazvJig8sy5vxOxh8mHReCVwQ5XNKHMQq00W6Pnyaco"
// );
// session: Stripe.Checkout.Session

// const fulfillOrder = async () => {
//   try {
//     await prisma.membership.create({
//       data: {
//         userId: session?.metadata?.userId,
//         membershipId: session.id,
//         membershipType: "PREMIUM",
//         paymentDate: new Date(session.created * 1000),
//         paymentValidity: new Date(session?.metadata?.validity!),
//         paymentStatus: session.payment_status,
//         totalAmt: session?.amount_total! / 100,
//         membershipStatus: "ACTIVE",
//       },
//     });

//     console.log(`SUCCESS: Order ${session.id} has been added to the database`);
//   } catch (error) {
//     console.error("Error in fulfillOrder:", error);
//     throw error;
//   }
// };

export async function POST(request: NextRequest) {
  const body = await request.text();
  console.log(body);
  // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  // const sig = (await headers()).get("stripe-signature") as string;
  // let event: Stripe.Event;
  try {
    // event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${err}`, {
      status: 400,
    });
  }

  // switch (event.type) {
  //   case "checkout.session.async_payment_failed":
  //     // const checkoutSessionAsyncPaymentFailed = event.data.object;
  //     break;
  //   case "checkout.session.async_payment_succeeded":
  //     // const checkoutSessionAsyncPaymentSucceeded = event.data.object;
  //     break;
  //   case "checkout.session.completed":
  //     const session = event.data.object;
  //     try {
  //       // await fulfillOrder(session);
  //       console.log("Done");
  //     } catch (error) {
  //       console.error("Fulfillment error:", error);
  //     }
  //     break;
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
}

// return new Response("RESPONSE EXECUTE", {
//   status: 200,
// });
// }
