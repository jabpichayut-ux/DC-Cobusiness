"use client";

import { useEffect, useState } from "react";
import type { DashboardStats } from "@/lib/types";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center text-xl mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-gray-500 text-sm mt-1">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const headers = { "x-admin-secret": ADMIN_SECRET };
        const [usersRes, promoRes, repairRes, goldRes] = await Promise.all([
          fetch("/api/admin/users", { headers }),
          fetch("/api/admin/promotions", { headers }),
          fetch("/api/liff/repair", { headers }),
          fetch("/api/gold-price"),
        ]);

        const [users, promos, repairs, gold] = await Promise.all([
          usersRes.json(),
          promoRes.json(),
          repairRes.json(),
          goldRes.json(),
        ]);

        const userList = users.data || [];
        const promoList = promos.data || [];
        const repairList = repairs.data || [];
        const goldPrice = gold.data;

        setStats({
          totalUsers: userList.length,
          tenants: userList.filter((u: { tags: string[] }) => u.tags.includes("tenant")).length,
          goldCustomers: userList.filter((u: { tags: string[] }) => u.tags.includes("gold_customer")).length,
          vipUsers: userList.filter((u: { tags: string[] }) => u.tags.includes("vip")).length,
          activePromotions: promoList.filter((p: { is_active: boolean }) => p.is_active).length,
          pendingRepairs: repairList.filter((r: { status: string }) => r.status === "pending").length,
          currentGoldBuyPrice: goldPrice?.buy_price ?? 0,
          currentGoldSellPrice: goldPrice?.sell_price ?? 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
        <p className="text-gray-500 text-sm mt-1">ภาพรวมระบบ DC Co-Business</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon="👥" label="สมาชิกทั้งหมด" value={stats.totalUsers} color="bg-blue-50" />
            <StatCard icon="🏠" label="ผู้เช่า" value={stats.tenants} color="bg-green-50" />
            <StatCard icon="💛" label="ลูกค้าทอง" value={stats.goldCustomers} color="bg-yellow-50" />
            <StatCard icon="⭐" label="VIP" value={stats.vipUsers} color="bg-purple-50" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="🎁" label="โปรโมชั่นที่ใช้งาน" value={stats.activePromotions} color="bg-pink-50" />
            <StatCard icon="🔧" label="รอดำเนินการซ่อม" value={stats.pendingRepairs} color="bg-orange-50" />
            <StatCard
              icon="📈"
              label="ราคารับซื้อทอง"
              value={`${Number(stats.currentGoldBuyPrice).toLocaleString()} ฿`}
              color="bg-yellow-50"
            />
            <StatCard
              icon="📉"
              label="ราคาขายทอง"
              value={`${Number(stats.currentGoldSellPrice).toLocaleString()} ฿`}
              color="bg-yellow-50"
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500">ไม่สามารถโหลดข้อมูลได้</p>
      )}

      <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-3">ลิงก์ด่วน</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "จัดการผู้ใช้", href: "/admin/users", icon: "👥", color: "bg-blue-50 text-blue-700" },
            { label: "โปรโมชั่น", href: "/admin/promotions", icon: "🎁", color: "bg-pink-50 text-pink-700" },
            { label: "ประกาศ", href: "/admin/announcements", icon: "📢", color: "bg-purple-50 text-purple-700" },
            { label: "อัปเดตราคาทอง", href: "/admin/gold-price", icon: "💛", color: "bg-yellow-50 text-yellow-700" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`${l.color} rounded-xl p-3 text-sm font-medium flex items-center gap-2`}
            >
              <span>{l.icon}</span>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
