"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LiffProvider, useLiff } from "@/components/liff/LiffProvider";
import { PromotionCard } from "@/components/liff/PromotionCard";
import type { Promotion } from "@/lib/types";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID_FURNITURE || "";

function FurniturePromos() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  useEffect(() => {
    fetch("/api/liff/promotions?type=furniture").then(r => r.json()).then(d => setPromos(d.data || []));
  }, []);
  return (
    <div className="space-y-3">
      {promos.length === 0 && <p className="text-center text-gray-400 py-8">ยังไม่มีโปรโมชั่นในขณะนี้</p>}
      {promos.map(p => <PromotionCard key={p.id} promotion={p} />)}
    </div>
  );
}

function CatalogInfo() {
  const categories = [
    { icon: "🛏️", name: "ห้องนอน", items: "เตียง, ตู้เสื้อผ้า, โต๊ะเครื่องแป้ง" },
    { icon: "🛋️", name: "ห้องนั่งเล่น", items: "โซฟา, โต๊ะกลาง, ชั้นวางทีวี" },
    { icon: "🍽️", name: "ห้องครัว", items: "ตู้ครัว, โต๊ะอาหาร, เก้าอี้" },
    { icon: "💼", name: "ออฟฟิศ", items: "โต๊ะทำงาน, เก้าอี้ทำงาน, ตู้เอกสาร" },
  ];
  return (
    <div className="space-y-3">
      {categories.map(c => (
        <div key={c.name} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{c.icon}</span>
            <div>
              <p className="font-bold text-gray-900">{c.name}</p>
              <p className="text-gray-500 text-sm">{c.items}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100 text-center">
        <p className="text-teal-700 font-medium text-sm">สั่งทำพิเศษตามแบบที่ต้องการ</p>
        <p className="text-teal-500 text-xs mt-1">ติดต่อได้ที่ 081-234-5681</p>
      </div>
    </div>
  );
}

function FurnitureContent() {
  const { profile, isLoading, error } = useLiff();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-teal-50 flex items-center justify-center">
        <div className="text-4xl animate-pulse">🪑</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-teal-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const services = [
    { icon: "🛏️", title: "เฟอร์นิเจอร์ห้องนอน", desc: "เตียง ตู้ โต๊ะ หลากหลายสไตล์", color: "bg-teal-500" },
    { icon: "🛋️", title: "เฟอร์นิเจอร์ห้องนั่งเล่น", desc: "โซฟา ชั้นวาง โต๊ะกลาง", color: "bg-cyan-500" },
    { icon: "💼", title: "เฟอร์นิเจอร์ออฟฟิศ", desc: "โต๊ะทำงาน เก้าอี้ ตู้เอกสาร", color: "bg-sky-500" },
    { icon: "🍽️", title: "เฟอร์นิเจอร์ครัว", desc: "ตู้ครัว โต๊ะอาหาร เก้าอี้", color: "bg-blue-500" },
    { icon: "🔨", title: "สั่งทำพิเศษ", desc: "ออกแบบตามความต้องการ", color: "bg-indigo-500" },
    { icon: "🚚", title: "บริการติดตั้ง", desc: "จัดส่งและติดตั้งถึงบ้าน", color: "bg-violet-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-4 pt-10 pb-6">
        <div className="text-3xl mb-2">🪑</div>
        <h1 className="text-white font-bold text-xl mb-1">เฟอร์นิเจอร์ DC Furniture</h1>
        <p className="text-teal-100 text-sm">สวัสดี {profile?.displayName || "คุณลูกค้า"}!</p>
      </div>

      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        {[["home", "สินค้า"], ["promo", "โปรโมชั่น"], ["catalog", "แคตตาล็อก"]].map(([t, label]) => (
          <a key={t} href={`?tab=${t}`}
            className={`flex-1 text-center py-3 text-sm font-medium ${tab === t ? "border-b-2 border-teal-600 text-teal-700" : "text-gray-500"}`}>
            {label}
          </a>
        ))}
      </div>

      <div className="px-4 py-4">
        {tab === "promo" && <FurniturePromos />}
        {tab === "catalog" && <CatalogInfo />}
        {tab === "home" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {services.map((s) => (
                <div key={s.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>
                    {s.icon}
                  </div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{s.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-teal-50 rounded-2xl p-4 border border-teal-100">
              <h3 className="font-bold text-teal-800 mb-2">ติดต่อสอบถาม</h3>
              <div className="space-y-2 text-sm text-teal-700">
                <p>📞 โทร: 081-234-5681</p>
                <p>📧 อีเมล: furniture@dc-cobusiness.com</p>
                <p>🕐 จ-ศ 9:00-18:00 น., เสาร์ 9:00-17:00 น.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function FurniturePage() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <Suspense>
        <FurnitureContent />
      </Suspense>
    </LiffProvider>
  );
}
