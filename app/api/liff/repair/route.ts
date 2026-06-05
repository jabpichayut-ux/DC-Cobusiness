import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { CreateRepairRequestInput } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body: CreateRepairRequestInput = await req.json();
  if (!body.line_user_id || !body.apartment_unit || !body.issue_type || !body.description)
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  const supabase = createServerSupabaseClient();
  const { data: user } = await supabase.from("users").select("id").eq("line_user_id", body.line_user_id).single();
  const { data, error } = await supabase.from("repair_requests").insert({ ...body, user_id: user?.id ?? null }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await createServerSupabaseClient().from("repair_requests").select("*, users(display_name)").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, data });
}