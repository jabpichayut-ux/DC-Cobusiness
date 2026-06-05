import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "home";

  const liffIds: Record<string, string | undefined> = {
    home: process.env.NEXT_PUBLIC_LIFF_ID_HOME,
    apartment: process.env.NEXT_PUBLIC_LIFF_ID_APARTMENT,
    gold: process.env.NEXT_PUBLIC_LIFF_ID_GOLD,
    promotions: process.env.NEXT_PUBLIC_LIFF_ID_PROMOTIONS,
    repair: process.env.NEXT_PUBLIC_LIFF_ID_REPAIR,
    "pay-rent": process.env.NEXT_PUBLIC_LIFF_ID_PAY_RENT,
  };

  const liffId = liffIds[type];

  if (!liffId) {
    return NextResponse.json({ error: "LIFF ID not configured" }, { status: 404 });
  }

  return NextResponse.json({ liffId });
}
