"use client";

import { useEffect, useState } from "react";
import { PromotionForm } from "@/components/admin/PromotionForm";
import type { Promotion, CreatePromotionInput } from "@/lib/types";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

const BUSINESS_LABELS: Record<string, string> = {
  apartment: "ห้องพัก",
  gold: "ร้านทอง",
  warehouse: "โกดัง",
  furniture: "เฟอร์นิเจอร์",
  all: "ทุกธุรกิจ",
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function loadPromotions() {
    setIsLoading(true);
    const res = await fetch("/api/admin/promotions", { headers: { "x-admin-secret": ADMIN_SECRET } });
    const json = await res.json();
    if (json.data) setPromotions(json.data);
    setIsLoading(false);
  }

  useEffect(() => { loadPromotions(); }, []);

  async function handleCreate(data: CreatePromotionInput) {
    const res = await fetch("/api/admin/promotions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (json.success) { setPromotions((prev) => [json.data, ...prev]); setShowForm(false); }
  }

  async function toggleActive(promotion: Promotion) {
    const res = await fetch("/api/admin/promotions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-secret": ADMIN_SECRET },
      body: JSON.stringify({ id: promotion.id, is_active: !promotion.is_active }),
    });
    const json = await res.json();
    if (json.success) setPromotions((prev) => prev.map((p) => (p.id === promotion.id ? json.data : p)));
  }

  async function handleDelete(id: string) {
    if (!confirm("ยืนยันลบโปรโมชั่นนี้?")) return;
    const res = await fetch(`/api/admin/promotions?id=${id}`, { method: "DELETE", headers: { "x-admin-secret": ADMIN_SECRET } });
    const json = await res.json();
    if (json.success) setPromotions((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">โปรโมชั่น</h1>
          <p className="text-gray-500 text-sm mt-1">ทั้งหมด {promotions.length} รายการ</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium">+ เพิ่มโปรโมชั่น</button>
      </div>
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">เพิ่มโปรโมชั่นใหม่</h2>
          <PromotionForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-sm">
        {isLoading ? (
          <div className="p-4 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">ยังไม่มีโปรโมชั่น</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {promotions.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 text-sm">{p.title}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{BUSINESS_LABELS[p.business_type]}</span>
                    {p.is_active ? <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">เปิดใช้</span> : <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">ปิดใช้</span>}
                  </div>
                  {p.description && <p className="text-gray-500 text-xs line-clamp-1">{p.description}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(p)} className="text-xs text-brand-600 hover:underline">{p.is_active ? "ปิด" : "เปิด"}</button>
                  <button onClick={() => handleDelete(p.id)} className="text-xs text-red-500 hover:underline">ลบ</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
