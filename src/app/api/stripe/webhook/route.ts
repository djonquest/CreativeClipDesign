import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getPlanFromPrice(priceId: string) {
  if (
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY ||
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY
  ) {
    return { plan: "starter", credits: 30 };
  }

  if (
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ||
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY
  ) {
    return { plan: "pro", credits: 100 };
  }

  if (
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY ||
    priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_YEARLY
  ) {
    return { plan: "elite", credits: 300 };
  }

  return { plan: "starter", credits: 10 };
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura Stripe ausente" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Erro na validação do webhook:", err);

    return NextResponse.json(
      { error: "Webhook inválido" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (!userId || !subscriptionId) {
        return NextResponse.json({ received: true });
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      const priceId = subscription.items.data[0]?.price.id;
      const { plan, credits } = getPlanFromPrice(priceId);

      await supabase
        .from("profiles")
        .update({
          plan,
          credits,
          stripe_customer_id: customerId,
        })
        .eq("id", userId);
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await supabase
        .from("profiles")
        .update({
          plan: "starter",
          credits: 10,
        })
        .eq("stripe_customer_id", customerId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Erro ao processar webhook:", err);

    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}