"use client";

import Image from "next/image";
import type { LineProfile } from "@/lib/types";

export function MemberCard({ profile }: { profile: LineProfile }) {
  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        {profile.pictureUrl && (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/30">
            <Image src={profile.pictureUrl} alt={profile.displayName} fill className="object-cover" />
          </div>
        )}
        <div>
          <p className="font-bold text-xl">{profile.displayName}</p>
          <p className="text-brand-200 text-sm">สมาชิก DC Co-Business</p>
        </div>
      </div>
      <div className="bg-white/10 rounded-xl p-3">
        <p className="text-brand-100 text-xs">LINE User ID</p>
        <p className="text-white text-xs font-mono mt-1 truncate">{profile.userId}</p>
      </div>
    </div>
  );
}