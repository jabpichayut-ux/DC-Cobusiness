import { NextRequest, NextResponse } from "next/server";
import { verifyLineSignature, lineClient, sendWelcomeMessage } from "@/lib/line";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { WebhookRequestBody, FollowEvent, PostbackEvent, MessageEvent } from "@line/bot-sdk";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-line-signature") || "";
  if (!verifyLineSignature(body, signature)) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  const data: WebhookRequestBody = JSON.parse(body);
  const supabase = createServerSupabaseClient();

  await Promise.all(data.events.map(async (event) => {
    try {
      if (event.type === "follow") await handleFollow(event as FollowEvent, supabase);
      else if (event.type === "postback") await handlePostback(event as PostbackEvent);
      else if (event.type === "message" && event.message.type === "text") await handleMessage(event as MessageEvent);
    } catch (err) { console.error("Event error:", err); }
  }));

  return NextResponse.json({ status: "ok" });
}

async function handleFollow(event: FollowEvent, supabase: ReturnType<typeof createServerSupabaseClient>) {
  const userId = event.source.userId;
  if (!userId) return;
  const profile = await lineClient.getProfile(userId);
  await supabase.from("users").upsert({ line_user_id: userId, display_name: profile.displayName, picture_url: profile.pictureUrl ?? null }, { onConflict: "line_user_id" });
  await sendWelcomeMessage(userId, profile.displayName);
}

async function handlePostback(event: PostbackEvent) {
  const userId = event.source.userId;
  if (!userId) return;
  const params = new URLSearchParams(event.postback.data);
  const action = params.get("action");
  const type = params.get("type");

  switch (action) {
    case "announcements": {
      const texts: Record<string, string> = { apartment: "ประกาศห้องพัก: ไม่มีประกาศใหม่ 🏠", gold: "ประกาศร้านทอง: ไม่มีประกาศใหม่ 💛", warehouse: "ประกาศโกดัง: ไม่มีประกาศใหม่ 🏭", furniture: "ประกาศเฟอร์นิเจอร์: ไม่มีประกาศใหม่ 🪑" };
      await lineClient.replyMessage(event.replyToken, { type: "text", text: (type && texts[type]) || "ประกาศทั้งหมด: ไม่มีประกาศใหม่ 📢" });
      break;
    }
    case "contact":
      await lineClient.replyMessage(event.replyToken, { type: "flex", altText: "ติดต่อเรา", contents: { type: "bubble", body: { type: "box", layout: "vertical", contents: [{ type: "text", text: "ติดต่อเรา 📞", weight: "bold", size: "lg" }, { type: "separator", margin: "md" }, { type: "box", layout: "vertical", margin: "md", spacing: "sm", contents: [{ type: "text", text: "🏠 ห้องพัก: 081-234-5678", size: "sm" }, { type: "text", text: "💛 ร้านทอง: 081-234-5679", size: "sm" }, { type: "text", text: "🏭 โกดัง: 081-234-5680", size: "sm" }, { type: "text", text: "🪑 เฟอร์นิเจอร์: 081-234-5681", size: "sm" }, { type: "text", text: "⏰ เปิด: จ-ศ 9:00-18:00", size: "sm", color: "#666666" }] }], paddingAll: "20px" } } });
      break;
    case "gold_locations":
      await lineClient.replyMessage(event.replyToken, { type: "text", text: "ร้านทอง DC Gold\n📍 สาขา 1: ถนนสุขุมวิท กรุงเทพฯ\n📍 สาขา 2: ถนนเพชรบุรี กรุงเทพฯ\n\nเปิดทุกวัน 09:00-18:00 น." });
      break;
    case "gold_appointment":
      await lineClient.replyMessage(event.replyToken, { type: "text", text: "นัดหมายร้านทอง 💛\nกรุณาติดต่อเราที่ 081-234-5679\nหรือส่งข้อความมาที่นี่ เราจะติดต่อกลับโดยเร็ว" });
      break;
    default: break;
  }
}

async function handleMessage(event: MessageEvent) {
  if (event.message.type !== "text") return;
  const text = event.message.text.toLowerCase();
  if (text.includes("ราคาทอง") || text.includes("gold")) {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.from("gold_prices").select("*").order("updated_at", { ascending: false }).limit(1).single();
    if (data) await lineClient.replyMessage(event.replyToken, { type: "text", text: `ราคาทอง ${data.gold_type} 💛\n📈 รับซื้อ: ${Number(data.buy_price).toLocaleString()} บาท/บาท\n📉 ขาย: ${Number(data.sell_price).toLocaleString()} บาท/บาท\n\nอัปเดต: ${new Date(data.updated_at).toLocaleString("th-TH")}` });
  }
}