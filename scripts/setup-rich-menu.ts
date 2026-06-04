/**
 * Setup LINE Rich Menus
 * Run: npm run setup-rich-menu
 *
 * This script creates 4 rich menus and sets up tab-switching via aliases.
 * Rich menu images must be uploaded separately (2500x1686px each).
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

if (!CHANNEL_ACCESS_TOKEN) {
  console.error("ERROR: LINE_CHANNEL_ACCESS_TOKEN is not set");
  process.exit(1);
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app";
const LIFF_HOME = process.env.NEXT_PUBLIC_LIFF_ID_HOME || "";
const LIFF_APARTMENT = process.env.NEXT_PUBLIC_LIFF_ID_APARTMENT || "";
const LIFF_GOLD = process.env.NEXT_PUBLIC_LIFF_ID_GOLD || "";
const LIFF_PROMOTIONS = process.env.NEXT_PUBLIC_LIFF_ID_PROMOTIONS || "";
const LIFF_REPAIR = process.env.NEXT_PUBLIC_LIFF_ID_REPAIR || "";
const LIFF_PAY_RENT = process.env.NEXT_PUBLIC_LIFF_ID_PAY_RENT || "";

const BASE_URL = "https://api.line.me/v2/bot";

async function lineApiRequest(
  endpoint: string,
  method: string,
  body?: unknown
): Promise<unknown> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `LINE API Error ${res.status}: ${JSON.stringify(data)}`
    );
  }

  return data;
}

// 2500x1686 with 3x2 grid
const W = 833;
const H = 843;
const W2 = 834; // last column slightly wider to fill 2500

function cell(col: number, row: number) {
  return {
    x: col * W,
    y: row * H,
    width: col === 2 ? W2 : W,
    height: H,
  };
}

const ALIASES = {
  home: "richmenu-alias-home",
  apartment: "richmenu-alias-apartment",
  gold: "richmenu-alias-gold",
  promotions: "richmenu-alias-promotions",
};

function buildHomeMenu() {
  return {
    size: { width: 2500, height: 1686 },
    selected: true,
    name: "richmenu-home",
    chatBarText: "🏠 เมนูหลัก",
    areas: [
      {
        bounds: cell(0, 0),
        action: { type: "uri", label: "บัตรสมาชิก", uri: `https://liff.line.me/${LIFF_HOME}` },
      },
      {
        bounds: cell(1, 0),
        action: { type: "uri", label: "ดูโปรไฟล์", uri: `https://liff.line.me/${LIFF_HOME}?tab=profile` },
      },
      {
        bounds: cell(2, 0),
        action: { type: "uri", label: "โปรโมชั่น", uri: `https://liff.line.me/${LIFF_PROMOTIONS}` },
      },
      {
        bounds: cell(0, 1),
        action: { type: "postback", label: "ประกาศ", data: "action=announcements&type=all", displayText: "ดูประกาศทั้งหมด" },
      },
      {
        bounds: cell(1, 1),
        action: { type: "postback", label: "ติดต่อเรา", data: "action=contact", displayText: "ติดต่อเรา" },
      },
      {
        bounds: cell(2, 1),
        action: {
          type: "richmenuswitch",
          label: "บริการทั้งหมด",
          richMenuAliasId: ALIASES.apartment,
          data: "action=switch&menu=apartment",
        },
      },
    ],
  };
}

function buildApartmentMenu() {
  return {
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "richmenu-apartment",
    chatBarText: "🏠 ห้องพัก",
    areas: [
      {
        bounds: cell(0, 0),
        action: { type: "uri", label: "ชำระค่าเช่า", uri: `https://liff.line.me/${LIFF_PAY_RENT}` },
      },
      {
        bounds: cell(1, 0),
        action: { type: "uri", label: "แจ้งซ่อม", uri: `https://liff.line.me/${LIFF_REPAIR}` },
      },
      {
        bounds: cell(2, 0),
        action: { type: "postback", label: "ติดต่อเจ้าหน้าที่", data: "action=contact&type=apartment", displayText: "ติดต่อเจ้าหน้าที่" },
      },
      {
        bounds: cell(0, 1),
        action: { type: "postback", label: "ประกาศห้องพัก", data: "action=announcements&type=apartment", displayText: "ดูประกาศห้องพัก" },
      },
      {
        bounds: cell(1, 1),
        action: { type: "uri", label: "ข้อมูลห้อง", uri: `https://liff.line.me/${LIFF_APARTMENT}` },
      },
      {
        bounds: cell(2, 1),
        action: { type: "uri", label: "โปรโมชั่น", uri: `https://liff.line.me/${LIFF_PROMOTIONS}?type=apartment` },
      },
    ],
  };
}

function buildGoldMenu() {
  return {
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "richmenu-gold",
    chatBarText: "💛 ร้านทอง",
    areas: [
      {
        bounds: cell(0, 0),
        action: { type: "uri", label: "ราคาทองวันนี้", uri: `https://liff.line.me/${LIFF_GOLD}` },
      },
      {
        bounds: cell(1, 0),
        action: { type: "postback", label: "สาขา", data: "action=gold_locations", displayText: "ดูสาขาร้านทอง" },
      },
      {
        bounds: cell(2, 0),
        action: { type: "uri", label: "โปรโมชั่น", uri: `https://liff.line.me/${LIFF_PROMOTIONS}?type=gold` },
      },
      {
        bounds: cell(0, 1),
        action: { type: "postback", label: "นัดหมาย", data: "action=gold_appointment", displayText: "นัดหมายร้านทอง" },
      },
      {
        bounds: cell(1, 1),
        action: { type: "postback", label: "ติดต่อร้าน", data: "action=contact&type=gold", displayText: "ติดต่อร้านทอง" },
      },
      {
        bounds: cell(2, 1),
        action: { type: "postback", label: "ข้อมูลซื้อ/ขาย", data: "action=gold_info", displayText: "ข้อมูลการซื้อขายทอง" },
      },
    ],
  };
}

function buildPromotionsMenu() {
  return {
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "richmenu-promotions",
    chatBarText: "🎁 โปรโมชั่น",
    areas: [
      {
        bounds: cell(0, 0),
        action: { type: "uri", label: "โปรโมชั่นทั้งหมด", uri: `https://liff.line.me/${LIFF_PROMOTIONS}` },
      },
      {
        bounds: cell(1, 0),
        action: { type: "uri", label: "ดีลห้องพัก", uri: `https://liff.line.me/${LIFF_PROMOTIONS}?type=apartment` },
      },
      {
        bounds: cell(2, 0),
        action: { type: "uri", label: "ดีลร้านทอง", uri: `https://liff.line.me/${LIFF_PROMOTIONS}?type=gold` },
      },
      {
        bounds: cell(0, 1),
        action: { type: "postback", label: "มาใหม่", data: "action=new_arrivals", displayText: "ดูสิทธิพิเศษมาใหม่" },
      },
      {
        bounds: cell(1, 1),
        action: { type: "uri", label: "VIP ดีล", uri: `https://liff.line.me/${LIFF_PROMOTIONS}?type=vip` },
      },
      {
        bounds: cell(2, 1),
        action: { type: "postback", label: "แชร์รับแต้ม", data: "action=share_earn", displayText: "แชร์และรับสิทธิพิเศษ" },
      },
    ],
  };
}

async function deleteExistingAliases() {
  console.log("Cleaning up existing aliases...");
  for (const alias of Object.values(ALIASES)) {
    try {
      await lineApiRequest(`/richmenu/alias/${alias}`, "DELETE");
      console.log(`  Deleted alias: ${alias}`);
    } catch {
      // Alias might not exist
    }
  }
}

async function createRichMenu(menuDef: unknown, name: string): Promise<string> {
  console.log(`Creating rich menu: ${name}`);
  const result = await lineApiRequest("/richmenu", "POST", menuDef) as { richMenuId: string };
  console.log(`  Created: ${result.richMenuId}`);
  return result.richMenuId;
}

async function createAlias(richMenuId: string, aliasId: string) {
  console.log(`Creating alias: ${aliasId} -> ${richMenuId}`);
  await lineApiRequest("/richmenu/alias", "POST", {
    richMenuAliasId: aliasId,
    richMenuId,
  });
}

async function setDefaultRichMenu(richMenuId: string) {
  console.log(`Setting default rich menu: ${richMenuId}`);
  await lineApiRequest(`/user/all/richmenu/${richMenuId}`, "POST");
}

async function main() {
  console.log("=== LINE Rich Menu Setup ===\n");

  // Delete existing aliases to avoid conflicts
  await deleteExistingAliases();

  // Create all 4 menus
  const [homeId, apartmentId, goldId, promotionsId] = await Promise.all([
    createRichMenu(buildHomeMenu(), "home"),
    createRichMenu(buildApartmentMenu(), "apartment"),
    createRichMenu(buildGoldMenu(), "gold"),
    createRichMenu(buildPromotionsMenu(), "promotions"),
  ]);

  // Create aliases
  await createAlias(homeId, ALIASES.home);
  await createAlias(apartmentId, ALIASES.apartment);
  await createAlias(goldId, ALIASES.gold);
  await createAlias(promotionsId, ALIASES.promotions);

  // Set home as default for all users
  await setDefaultRichMenu(homeId);

  console.log("\n=== Summary ===");
  console.log(`Home menu ID:        ${homeId}`);
  console.log(`Apartment menu ID:   ${apartmentId}`);
  console.log(`Gold menu ID:        ${goldId}`);
  console.log(`Promotions menu ID:  ${promotionsId}`);
  console.log("\nNext steps:");
  console.log("1. Upload rich menu images via LINE API or LINE OA Manager");
  console.log("2. Each image: 2500x1686px PNG/JPG");
  console.log("3. The home menu is set as default for all users");
  console.log("\nRich menu IDs for uploading images:");
  console.log(`curl -X POST https://api-data.line.me/v2/bot/richmenu/${homeId}/content \\`);
  console.log(`  -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN" \\`);
  console.log(`  -H "Content-Type: image/png" \\`);
  console.log(`  --data-binary @home-menu.png`);
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
