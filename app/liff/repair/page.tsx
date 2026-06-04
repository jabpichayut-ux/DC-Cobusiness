"use client";

import { useState } from "react";
import { LiffProvider, useLiff } from "@/components/liff/LiffProvider";
import type { IssueType } from "@/lib/types";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID_REPAIR || "";

const ISSUE_TYPES: { value: IssueType; label: string; icon: string }[] = [
  { value: "electrical", label: "ไฟฟ้า", icon: "⚡" },
  { value: "plumbing", label: "ประปา", icon: "🔧" },
  { value: "ac", label: "แอร์", icon: "❄️" },
  { value: "other", label: "อื่นๆ", icon: "🛠️" },
];

function RepairContent() {
  const { profile, isLoading, error } = useLiff();
  const [form, setForm] = useState({
    apartment_unit: "",
    issue_type: "" as IssueType | "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-4xl animate-pulse">🔧</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-green-800 mb-2">ส่งคำร้องสำเร็จ!</h2>
          <p className="text-green-600 text-sm">เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมง</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ apartment_unit: "", issue_type: "", description: "" });
            }}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-xl text-sm font-medium"
          >
            แจ้งซ่อมอีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.apartment_unit || !form.issue_type || !form.description) {
      setSubmitError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (!profile) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/liff/repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          line_user_id: profile.userId,
          ...form,
        }),
      });

      if (!res.ok) throw new Error("ส่งคำร้องไม่สำเร็จ");
      setSubmitted(true);
    } catch {
      setSubmitError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 pt-10 pb-6">
        <div className="text-3xl mb-2">🔧</div>
        <h1 className="text-white font-bold text-xl mb-1">แจ้งซ่อม</h1>
        <p className="text-orange-100 text-sm">แจ้งปัญหาและความต้องการซ่อมแซม</p>
      </div>

      <div className="px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เลขห้อง <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.apartment_unit}
              onChange={(e) => setForm({ ...form, apartment_unit: e.target.value })}
              placeholder="เช่น 101, 202B"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ประเภทปัญหา <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ISSUE_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setForm({ ...form, issue_type: t.value })}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${
                    form.issue_type === t.value
                      ? "border-orange-400 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียดปัญหา <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="อธิบายปัญหาให้ละเอียด เพื่อให้ช่างเตรียมอุปกรณ์ได้ถูกต้อง..."
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          {submitError && (
            <p className="text-red-500 text-sm text-center">{submitError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-base disabled:opacity-60"
          >
            {submitting ? "กำลังส่ง..." : "ส่งคำร้องแจ้งซ่อม"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function RepairPage() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <RepairContent />
    </LiffProvider>
  );
}
