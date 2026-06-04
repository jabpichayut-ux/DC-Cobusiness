"use client";

import { useEffect, useState } from "react";
import { LiffProvider, useLiff } from "@/components/liff/LiffProvider";
import { PromotionCard } from "@/components/liff/PromotionCard";
import type { Promotion, BusinessType } from "@/lib/types";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID_PROMOTIONS || "";

const TABS: { key: BusinessType | "all"; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "apartment", label: "🏠 ห้องพัก" },
  { key: "gold", label: "💛 ทอง" },
  { key: "property", label: "🏢 อสังหา" },
];

function PromotionsContent() {
  const { profile, isLoading } = useLiff();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activeTab, setActiveTab] = useState<BusinessType | "all">("all");
  const [promoLoading, setPromoLoading] = useState(true);

  useEffect(() => {
    const type = activeTab === "all" ? "" : `?type=${activeTab}`;
    setPromoLoading(true);
    fetch(`/api/liff/promotions${type}`)
      .then((r) => r.json())
      .then((json) => json.data && setPromotions(json.data))
      .finally(() => setPromoLoading(false));
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-4xl animate-pulse">🎁</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-brand-600 to-purple-600 px-4 pt-10 pb-6">
        <div className="text-3xl mb-2">🎁</div>
        <h1 className="text-white font-bold text-xl mb-1">โปรโมชั่นและสิทธิพิเศษ</h1>
        <p className="text-blue-100 text-sm">สำหรับสมาชิก DC Co-Business</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white border-b overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium whitespace-nowrap ${
              activeTab === t.key
                ? "text-brand-600 border-b-2 border-brand-600"
                : "text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4">
        {promoLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎁</div>
            <p className="text-gray-500 text-lg font-medium">ยังไม่มีโปรโมชั่น</p>
            <p className="text-gray-400 text-sm mt-1">ติดตามสิทธิพิเศษได้เร็วๆ นี้!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {promotions.map((p) => (
              <PromotionCard key={p.id} promotion={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PromotionsPage() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <PromotionsContent />
    </LiffProvider>
  );
}
