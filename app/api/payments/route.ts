import {
  handleCheckoutSessionCompleted,
  handleSubscriptionDeleted,
} from "@/lib/payment-helpers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
export async function POST(req: NextRequest) {
  // webhook functionality

  const payload = await req.text();

  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items"],
          }
        );
        console.log({ session });
        // connect to the db create or update
        await handleCheckoutSessionCompleted({ session, stripe });
        break;
      }

      case "customer.subscription.deleted": {
        // connect to db
        const subscriptionId = event.data.object.id;
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        console.log({ subscription });

        await handleSubscriptionDeleted({ subscriptionId, stripe });
        // update the db
        // update users status to cancelled / revoke their access
        break;
      }
    }
  } catch (err) {
    return NextResponse.json({ status: "Failed", error: err }, { status: 400 });
  }
}
