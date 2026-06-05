"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LiffProvider, useLiff } from "@/components/liff/LiffProvider";
import { GoldPriceDisplay } from "@/components/liff/GoldPriceDisplay";
import { PromotionCard } from "@/components/liff/PromotionCard";
import type { Promotion } from "@/lib/types";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID_GOLD || "";

function GoldPromos() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  useEffect(() => { fetch("/api/liff/promotions?type=gold").then(r => r.json()).then(d => setPromos(d.data || [])); }, []);
  return (
    <div className="space-y-3">
      {promos.length === 0 && <p className="text-center text-gray-400 py-8">ยังไม่มีโปรโมชั่นในขณะนี้</p>}
      {promos.map(p => <PromotionCard key={p.id} promotion={p} />)}
    </div>
  );
}

function GoldContent() {
  const { profile, isLoading, error } = useLiff();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  if (isLoading) return <div className="min-h-screen bg-yellow-50 flex items-center justify-center"><div className="text-4xl animate-pulse">💛</div></div>;
  if (error) return <div className="min-h-screen bg-yellow-50 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

  const services = [
    { icon: "📍", title: "สาขา", desc: "ดูที่ตั้งสาขาร้านทอง" },
    { icon: "📅", title: "นัดหมาย", desc: "นัดหมายล่วงหน้า" },
    { icon: "📞", title: "ติดต่อ", desc: "081-234-5679" },
    { icon: "ℹ️", title: "ข้อมูลการซื้อขาย", desc: "เงื่อนไขและรายละเอียด" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 pt-10 pb-6">
        <div className="text-3xl mb-2">💛</div>
        <h1 className="text-white font-bold text-xl mb-1">ร้านทอง DC Gold</h1>
        <p className="text-yellow-100 text-sm">สวัสดี {profile?.displayName || "คุณลูกค้า"}!</p>
      </div>
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        {[["home", "ราคาทอง"], ["promo", "โปรโมชั่น"]].map(([t, label]) => (
          <a key={t} href={`?tab=${t}`} className={`flex-1 text-center py-3 text-sm font-medium ${tab === t ? "border-b-2 border-yellow-500 text-yellow-600" : "text-gray-500"}`}>{label}</a>
        ))}
      </div>
      <div className="px-4 py-4 space-y-4">
        {tab === "promo" && <GoldPromos />}
        {tab === "home" && (
          <>
            <GoldPriceDisplay />
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">บริการร้านทอง</h3>
              <div className="grid grid-cols-2 gap-3">
                {services.map((s) => (
                  <div key={s.title} className="bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                    <span className="text-2xl">{s.icon}</span>
                    <p className="font-medium text-gray-900 text-sm mt-2">{s.title}</p>
                    <p className="text-gray-500 text-xs">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
              <h3 className="font-bold text-yellow-800 mb-2">เวลาทำการ</h3>
              <div className="space-y-1 text-sm text-yellow-700">
                <p>จันทร์ - เสาร์: 09:00 - 18:00 น.</p>
                <p>อาทิตย์: 10:00 - 16:00 น.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function GoldPage() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <Suspense><GoldContent /></Suspense>
    </LiffProvider>
  );
}
