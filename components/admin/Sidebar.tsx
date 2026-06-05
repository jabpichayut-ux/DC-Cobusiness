"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/admin", label: "แดชบอร์ด", icon: "📊" },
  { href: "/admin/users", label: "ผู้ใช้งาน", icon: "👥" },
  { href: "/admin/promotions", label: "โปรโมชั่น", icon: "🎁" },
  { href: "/admin/announcements", label: "ประกาศ", icon: "📢" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 bg-gray-900 min-h-screen flex flex-col">
      <div className="px-4 py-6 border-b border-gray-700">
        <h1 className="text-white font-bold text-lg">DC Co-Business</h1>
        <p className="text-gray-400 text-xs mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} className={clsx("flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors", pathname === item.href ? "bg-brand-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white")}>
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        <p className="text-gray-500 text-xs">v0.1.0</p>
      </div>
    </aside>
  );
}
