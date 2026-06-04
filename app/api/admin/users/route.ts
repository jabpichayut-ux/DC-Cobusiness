import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { CreateUserInput, UserTag } from "@/lib/types";

function checkAuth(req: NextRequest) {
  return req.headers.get("x-admin-secret") === process.env.ADMIN_SECRET;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabaseClient();
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");

  let query = supabase.from("users").select("*").order("created_at", { ascending: false });

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data });
}

export async function PATCH(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { id, tags, apartment_unit } = body as { id: string; tags?: UserTag[]; apartment_unit?: string };

  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = createServerSupabaseClient();
  const updateData: Partial<CreateUserInput> = {};
  if (tags !== undefined) updateData.tags = tags;
  if (apartment_unit !== undefined) updateData.apartment_unit = apartment_unit;

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, data });
}
