/**
 * Setup LINE Rich Menus
 * Run: npm run setup-rich-menu
 *
 * Creates 5 rich menus (Home + 4 businesses) and sets up tab-switching via aliases.
 * Rich menu images must be uploaded separately (2500x1686px each).
 */

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

if (!CHANNEL_ACCESS_TOKEN) {
  console.error("ERROR: LINE_CHANNEL_ACCESS_TOKEN is not set");
  process.exit(1);
}

const LIFF_APARTMENT = process.env.NEXT_PUBLIC_LIFF_ID_APARTMENT || "";
const LIFF_GOLD = process.env.NEXT_PUBLIC_LIFF_ID_GOLD || "";
const LIFF_WAREHOUSE = process.env.NEXT_PUBLIC_LIFF_ID_WAREHOUSE || "";
const LIFF_FURNITURE = process.env.NEXT_PUBLIC_LIFF_ID_FURNITURE || "";

const BASE_URL = "https://api.line.me/v2/bot";

async function lineApiRequest(endpoint: string, method: string, body?: unknown): Promise<unknown> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`LINE API Error ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

const W = 833;
const H = 843;
const W2 = 834;

function cell(col: number, row: number) {
  return { x: col * W, y: row * H, width: col === 2 ? W2 : W, height: H };
}

const ALIASES = {
  home: "richmenu-alias-home",
  apartment: "richmenu-alias-apartment",
  gold: "richmenu-alias-gold",
  warehouse: "richmenu-alias-warehouse",
  furniture: "richmenu-alias-furniture",
};

function buildHomeMenu() {
  return {
    size: { width: 2500, height: 1686 },
    selected: true,
    name: "richmenu-home",
    chatBarText: "🏘️ DC Co-Business",
    areas: [
      { bounds: cell(0, 0), action: { type: "richmenuswitch", label: "🏠 ห้องพัก", richMenuAliasId: ALIASES.apartment, data: "action=switch&menu=apartment" } },
      { bounds: cell(1, 0), action: { type: "richmenuswitch", label: "💛 ร้านทอง", richMenuAliasId: ALIASES.gold, data: "action=switch&menu=gold" } },
      { bounds: cell(2, 0), action: { type: "richmenuswitch", label: "🏭 โกดัง", richMenuAliasId: ALIASES.warehouse, data: "action=switch&menu=warehouse" } },
      { bounds: cell(0, 1), action: { type: "richmenuswitch", label: "🪑 เฟอร์นิเจอร์", richMenuAliasId: ALIASES.furniture, data: "action=switch&menu=furniture" } },
      { bounds: cell(1, 1), action: { type: "postback", label: "📢 ประกาศ", data: "action=announcements&type=all", displayText: "ดูประกาศทั้งหมด" } },
      { bounds: cell(2, 1), action: { type: "postback", label: "📞 ติดต่อ", data: "action=contact", displayText: "ติดต่อเรา" } },
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
      { bounds: cell(0, 0), action: { type: "uri", label: "ข้อมูลห้อง", uri: `https://liff.line.me/${LIFF_APARTMENT}` } },
      { bounds: cell(1, 0), action: { type: "uri", label: "ชำระค่าเช่า", uri: `https://liff.line.me/${LIFF_APARTMENT}?tab=pay` } },
      { bounds: cell(2, 0), action: { type: "uri", label: "แจ้งซ่อม", uri: `https://liff.line.me/${LIFF_APARTMENT}?tab=repair` } },
      { bounds: cell(0, 1), action: { type: "postback", label: "ประกาศ", data: "action=announcements&type=apartment", displayText: "ดูประกาศห้องพัก" } },
      { bounds: cell(1, 1), action: { type: "postback", label: "ติดต่อ", data: "action=contact&type=apartment", displayText: "ติดต่อเจ้าหน้าที่" } },
      { bounds: cell(2, 1), action: { type: "richmenuswitch", label: "🏘️ หน้าหลัก", richMenuAliasId: ALIASES.home, data: "action=switch&menu=home" } },
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
      { bounds: cell(0, 0), action: { type: "uri", label: "ราคาทองวันนี้", uri: `https://liff.line.me/${LIFF_GOLD}` } },
      { bounds: cell(1, 0), action: { type: "uri", label: "โปรโมชั่น", uri: `https://liff.line.me/${LIFF_GOLD}?tab=promo` } },
      { bounds: cell(2, 0), action: { type: "postback", label: "สาขา", data: "action=gold_locations", displayText: "ดูสาขาร้านทอง" } },
      { bounds: cell(0, 1), action: { type: "postback", label: "นัดหมาย", data: "action=gold_appointment", displayText: "นัดหมายร้านทอง" } },
      { bounds: cell(1, 1), action: { type: "postback", label: "ติดต่อ", data: "action=contact&type=gold", displayText: "ติดต่อร้านทอง" } },
      { bounds: cell(2, 1), action: { type: "richmenuswitch", label: "🏘️ หน้าหลัก", richMenuAliasId: ALIASES.home, data: "action=switch&menu=home" } },
    ],
  };
}

function buildWarehouseMenu() {
  return {
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "richmenu-warehouse",
    chatBarText: "🏭 โกดัง",
    areas: [
      { bounds: cell(0, 0), action: { type: "uri", label: "บริการโกดัง", uri: `https://liff.line.me/${LIFF_WAREHOUSE}` } },
      { bounds: cell(1, 0), action: { type: "uri", label: "ดูพื้นที่ว่าง", uri: `https://liff.line.me/${LIFF_WAREHOUSE}?tab=spaces` } },
      { bounds: cell(2, 0), action: { type: "uri", label: "โปรโมชั่น", uri: `https://liff.line.me/${LIFF_WAREHOUSE}?tab=promo` } },
      { bounds: cell(0, 1), action: { type: "postback", label: "ประกาศ", data: "action=announcements&type=warehouse", displayText: "ดูประกาศโกดัง" } },
      { bounds: cell(1, 1), action: { type: "postback", label: "ติดต่อ", data: "action=contact&type=warehouse", displayText: "ติดต่อโกดัง" } },
      { bounds: cell(2, 1), action: { type: "richmenuswitch", label: "🏘️ หน้าหลัก", richMenuAliasId: ALIASES.home, data: "action=switch&menu=home" } },
    ],
  };
}

function buildFurnitureMenu() {
  return {
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "richmenu-furniture",
    chatBarText: "🪑 เฟอร์นิเจอร์",
    areas: [
      { bounds: cell(0, 0), action: { type: "uri", label: "สินค้าทั้งหมด", uri: `https://liff.line.me/${LIFF_FURNITURE}` } },
      { bounds: cell(1, 0), action: { type: "uri", label: "โปรโมชั่น", uri: `https://liff.line.me/${LIFF_FURNITURE}?tab=promo` } },
      { bounds: cell(2, 0), action: { type: "uri", label: "แคตตาล็อก", uri: `https://liff.line.me/${LIFF_FURNITURE}?tab=catalog` } },
      { bounds: cell(0, 1), action: { type: "postback", label: "ประกาศ", data: "action=announcements&type=furniture", displayText: "ดูประกาศเฟอร์นิเจอร์" } },
      { bounds: cell(1, 1), action: { type: "postback", label: "ติดต่อ", data: "action=contact&type=furniture", displayText: "ติดต่อร้านเฟอร์นิเจอร์" } },
      { bounds: cell(2, 1), action: { type: "richmenuswitch", label: "🏘️ หน้าหลัก", richMenuAliasId: ALIASES.home, data: "action=switch&menu=home" } },
    ],
  };
}

async function deleteExistingAliases() {
  console.log("Cleaning up existing aliases...");
  for (const alias of Object.values(ALIASES)) {
    try {
      await lineApiRequest(`/richmenu/alias/${alias}`, "DELETE");
      console.log(`  Deleted alias: ${alias}`);
    } catch { /* alias may not exist yet */ }
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
  await lineApiRequest("/richmenu/alias", "POST", { richMenuAliasId: aliasId, richMenuId });
}

async function main() {
  console.log("=== DC Co-Business LINE Rich Menu Setup ===\n");
  console.log("Businesses: Apartment | Gold | Warehouse | Furniture\n");

  await deleteExistingAliases();

  const [homeId, apartmentId, goldId, warehouseId, furnitureId] = await Promise.all([
    createRichMenu(buildHomeMenu(), "home"),
    createRichMenu(buildApartmentMenu(), "apartment"),
    createRichMenu(buildGoldMenu(), "gold"),
    createRichMenu(buildWarehouseMenu(), "warehouse"),
    createRichMenu(buildFurnitureMenu(), "furniture"),
  ]);

  await createAlias(homeId, ALIASES.home);
  await createAlias(apartmentId, ALIASES.apartment);
  await createAlias(goldId, ALIASES.gold);
  await createAlias(warehouseId, ALIASES.warehouse);
  await createAlias(furnitureId, ALIASES.furniture);

  // Set home as default for all users
  await lineApiRequest(`/user/all/richmenu/${homeId}`, "POST");
  console.log(`\nSet home menu as default for all users.`);

  console.log("\n=== Summary ===");
  console.log(`Home menu ID:       ${homeId}`);
  console.log(`Apartment menu ID:  ${apartmentId}`);
  console.log(`Gold menu ID:       ${goldId}`);
  console.log(`Warehouse menu ID:  ${warehouseId}`);
  console.log(`Furniture menu ID:  ${furnitureId}`);
  console.log("\nNext: upload 2500x1686px images for each menu via LINE OA Manager or curl:");
  console.log(`curl -X POST https://api-data.line.me/v2/bot/richmenu/${homeId}/content \\`);
  console.log(`  -H "Authorization: Bearer $LINE_CHANNEL_ACCESS_TOKEN" \\`);
  console.log(`  -H "Content-Type: image/png" --data-binary @home-menu.png`);
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
