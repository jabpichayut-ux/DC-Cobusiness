"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LiffProvider, useLiff } from "@/components/liff/LiffProvider";
import { PromotionCard } from "@/components/liff/PromotionCard";
import type { Promotion } from "@/lib/types";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID_WAREHOUSE || "";

function WarehousePromos() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  useEffect(() => { fetch("/api/liff/promotions?type=warehouse").then(r => r.json()).then(d => setPromos(d.data || [])); }, []);
  return (
    <div className="space-y-3">
      {promos.length === 0 && <p className="text-center text-gray-400 py-8">ยังไม่มีโปรโมชั่นในขณะนี้</p>}
      {promos.map(p => <PromotionCard key={p.id} promotion={p} />)}
    </div>
  );
}

function SpacesInfo() {
  const spaces = [
    { size: "50 ตร.ม.", price: "3,500", available: true },
    { size: "100 ตร.ม.", price: "6,500", available: true },
    { size: "200 ตร.ม.", price: "12,000", available: false },
    { size: "500 ตร.ม.", price: "28,000", available: true },
  ];
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">ราคา/เดือน (ไม่รวมค่าสาธารณูปโภค)</p>
      {spaces.map(s => (
        <div key={s.size} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-900">{s.size}</p>
            <p className="text-orange-600 font-medium text-sm">฿{s.price}/เดือน</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>{s.available ? "ว่าง" : "ไม่ว่าง"}</span>
        </div>
      ))}
    </div>
  );
}

function WarehouseContent() {
  const { profile, isLoading, error } = useLiff();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  if (isLoading) return <div className="min-h-screen bg-orange-50 flex items-center justify-center"><div className="text-4xl animate-pulse">🏭</div></div>;
  if (error) return <div className="min-h-screen bg-orange-50 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

  const services = [
    { icon: "📐", title: "ขนาดพื้นที่", desc: "ตั้งแต่ 50–500 ตร.ม.", color: "bg-orange-500" },
    { icon: "💰", title: "ราคาเช่า/เดือน", desc: "เริ่มต้น 3,500 บาท", color: "bg-amber-500" },
    { icon: "📄", title: "สัญญาเช่า", desc: "สัญญาขั้นต่ำ 6 เดือน", color: "bg-yellow-500" },
    { icon: "⚡", title: "สิ่งอำนวยความสะดวก", desc: "ไฟฟ้า 3 เฟส, โหลดดอก, รปภ.", color: "bg-red-500" },
    { icon: "📍", title: "ที่ตั้ง", desc: "ใกล้ถนนใหญ่ สะดวกขนส่ง", color: "bg-rose-500" },
    { icon: "🕐", title: "เวลาทำการ", desc: "จ-ศ 8:00-17:00 น.", color: "bg-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-orange-700 to-orange-800 px-4 pt-10 pb-6">
        <div className="text-3xl mb-2">🏭</div>
        <h1 className="text-white font-bold text-xl mb-1">โกดัง DC Warehouse</h1>
        <p className="text-orange-100 text-sm">สวัสดี {profile?.displayName || "คุณลูกค้า"}!</p>
      </div>
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        {[["home", "บริการ"], ["spaces", "พื้นที่ว่าง"], ["promo", "โปรโมชั่น"]].map(([t, label]) => (
          <a key={t} href={`?tab=${t}`} className={`flex-1 text-center py-3 text-sm font-medium ${tab === t ? "border-b-2 border-orange-600 text-orange-700" : "text-gray-500"}`}>{label}</a>
        ))}
      </div>
      <div className="px-4 py-4">
        {tab === "promo" && <WarehousePromos />}
        {tab === "spaces" && <SpacesInfo />}
        {tab === "home" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {services.map((s) => (
                <div key={s.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{s.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-orange-50 rounded-2xl p-4 border border-orange-100">
              <h3 className="font-bold text-orange-800 mb-2">ติดต่อสอบถาม</h3>
              <div className="space-y-2 text-sm text-orange-700">
                <p>📞 โทร: 081-234-5680</p>
                <p>📧 อีเมล: warehouse@dc-cobusiness.com</p>
                <p>🕐 จ-ศ 8:00-17:00 น.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function WarehousePage() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <Suspense><WarehouseContent /></Suspense>
    </LiffProvider>
  );
}
