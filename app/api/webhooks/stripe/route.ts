import { NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export const runtime = 'nodejs';

type Profile = {
  id: string;
  email: string | null;
  credits: number | null;
  plan_type: string | null;
  subscription_status: string | null;
};

type UserReference = {
  id?: string;
  email?: string;
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, { apiVersion: '2025-03-31.basil' })
  : null;

function assertRequiredEnv(): void {
  const missing = [
    !stripeSecretKey && 'STRIPE_SECRET_KEY',
    !webhookSecret && 'STRIPE_WEBHOOK_SECRET',
    !supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL/SUPABASE_URL',
    !supabaseServiceRoleKey && 'SUPABASE_SERVICE_ROLE_KEY',
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

function createSupabaseAdminClient(): SupabaseClient {
  assertRequiredEnv();
  return createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function buildProfileScopedQuery(supabase: SupabaseClient, userRef: UserReference) {
  let query = supabase.from('profiles');
  if (userRef.id) {
    query = query.eq('id', userRef.id);
  } else if (userRef.email) {
    query = query.eq('email', userRef.email);
  } else {
    throw new Error('Missing user reference (id/email).');
  }
  return query;
}

export async function updateUserCredits(
  supabase: SupabaseClient,
  userRef: UserReference,
  creditsToAdd: number,
): Promise<void> {
  if (!Number.isFinite(creditsToAdd) || creditsToAdd <= 0) {
    return;
  }

  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const { data, error } = await buildProfileScopedQuery(supabase, userRef)
      .select('credits')
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load current credits: ${error.message}`);
    }
    if (!data) {
      throw new Error('Profile not found while incrementing credits.');
    }

    const currentCredits = data.credits ?? 0;
    const nextCredits = currentCredits + creditsToAdd;

    let updateQuery = buildProfileScopedQuery(supabase, userRef).update({ credits: nextCredits });
    if (data.credits === null || typeof data.credits === 'undefined') {
      updateQuery = updateQuery.is('credits', null);
    } else {
      updateQuery = updateQuery.eq('credits', currentCredits);
    }

    const { data: updatedRows, error: updateError } = await updateQuery.select('id');

    if (updateError) {
      throw new Error(`Failed to update credits: ${updateError.message}`);
    }

    if (updatedRows && updatedRows.length > 0) {
      return;
    }
  }

  throw new Error('Could not safely increment credits after multiple retries.');
}

function resolveUserReference(session: Stripe.Checkout.Session): UserReference {
  const metadata = session.metadata ?? {};
  const userId =
    metadata.user_id ??
    metadata.userId ??
    metadata.supabase_user_id ??
    metadata.supabaseUserId ??
    session.client_reference_id ??
    undefined;

  const email =
    session.customer_details?.email ??
    session.customer_email ??
    metadata.email ??
    metadata.user_email ??
    undefined;

  if (!userId && !email) {
    throw new Error(
      'No user identifier found in checkout session. Include user_id/client_reference_id or email metadata.',
    );
  }

  return { id: userId ?? undefined, email: email ?? undefined };
}

async function loadProfile(supabase: SupabaseClient, userRef: UserReference): Promise<Profile> {
  const { data, error } = await buildProfileScopedQuery(supabase, userRef)
    .select('id, email, credits, plan_type, subscription_status')
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }
  if (!data) {
    throw new Error('Profile not found for checkout session.');
  }

  return data as Profile;
}

function getPlanPriceMap(): Record<string, string> {
  return {
    starter: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY ?? '',
    pro: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY ?? '',
    elite:
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE ??
      process.env.NEXT_PUBLIC_STRIPE_PRICE_ELITE_MONTHLY ??
      '',
  };
}

function getCreditPriceMap(): Map<string, number> {
  const entries: Array<[string | undefined, number]> = [
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_10 ?? process.env.STRIPE_PRICE_CREDITS_10, 10],
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_50 ?? process.env.STRIPE_PRICE_CREDITS_50, 50],
    [process.env.NEXT_PUBLIC_STRIPE_PRICE_CREDITS_100 ?? process.env.STRIPE_PRICE_CREDITS_100, 100],
  ];

  return new Map(entries.filter(([priceId]) => Boolean(priceId)) as Array<[string, number]>);
}

function getWelcomeBonusEligibility(profile: Profile): boolean {
  const hasActiveOrPastPlan = Boolean(profile.plan_type) || Boolean(profile.subscription_status);
  const hasExistingCredits = (profile.credits ?? 0) > 0;
  return !hasActiveOrPastPlan && !hasExistingCredits;
}

export async function POST(request: Request): Promise<Response> {
  try {
    assertRequiredEnv();
    if (!stripe) {
      throw new Error('Stripe SDK failed to initialize.');
    }

    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 });
    }

    const rawBody = await request.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret!);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Stripe signature error';
      console.error('[stripe-webhook] Signature validation failed:', message);
      return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 });
    }

    if (event.type !== 'checkout.session.completed') {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    if (!session.id) {
      throw new Error('checkout.session.completed payload missing session id.');
    }
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ received: true });
    }

    const supabase = createSupabaseAdminClient();
    const userRef = resolveUserReference(session);
    const profile = await loadProfile(supabase, userRef);

    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    const planPriceMap = getPlanPriceMap();
    const creditPriceMap = getCreditPriceMap();

    let purchasedPlanType: string | null = null;
    let purchasedCredits = 0;

    for (const item of lineItems.data) {
      const priceId = item.price?.id;
      if (!priceId) {
        continue;
      }

      const quantity = item.quantity ?? 1;

      const matchedPlan = Object.entries(planPriceMap).find(
        ([, planPriceId]) => planPriceId && planPriceId === priceId,
      );
      if (matchedPlan) {
        purchasedPlanType = matchedPlan[0];
      }

      const creditAmount = creditPriceMap.get(priceId);
      if (creditAmount) {
        purchasedCredits += creditAmount * quantity;
      }
    }

    const shouldGrantWelcomeBonus = getWelcomeBonusEligibility(profile);
    const totalCreditsToAdd = purchasedCredits + (shouldGrantWelcomeBonus ? 20 : 0);

    if (purchasedPlanType) {
      const { error: planError } = await buildProfileScopedQuery(supabase, { id: profile.id }).update({
        plan_type: purchasedPlanType,
        subscription_status: 'active',
      });

      if (planError) {
        throw new Error(`Failed to update plan/subscription status: ${planError.message}`);
      }
    }

    if (totalCreditsToAdd > 0) {
      await updateUserCredits(supabase, { id: profile.id }, totalCreditsToAdd);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected webhook processing error';
    console.error('[stripe-webhook] Processing error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
