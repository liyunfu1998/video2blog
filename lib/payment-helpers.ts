import Stripe from "stripe";
import prisma from "./prisma";

export async function handleSubscriptionDeleted({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await prisma.user.update({
      where: {
        customer_id: subscription.customer as string,
      },
      data: {
        status: "canceled",
      },
    });
  } catch (error) {}
}
export async function handleCheckoutSessionCompleted({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) {
  const customerId = session.customer as string;
  const customer = await stripe.customers.retrieve(customerId);
  const priceId = session.line_items?.data[0].price?.id as string;

  if ("email" in customer && priceId) {
    await createOrUpdateUser(customer, customerId);
    // update user subscription
    await updateUserSubscription(priceId, customer.email as string);
    // insert the payment
    await insertPayment(session, priceId, customer.email as string);
  }
}

async function createOrUpdateUser(
  customer: Stripe.Customer,
  customerId: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: customer.email as string,
      },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          email: customer.email as string,
          full_name: customer.name as string,
          customer_id: customerId,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateUserSubscription(priceId: string, email: string) {
  try {
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        price_id: priceId,
        status: "active",
      },
    });
  } catch (error) {
    console.log(error);
  }
}

async function insertPayment(
  session: Stripe.Checkout.Session,
  priceId: string,
  customerEmail: string
) {
  try {
    await prisma.payment.create({
      data: {
        amount: session.amount_total!,
        status: session.status!,
        stripe_payment_id: session.id!,
        price_id: priceId,
        user_email: customerEmail,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
