import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const { data } = await supabaseAdmin
    .from("clients")
    .select("*")
    .eq("user_id", userId);

  return NextResponse.json(data);
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  const { name, phone, notes, userId } = body;

  await supabaseAdmin.from("clients").insert({
    name,
    phone,
    notes,
    user_id: userId,
  });

  return NextResponse.json({ success: true });
}

// DELETE
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await supabaseAdmin.from("clients").delete().eq("id", id);

  return NextResponse.json({ success: true });
}