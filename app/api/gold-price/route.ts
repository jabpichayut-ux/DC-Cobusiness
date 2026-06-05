import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function GET() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("gold_prices")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return NextResponse.json({ error: "No gold price data" }, { status: 404 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { buy_price, sell_price, gold_type } = await req.json();
  if (!buy_price || !sell_price) return NextResponse.json({ error: "buy_price and sell_price required" }, { status: 400 });

  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.from("gold_prices").insert({ buy_price, sell_price, gold_type: gold_type || "96.5%" }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}