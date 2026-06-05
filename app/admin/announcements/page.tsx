"use client";

import { useEffect, useState } from "react";
import type { Announcement, CreateAnnouncementInput, BusinessType } from "@/lib/types";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

const BUSINESS_OPTIONS: { value: BusinessType; label: string }[] = [
  { value: "all", label: "ทุกธุรกิจ" },
  { value: "apartment", label: "ห้องพัก" },
  { value: "gold", label: "ร้านทอง" },
  { value: "warehouse", label: "โกดัง" },
  { value: "furniture", label: "เฟอร์นิเจอร์" },
];

const BUSINESS_LABELS: Record<string, string> = {
  apartment: "ห้องพัก",
  gold: "ร้านทอง",
  warehouse: "โกดัง",
  furniture: "เฟอร์นิเจอร์",
  all: "ทุกธุรกิจ",
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateAnnouncementInput>({
    title: "",
    content: "",
    business_type: "all",
    is_active: true,
  });
  const [submitting, setSubmitting] = useState(false);

  async function loadAnnouncements() {
    setIsLoading(true);
    const res = await fetch("/api/admin/announcements", {
      headers: { "x-admin-secret": ADMIN_SECRET },
    });
    const json = await res.json();
    if (json.data) setAnnouncements(json.data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": ADMIN_SECRET,
      },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (json.success) {
      setAnnouncements((prev) => [json.data, ...prev]);
      setShowForm(false);
      setForm({ title: "", content: "", business_type: "all", is_active: true });
    }
    setSubmitting(false);
  }

  async function toggleActive(ann: Announcement) {
    const res = await fetch("/api/admin/announcements", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": ADMIN_SECRET,
      },
      body: JSON.stringify({ id: ann.id, is_active: !ann.is_active }),
    });
    const json = await res.json();
    if (json.success) {
      setAnnouncements((prev) => prev.map((a) => (a.id === ann.id ? json.data : a)));
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("ยืนยันลบประกาศนี้?")) return;
    const res = await fetch(`/api/admin/announcements?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": ADMIN_SECRET },
    });
    const json = await res.json();
    if (json.success) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ประกาศ</h1>
          <p className="text-gray-500 text-sm mt-1">ทั้งหมด {announcements.length} รายการ</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
        >
          + เพิ่มประกาศ
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">เพิ่มประกาศใหม่</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                หัวข้อ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เนื้อหา <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทธุรกิจ</label>
              <select
                value={form.business_type}
                onChange={(e) => setForm({ ...form, business_type: e.target.value as BusinessType })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {BUSINESS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {submitting ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 text-gray-400">ยังไม่มีประกาศ</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {announcements.map((a) => (
              <div key={a.id} className="flex items-start gap-4 p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 text-sm">{a.title}</p>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {BUSINESS_LABELS[a.business_type]}
                    </span>
                    {a.is_active ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">เปิดใช้</span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">ปิดใช้</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs line-clamp-2">{a.content}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(a)}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    {a.is_active ? "ปิด" : "เปิด"}
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
