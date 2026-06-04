"use client";

import { useState } from "react";
import type { CreatePromotionInput, BusinessType } from "@/lib/types";

const BUSINESS_OPTIONS: { value: BusinessType; label: string }[] = [
  { value: "all", label: "ทุกธุรกิจ" },
  { value: "apartment", label: "ห้องพัก" },
  { value: "gold", label: "ร้านทอง" },
  { value: "property", label: "อสังหาริมทรัพย์" },
];

interface PromotionFormProps {
  onSubmit: (data: CreatePromotionInput) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CreatePromotionInput>;
}

export function PromotionForm({ onSubmit, onCancel, initialData }: PromotionFormProps) {
  const [form, setForm] = useState<CreatePromotionInput>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    image_url: initialData?.image_url || "",
    business_type: initialData?.business_type || "all",
    is_active: initialData?.is_active ?? true,
    starts_at: initialData?.starts_at || "",
    ends_at: initialData?.ends_at || "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อโปรโมชั่น <span className="text-red-500">*</span>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
        <textarea
          value={form.description || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">URL รูปภาพ</label>
        <input
          type="url"
          value={form.image_url || ""}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ประเภทธุรกิจ <span className="text-red-500">*</span>
        </label>
        <select
          value={form.business_type}
          onChange={(e) => setForm({ ...form, business_type: e.target.value as BusinessType })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {BUSINESS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">วันเริ่ม</label>
          <input
            type="date"
            value={form.starts_at || ""}
            onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">วันสิ้นสุด</label>
          <input
            type="date"
            value={form.ends_at || ""}
            onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          className="rounded"
        />
        <label htmlFor="is_active" className="text-sm text-gray-700">
          เปิดใช้งาน
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 bg-brand-600 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {submitting ? "กำลังบันทึก..." : "บันทึก"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium"
        >
          ยกเลิก
        </button>
      </div>
    </form>
  );
}
