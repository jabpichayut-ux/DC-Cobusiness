import type { RichMenu } from "./types";

const liffApartment = process.env.NEXT_PUBLIC_LIFF_ID_APARTMENT || "";
const liffGold = process.env.NEXT_PUBLIC_LIFF_ID_GOLD || "";
const liffWarehouse = process.env.NEXT_PUBLIC_LIFF_ID_WAREHOUSE || "";
const liffFurniture = process.env.NEXT_PUBLIC_LIFF_ID_FURNITURE || "";

// 2500x1686 with 3x2 grid: each cell is ~833x843
const W = 833;
const H = 843;

function cell(col: number, row: number) {
  return { x: col * W, y: row * H, width: W, height: H };
}

export function getHomeRichMenu(): RichMenu {
  return {
    size: { width: 2500, height: 1686 },
    selected: true,
    name: "richmenu-home",
    chatBarText: "🏘️ DC Co-Business",
    areas: [
      {
        bounds: cell(0, 0),
        action: { type: "richmenuswitch", label: "🏠 ห้องพัก", richMenuAliasId: "richmenu-alias-apartment", data: "action=switch&menu=apartment" },
      },
      {
        bounds: cell(1, 0),
        action: { type: "richmenuswitch", label: "💛 ร้านทอง", richMenuAliasId: "richmenu-alias-gold", data: "action=switch&menu=gold" },
      },
      {
        bounds: cell(2, 0),
        action: { type: "richmenuswitch", label: "🏭 โกดัง", richMenuAliasId: "richmenu-alias-warehouse", data: "action=switch&menu=warehouse" },
      },
      {
        bounds: cell(0, 1),
        action: { type: "richmenuswitch", label: "🪑 เฟอร์นิเจอร์", richMenuAliasId: "richmenu-alias-furniture", data: "action=switch&menu=furniture" },
      },
      {
        bounds: cell(1, 1),
        action: { type: "postback", label: "📢 ประกาศ", data: "action=announcements&type=all", displayText: "ดูประกาศทั้งหมด" },
      },
      {
        bounds: cell(2, 1),
        action: { type: "postback", label: "📞 ติดต่อ", data: "action=contact", displayText: "ติดต่อเรา" },
      },
    ],
  };
}

export function getApartmentRichMenu(): RichMenu {
  return {
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "richmenu-apartment",
    chatBarText: "🏠 ห้องพัก",
    areas: [
      {
        bounds: cell(0, 0),
        action: { type: "uri", label: "ข้อมูลห้อง", uri: `https://liff.line.me/${liffApartment}` },
      },
      {
        bounds: cell(1, 0),
        action: { type: "uri", label: "ชำระค่าเช่า", uri: `https://liff.line.me/${liffApartment}?tab=pay` },
      },
      {
        bounds: cell(2, 0),
        action: { type: "uri", label: "แจ้งซ่อม", uri: `https://liff.line.me/${liffApartment}?tab=repair` },
      },
      {
        bounds: cell(0, 1),
        action: { type: "postback", label: "ประกาศ", data: "action=announcements&type=apartment", displayText: "ดูประกาศห้องพัก" },
      },
      {
        bounds: cell(1, 1),
        action: { type: "postback", label: "ติดต่อ", data: "action=contact&type=apartment", displayText: "ติดต่อเจ้าหน้าที่" },
      },
      {
        bounds: cell(2, 1),
        action: { type: "richmenuswitch", label: "🏘️ หน้าหลัก", richMenuAliasId: "richmenu-alias-home", data: "action=switch&menu=home" },
      },
    ],
  };
}

export function getGoldRichMenu(): RichMenu {
  return {
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "richmenu-gold",
    chatBarText: "💛 ร้านทอง",
    areas: [
      {
        bounds: cell(0, 0),
        action: { type: "uri", label: "ราคาทองวันนี้", uri: `https://liff.line.me/${liffGold}` },
      },
      {
        bounds: cell(1, 0),
        action: { type: "uri", label: "โปรโมชั่น", uri: `https://liff.line.me/${liffGold}?tab=promo` },
      },
      {
        bounds: cell(2, 0),
        action: { type: "postback", label: "สาขา", data: "action=gold_locations", displayText: "ดูสาขาร้านทอง" },
      },
      {
        bounds: cell(0, 1),
        action: { type: "postback", label: "นัดหมาย", data: "action=gold_appointment", displayText: "นัดหมายร้านทอง" },
      },
      {
        bounds: cell(1, 1),
        action: { type: "postback", label: "ติดต่อ", data: "action=contact&type=gold", displayText: "ติดต่อร้านทอง" },
      },
      {
        bounds: cell(2, 1),
        action: { type: "richmenuswitch", label: "🏘️ หน้าหลัก", richMenuAliasId: "richmenu-alias-home", data: "action=switch&menu=home" },
      },
    ],
  };
}

export function getWarehouseRichMenu(): RichMenu {
  return {
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "richmenu-warehouse",
    chatBarText: "🏭 โกดัง",
    areas: [
      {
        bounds: cell(0, 0),
        action: { type: "uri", label: "บริการโกดัง", uri: `https://liff.line.me/${liffWarehouse}` },
      },
      {
        bounds: cell(1, 0),
        action: { type: "uri", label: "ดูพื้นที่ว่าง", uri: `https://liff.line.me/${liffWarehouse}?tab=spaces` },
      },
      {
        bounds: cell(2, 0),
        action: { type: "uri", label: "โปรโมชั่น", uri: `https://liff.line.me/${liffWarehouse}?tab=promo` },
      },
      {
        bounds: cell(0, 1),
        action: { type: "postback", label: "ประกาศ", data: "action=announcements&type=warehouse", displayText: "ดูประกาศโกดัง" },
      },
      {
        bounds: cell(1, 1),
        action: { type: "postback", label: "ติดต่อ", data: "action=contact&type=warehouse", displayText: "ติดต่อโกดัง" },
      },
      {
        bounds: cell(2, 1),
        action: { type: "richmenuswitch", label: "🏘️ หน้าหลัก", richMenuAliasId: "richmenu-alias-home", data: "action=switch&menu=home" },
      },
    ],
  };
}

export function getFurnitureRichMenu(): RichMenu {
  return {
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "richmenu-furniture",
    chatBarText: "🪑 เฟอร์นิเจอร์",
    areas: [
      {
        bounds: cell(0, 0),
        action: { type: "uri", label: "สินค้าทั้งหมด", uri: `https://liff.line.me/${liffFurniture}` },
      },
      {
        bounds: cell(1, 0),
        action: { type: "uri", label: "โปรโมชั่น", uri: `https://liff.line.me/${liffFurniture}?tab=promo` },
      },
      {
        bounds: cell(2, 0),
        action: { type: "uri", label: "แคตตาล็อก", uri: `https://liff.line.me/${liffFurniture}?tab=catalog` },
      },
      {
        bounds: cell(0, 1),
        action: { type: "postback", label: "ประกาศ", data: "action=announcements&type=furniture", displayText: "ดูประกาศเฟอร์นิเจอร์" },
      },
      {
        bounds: cell(1, 1),
        action: { type: "postback", label: "ติดต่อ", data: "action=contact&type=furniture", displayText: "ติดต่อร้านเฟอร์นิเจอร์" },
      },
      {
        bounds: cell(2, 1),
        action: { type: "richmenuswitch", label: "🏘️ หน้าหลัก", richMenuAliasId: "richmenu-alias-home", data: "action=switch&menu=home" },
      },
    ],
  };
}

export const RICH_MENU_ALIASES = {
  home: "richmenu-alias-home",
  apartment: "richmenu-alias-apartment",
  gold: "richmenu-alias-gold",
  warehouse: "richmenu-alias-warehouse",
  furniture: "richmenu-alias-furniture",
};
