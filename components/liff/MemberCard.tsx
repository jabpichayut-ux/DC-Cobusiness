"use client";

import Image from "next/image";
import type { User } from "@/lib/types";

const TAG_LABELS: Record<string, string> = {
  tenant: "ผู้เช่า 🏠",
  gold_customer: "ลูกค้าทอง 💛",
  vip: "VIP ⭐",
  family_customer: "ครอบครัว 💚",
};

const TAG_COLORS: Record<string, string> = {
  tenant: "bg-green-100 text-green-800",
  gold_customer: "bg-yellow-100 text-yellow-800",
  vip: "bg-purple-100 text-purple-800",
  family_customer: "bg-blue-100 text-blue-800",
};

interface MemberCardProps {
  user: User;
}

export function MemberCard({ user }: MemberCardProps) {
  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center gap-4 mb-4">
        {user.picture_url ? (
          <Image
            src={user.picture_url}
            alt={user.display_name || "Member"}
            width={64}
            height={64}
            className="rounded-full border-2 border-white/50"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
            👤
          </div>
        )}
        <div>
          <p className="text-white/70 text-sm">สมาชิก DC Co-Business</p>
          <p className="font-bold text-xl">{user.display_name || "ไม่ระบุชื่อ"}</p>
          {user.apartment_unit && (
            <p className="text-white/80 text-sm">ห้อง {user.apartment_unit}</p>
          )}
        </div>
      </div>

      <div className="bg-white/10 rounded-xl p-3">
        <p className="text-white/70 text-xs mb-2">ประเภทสมาชิก</p>
        <div className="flex flex-wrap gap-2">
          {user.tags.length > 0 ? (
            user.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white/20 text-white text-xs px-3 py-1 rounded-full"
              >
                {TAG_LABELS[tag] || tag}
              </span>
            ))
          ) : (
            <span className="text-white/60 text-sm">สมาชิกทั่วไป</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-white/60 text-xs">สมาชิกตั้งแต่</p>
          <p className="text-white text-sm font-medium">
            {new Date(user.created_at).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-xs">รหัสสมาชิก</p>
          <p className="text-white text-xs font-mono">{user.id.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}

export function TagBadge({ tag }: { tag: string }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${TAG_COLORS[tag] || "bg-gray-100 text-gray-800"}`}>
      {TAG_LABELS[tag] || tag}
    </span>
  );
}
