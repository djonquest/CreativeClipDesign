import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const { data } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return NextResponse.json(data);
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  const { userId, price, delivery_date } = body;

  await supabaseAdmin.from("orders").insert({
    user_id: userId,
    price,
    delivery_date,
    status: "pending",
  });

  return NextResponse.json({ success: true });
}

// PUT (status)
export async function PUT(req: Request) {
  const body = await req.json();
  const { id, status } = body;

  await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", id);

  return NextResponse.json({ success: true });
}