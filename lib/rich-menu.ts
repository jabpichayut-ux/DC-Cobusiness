import type { RichMenu } from "./types";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
const liffHome = process.env.NEXT_PUBLIC_LIFF_ID_HOME || "";
const liffApartment = process.env.NEXT_PUBLIC_LIFF_ID_APARTMENT || "";
const liffGold = process.env.NEXT_PUBLIC_LIFF_ID_GOLD || "";
const liffPromotions = process.env.NEXT_PUBLIC_LIFF_ID_PROMOTIONS || "";
const liffRepair = process.env.NEXT_PUBLIC_LIFF_ID_REPAIR || "";
const liffPayRent = process.env.NEXT_PUBLIC_LIFF_ID_PAY_RENT || "";

// 2500x1686 with 3x2 grid: each cell is ~833x843
const W = 833;
const H = 843;

function cell(col: number, row: number) {
  return {
    x: col * W,
    y: row * H,
    width: W,
    height: H,
  };
}

export function getHomeRichMenu(): RichMenu {
  return {
    size: { width: 2500, height: 1686 },
    selected: true,
    name: "richmenu-home",
    chatBarText: "🏠 หน้าหลัก",
    areas: [
      {
        bounds: cell(0, 0),
        action: {
          type: "uri",
          label: "บัตรสมาชิก",
          uri: `https://liff.line.me/${liffHome}`,
        },
      },
      {
        bounds: cell(1, 0),
        action: {
          type: "uri",
          label: "ดูโปรไฟล์",
          uri: `https://liff.line.me/${liffHome}?tab=profile`,
        },
      },
      {
        bounds: cell(2, 0),
        action: {
          type: "uri",
          label: "โปรโมชั่น",
          uri: `https://liff.line.me/${liffPromotions}`,
        },
      },
      {
        bounds: cell(0, 1),
        action: {
          type: "postback",
          label: "ประกาศ",
          data: "action=announcements&type=all",
          displayText: "ดูประกาศทั้งหมด",
        },
      },
      {
        bounds: cell(1, 1),
        action: {
          type: "postback",
          label: "ติดต่อเรา",
          data: "action=contact",
          displayText: "ติดต่อเรา",
        },
      },
      {
        bounds: cell(2, 1),
        action: {
          type: "richmenuswitch",
          label: "บริการทั้งหมด",
          richMenuAliasId: "richmenu-alias-apartment",
          data: "action=switch&menu=apartment",
        },
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
        action: {
          type: "uri",
          label: "ชำระค่าเช่า",
          uri: `https://liff.line.me/${liffPayRent}`,
        },
      },
      {
        bounds: cell(1, 0),
        action: {
          type: "uri",
          label: "แจ้งซ่อม",
          uri: `https://liff.line.me/${liffRepair}`,
        },
      },
      {
        bounds: cell(2, 0),
        action: {
          type: "postback",
          label: "ติดต่อเจ้าหน้าที่",
          data: "action=contact&type=apartment",
          displayText: "ติดต่อเจ้าหน้าที่ห้องพัก",
        },
      },
      {
        bounds: cell(0, 1),
        action: {
          type: "postback",
          label: "ประกาศห้องพัก",
          data: "action=announcements&type=apartment",
          displayText: "ดูประกาศห้องพัก",
        },
      },
      {
        bounds: cell(1, 1),
        action: {
          type: "uri",
          label: "ข้อมูลห้อง",
          uri: `https://liff.line.me/${liffApartment}`,
        },
      },
      {
        bounds: cell(2, 1),
        action: {
          type: "uri",
          label: "โปรโมชั่นใกล้เคียง",
          uri: `https://liff.line.me/${liffPromotions}?type=apartment`,
        },
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
        action: {
          type: "uri",
          label: "ราคาทองวันนี้",
          uri: `https://liff.line.me/${liffGold}`,
        },
      },
      {
        bounds: cell(1, 0),
        action: {
          type: "postback",
          label: "สาขา",
          data: "action=gold_locations",
          displayText: "ดูสาขาร้านทอง",
        },
      },
      {
        bounds: cell(2, 0),
        action: {
          type: "uri",
          label: "โปรโมชั่น",
          uri: `https://liff.line.me/${liffPromotions}?type=gold`,
        },
      },
      {
        bounds: cell(0, 1),
        action: {
          type: "postback",
          label: "นัดหมาย",
          data: "action=gold_appointment",
          displayText: "นัดหมายร้านทอง",
        },
      },
      {
        bounds: cell(1, 1),
        action: {
          type: "postback",
          label: "ติดต่อร้าน",
          data: "action=contact&type=gold",
          displayText: "ติดต่อร้านทอง",
        },
      },
      {
        bounds: cell(2, 1),
        action: {
          type: "postback",
          label: "ข้อมูลซื้อ/ขาย",
          data: "action=gold_info",
          displayText: "ข้อมูลการซื้อขายทอง",
        },
      },
    ],
  };
}

export function getPromotionsRichMenu(): RichMenu {
  return {
    size: { width: 2500, height: 1686 },
    selected: false,
    name: "richmenu-promotions",
    chatBarText: "🎁 โปรโมชั่น",
    areas: [
      {
        bounds: cell(0, 0),
        action: {
          type: "uri",
          label: "โปรโมชั่นทั้งหมด",
          uri: `https://liff.line.me/${liffPromotions}`,
        },
      },
      {
        bounds: cell(1, 0),
        action: {
          type: "uri",
          label: "ดีลห้องพัก",
          uri: `https://liff.line.me/${liffPromotions}?type=apartment`,
        },
      },
      {
        bounds: cell(2, 0),
        action: {
          type: "uri",
          label: "ดีลร้านทอง",
          uri: `https://liff.line.me/${liffPromotions}?type=gold`,
        },
      },
      {
        bounds: cell(0, 1),
        action: {
          type: "postback",
          label: "มาใหม่",
          data: "action=new_arrivals",
          displayText: "ดูสิทธิพิเศษมาใหม่",
        },
      },
      {
        bounds: cell(1, 1),
        action: {
          type: "uri",
          label: "VIP ดีล",
          uri: `https://liff.line.me/${liffPromotions}?type=vip`,
        },
      },
      {
        bounds: cell(2, 1),
        action: {
          type: "postback",
          label: "แชร์รับแต้ม",
          data: "action=share_earn",
          displayText: "แชร์และรับสิทธิพิเศษ",
        },
      },
    ],
  };
}

export const RICH_MENU_ALIASES = {
  home: "richmenu-alias-home",
  apartment: "richmenu-alias-apartment",
  gold: "richmenu-alias-gold",
  promotions: "richmenu-alias-promotions",
};
