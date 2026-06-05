"use client";

import Image from "next/image";
import type { Promotion } from "@/lib/types";

const BUSINESS_LABELS: Record<string, string> = {
  apartment: "ห้องพัก 🏠", gold: "ร้านทอง 💛", warehouse: "โกดัง 🏭", furniture: "เฟอร์นิเจอร์ 🪑", all: "ทุกธุรกิจ",
};

const BUSINESS_COLORS: Record<string, string> = {
  apartment: "bg-green-100 text-green-700", gold: "bg-yellow-100 text-yellow-700",
  warehouse: "bg-orange-100 text-orange-700", furniture: "bg-teal-100 text-teal-700", all: "bg-gray-100 text-gray-700",
};

export function PromotionCard({ promotion }: { promotion: Promotion }) {
  const isExpired = promotion.ends_at && new Date(promotion.ends_at) < new Date();
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${isExpired ? "opacity-60" : ""}`}>
      {promotion.image_url && (
        <div className="relative h-40 bg-gray-100">
          <Image src={promotion.image_url} alt={promotion.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-sm leading-tight">{promotion.title}</h3>
          <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${BUSINESS_COLORS[promotion.business_type]}`}>{BUSINESS_LABELS[promotion.business_type]}</span>
        </div>
        {promotion.description && <p className="text-gray-600 text-xs leading-relaxed mb-3">{promotion.description}</p>}
        {(promotion.starts_at || promotion.ends_at) && (
          <div className="text-xs text-gray-400">
            {promotion.starts_at && <span>เริ่ม {new Date(promotion.starts_at).toLocaleDateString("th-TH", { day: "numeric", month: "short" })}</span>}
            {promotion.starts_at && promotion.ends_at && <span> - </span>}
            {promotion.ends_at && <span>ถึง {new Date(promotion.ends_at).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })}</span>}
            {isExpired && <span className="ml-2 text-red-400">(หมดอายุแล้ว)</span>}
          </div>
        )}
      </div>
    </div>
  );
}