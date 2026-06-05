"use client";

import { useEffect, useState } from "react";
import type { GoldPrice } from "@/lib/types";

export function GoldPriceDisplay() {
  const [price, setPrice] = useState<GoldPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/gold-price").then(r => r.json()).then(json => {
      if (json.data) setPrice(json.data); else setError("ไม่พบข้อมูลราคาทอง");
    }).catch(() => setError("ไม่สามารถโหลดราคาทองได้")).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="bg-yellow-50 rounded-2xl p-6 animate-pulse"><div className="h-6 bg-yellow-200 rounded w-32 mb-4" /><div className="grid grid-cols-2 gap-4"><div className="h-16 bg-yellow-100 rounded-xl" /><div className="h-16 bg-yellow-100 rounded-xl" /></div></div>;
  if (error || !price) return <div className="bg-yellow-50 rounded-2xl p-6 text-center"><p className="text-yellow-700">ไม่สามารถโหลดราคาทองได้</p></div>;

  return (
    <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div><p className="text-yellow-100 text-sm">ราคาทอง</p><p className="font-bold text-xl">{price.gold_type}</p></div>
        <span className="text-3xl">💛</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/20 rounded-xl p-4 text-center"><p className="text-yellow-100 text-xs mb-1">รับซื้อ</p><p className="font-bold text-2xl">{Number(price.buy_price).toLocaleString()}</p><p className="text-yellow-100 text-xs">บาท/บาท</p></div>
        <div className="bg-white/20 rounded-xl p-4 text-center"><p className="text-yellow-100 text-xs mb-1">ราคาขาย</p><p className="font-bold text-2xl">{Number(price.sell_price).toLocaleString()}</p><p className="text-yellow-100 text-xs">บาท/บาท</p></div>
      </div>
      <p className="text-yellow-100 text-xs mt-3 text-center">อัปเดต: {new Date(price.updated_at).toLocaleString("th-TH", { hour: "2-digit", minute: "2-digit", day: "numeric", month: "short" })}</p>
    </div>
  );
}