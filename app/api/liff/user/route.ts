import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { line_user_id, display_name, picture_url } = await req.json();

  if (!line_user_id) {
    return NextResponse.json({ error: "line_user_id required" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .upsert(
      { line_user_id, display_name, picture_url },
      { onConflict: "line_user_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
