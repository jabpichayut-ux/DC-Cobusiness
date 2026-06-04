"use client";

import { useEffect, useState } from "react";
import { LiffProvider, useLiff } from "@/components/liff/LiffProvider";
import { MemberCard } from "@/components/liff/MemberCard";
import { PromotionCard } from "@/components/liff/PromotionCard";
import type { User, Promotion } from "@/lib/types";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID_HOME || "";

function HomeContent() {
  const { profile, isLoading, error } = useLiff();
  const [user, setUser] = useState<User | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [tab, setTab] = useState<"card" | "promotions">("card");

  useEffect(() => {
    if (!profile) return;
    // Register/fetch user
    fetch("/api/liff/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        line_user_id: profile.userId,
        display_name: profile.displayName,
        picture_url: profile.pictureUrl,
      }),
    })
      .then((r) => r.json())
      .then((json) => json.data && setUser(json.data));

    // Fetch active promotions
    fetch("/api/liff/promotions")
      .then((r) => r.json())
      .then((json) => json.data && setPromotions(json.data));
  }, [profile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🏢</div>
          <p className="text-gray-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-4 pt-10 pb-6">
        <h1 className="text-white font-bold text-xl mb-1">DC Co-Business</h1>
        <p className="text-brand-100 text-sm">สวัสดี {profile?.displayName}!</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white">
        <button
          className={`flex-1 py-3 text-sm font-medium ${tab === "card" ? "text-brand-600 border-b-2 border-brand-600" : "text-gray-500"}`}
          onClick={() => setTab("card")}
        >
          บัตรสมาชิก
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${tab === "promotions" ? "text-brand-600 border-b-2 border-brand-600" : "text-gray-500"}`}
          onClick={() => setTab("promotions")}
        >
          โปรโมชั่น
        </button>
      </div>

      <div className="px-4 py-4">
        {tab === "card" && (
          <div className="space-y-4">
            {user ? (
              <MemberCard user={user} />
            ) : (
              <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white animate-pulse">
                <div className="h-6 bg-white/20 rounded w-40 mb-3" />
                <div className="h-4 bg-white/20 rounded w-24" />
              </div>
            )}

            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3">บริการของเรา</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "🏠", label: "ห้องพัก", color: "bg-green-50" },
                  { icon: "💛", label: "ร้านทอง", color: "bg-yellow-50" },
                  { icon: "🏢", label: "อสังหา", color: "bg-blue-50" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`${item.color} rounded-xl p-3 text-center`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className="text-xs text-gray-700 font-medium">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "promotions" && (
          <div className="space-y-3">
            {promotions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🎁</div>
                <p className="text-gray-500">ยังไม่มีโปรโมชั่นในขณะนี้</p>
              </div>
            ) : (
              promotions.map((p) => <PromotionCard key={p.id} promotion={p} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <HomeContent />
    </LiffProvider>
  );
}
