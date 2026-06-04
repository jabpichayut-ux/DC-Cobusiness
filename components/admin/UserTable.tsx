"use client";

import { useState } from "react";
import type { User, UserTag } from "@/lib/types";

const TAG_LABELS: Record<UserTag, string> = {
  tenant: "ผู้เช่า",
  gold_customer: "ลูกค้าทอง",
  vip: "VIP",
  family_customer: "ครอบครัว",
};

const TAG_COLORS: Record<UserTag, string> = {
  tenant: "bg-green-100 text-green-700",
  gold_customer: "bg-yellow-100 text-yellow-700",
  vip: "bg-purple-100 text-purple-700",
  family_customer: "bg-blue-100 text-blue-700",
};

const ALL_TAGS: UserTag[] = ["tenant", "gold_customer", "vip", "family_customer"];

interface UserTableProps {
  users: User[];
  onUpdate: (id: string, tags: UserTag[], apartment_unit: string) => Promise<void>;
}

export function UserTable({ users, onUpdate }: UserTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTags, setEditTags] = useState<UserTag[]>([]);
  const [editUnit, setEditUnit] = useState("");
  const [saving, setSaving] = useState(false);

  function startEdit(user: User) {
    setEditingId(user.id);
    setEditTags(user.tags);
    setEditUnit(user.apartment_unit || "");
  }

  async function saveEdit(id: string) {
    setSaving(true);
    await onUpdate(id, editTags, editUnit);
    setSaving(false);
    setEditingId(null);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="pb-3 font-medium text-gray-600">ชื่อ</th>
            <th className="pb-3 font-medium text-gray-600">แท็ก</th>
            <th className="pb-3 font-medium text-gray-600">ห้อง</th>
            <th className="pb-3 font-medium text-gray-600">เข้าร่วม</th>
            <th className="pb-3 font-medium text-gray-600">จัดการ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="py-3 pr-4">
                <div className="font-medium text-gray-900">{user.display_name || "ไม่ระบุ"}</div>
                <div className="text-xs text-gray-400 font-mono">{user.line_user_id.slice(0, 12)}...</div>
              </td>
              <td className="py-3 pr-4">
                {editingId === user.id ? (
                  <div className="flex flex-wrap gap-1">
                    {ALL_TAGS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() =>
                          setEditTags((prev) =>
                            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                          )
                        }
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          editTags.includes(tag)
                            ? TAG_COLORS[tag] + " border-transparent"
                            : "border-gray-200 text-gray-400"
                        }`}
                      >
                        {TAG_LABELS[tag]}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {user.tags.map((tag) => (
                      <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[tag]}`}>
                        {TAG_LABELS[tag]}
                      </span>
                    ))}
                    {user.tags.length === 0 && <span className="text-gray-400 text-xs">-</span>}
                  </div>
                )}
              </td>
              <td className="py-3 pr-4">
                {editingId === user.id ? (
                  <input
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    placeholder="เลขห้อง"
                    className="border rounded px-2 py-1 text-xs w-20"
                  />
                ) : (
                  <span className="text-gray-700">{user.apartment_unit || "-"}</span>
                )}
              </td>
              <td className="py-3 pr-4 text-gray-500 text-xs">
                {new Date(user.created_at).toLocaleDateString("th-TH")}
              </td>
              <td className="py-3">
                {editingId === user.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(user.id)}
                      disabled={saving}
                      className="text-xs bg-brand-600 text-white px-3 py-1 rounded-lg disabled:opacity-50"
                    >
                      บันทึก
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-xs text-gray-500 px-3 py-1 rounded-lg"
                    >
                      ยกเลิก
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startEdit(user)}
                    className="text-xs text-brand-600 hover:underline"
                  >
                    แก้ไข
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
