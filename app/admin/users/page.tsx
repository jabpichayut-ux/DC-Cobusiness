"use client";

import { useEffect, useState } from "react";
import { UserTable } from "@/components/admin/UserTable";
import type { User, UserTag } from "@/lib/types";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function loadUsers() {
    setIsLoading(true);
    const res = await fetch("/api/admin/users", {
      headers: { "x-admin-secret": ADMIN_SECRET },
    });
    const json = await res.json();
    if (json.data) setUsers(json.data);
    setIsLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleUpdate(id: string, tags: UserTag[], apartment_unit: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": ADMIN_SECRET,
      },
      body: JSON.stringify({ id, tags, apartment_unit }),
    });
    const json = await res.json();
    if (json.success) {
      setUsers((prev) => prev.map((u) => (u.id === id ? json.data : u)));
    }
  }

  const filtered = users.filter(
    (u) =>
      !search ||
      u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.line_user_id.includes(search) ||
      u.apartment_unit?.includes(search)
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ผู้ใช้งาน</h1>
          <p className="text-gray-500 text-sm mt-1">สมาชิกทั้งหมด {users.length} คน</p>
        </div>
        <button
          onClick={loadUsers}
          className="bg-brand-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
        >
          รีเฟรช
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาชื่อ, LINE ID, เลขห้อง..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">ไม่พบผู้ใช้งาน</div>
        ) : (
          <UserTable users={filtered} onUpdate={handleUpdate} />
        )}
      </div>
    </div>
  );
}
