import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// GET
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");

  const { data } = await supabaseAdmin
    .from("measurements")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  return NextResponse.json(data);
}

// POST
export async function POST(req: Request) {
  const body = await req.json();

  await supabaseAdmin.from("measurements").insert(body);

  return NextResponse.json({ success: true });
}