"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { LiffProvider, useLiff } from "@/components/liff/LiffProvider";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID_APARTMENT || "";

function RepairForm({ name }: { name: string }) {
  const [unit, setUnit] = useState("");
  const [issueType, setIssueType] = useState("other");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/liff/repair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line_user_id: name, apartment_unit: unit, issue_type: issueType, description: desc }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch { setStatus("error"); }
  }

  if (status === "done") return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">✅</div>
      <p className="font-bold text-green-700 text-lg">ส่งคำร้องเรียบร้อย</p>
      <p className="text-gray-500 text-sm mt-2">เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชั่วโมง</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">หมายเลขห้อง</label>
        <input required value={unit} onChange={e => setUnit(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="เช่น A101" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทปัญหา</label>
        <select value={issueType} onChange={e => setIssueType(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400">
          <option value="electrical">ไฟฟ้า</option>
          <option value="plumbing">ประปา</option>
          <option value="ac">แอร์</option>
          <option value="other">อื่นๆ</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
        <textarea required value={desc} onChange={e => setDesc(e.target.value)} rows={4} className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="อธิบายปัญหาที่พบ..." />
      </div>
      <button type="submit" disabled={status === "loading"} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl disabled:opacity-50">
        {status === "loading" ? "กำลังส่ง..." : "ส่งคำร้องแจ้งซ่อม"}
      </button>
      {status === "error" && <p className="text-red-500 text-sm text-center">เกิดข้อผิดพลาด กรุณาลองใหม่</p>}
    </form>
  );
}

function PayRentInfo() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-3">วิธีชำระค่าเช่า</h3>
        <div className="space-y-3">
          {[
            { icon: "🏦", title: "โอนเงินผ่านธนาคาร", desc: "ธนาคารกสิกร เลขที่บัญชี xxx-x-xxxxx-x ชื่อ DC Property" },
            { icon: "💳", title: "พร้อมเพย์", desc: "เบอร์โทร 081-234-5678 (ชำระได้ตลอด 24 ชม.)" },
            { icon: "💵", title: "ชำระเงินสด", desc: "ที่สำนักงาน จ-ศ 9:00-18:00 น." },
          ].map(m => (
            <div key={m.title} className="flex gap-3 items-start">
              <span className="text-2xl">{m.icon}</span>
              <div>
                <p className="font-medium text-gray-900 text-sm">{m.title}</p>
                <p className="text-gray-500 text-xs">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
        <h3 className="font-bold text-green-800 mb-2">กำหนดชำระ</h3>
        <p className="text-green-700 text-sm">ทุกวันที่ 1–5 ของเดือน หากเกินกำหนดมีค่าปรับ 1% ต่อวัน</p>
      </div>
    </div>
  );
}

function ApartmentContent() {
  const { profile, isLoading, error } = useLiff();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "home";

  if (isLoading) return <div className="min-h-screen bg-green-50 flex items-center justify-center"><div className="text-4xl animate-pulse">🏠</div></div>;
  if (error) return <div className="min-h-screen bg-green-50 flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

  const services = [
    { icon: "💳", title: "ชำระค่าเช่า", desc: "ชำระออนไลน์ได้ตลอด 24 ชม.", color: "bg-green-500", tab: "pay" },
    { icon: "🔧", title: "แจ้งซ่อม", desc: "แจ้งปัญหาห้องพัก ไฟฟ้า ประปา แอร์", color: "bg-orange-500", tab: "repair" },
    { icon: "📞", title: "ติดต่อเจ้าหน้าที่", desc: "โทร 081-234-5678 จ-ศ 9:00-18:00", color: "bg-blue-500", href: "tel:0812345678" },
    { icon: "📢", title: "ประกาศ", desc: "ข่าวสารและประกาศสำหรับผู้เช่า", color: "bg-purple-500" },
    { icon: "🏠", title: "ข้อมูลห้องพัก", desc: "ดูรายละเอียดห้องและสัญญาเช่า", color: "bg-teal-500" },
    { icon: "🗺️", title: "แผนที่", desc: "ดูแผนที่และสิ่งอำนวยความสะดวก", color: "bg-indigo-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 pt-10 pb-6">
        <div className="text-3xl mb-2">🏠</div>
        <h1 className="text-white font-bold text-xl mb-1">ห้องพัก/อพาร์ตเมนต์</h1>
        <p className="text-green-100 text-sm">สวัสดี {profile?.displayName || "คุณลูกค้า"}!</p>
      </div>
      <div className="px-4 py-4">
        {tab === "pay" && <PayRentInfo />}
        {tab === "repair" && <RepairForm name={profile?.userId || ""} />}
        {tab === "home" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => (
                <a key={service.title} href={service.href || (service.tab ? `?tab=${service.tab}` : "#")} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 block hover:shadow-md transition-shadow">
                  <div className={`w-10 h-10 ${service.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{service.icon}</div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{service.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{service.desc}</p>
                </a>
              ))}
            </div>
            <div className="mt-4 bg-green-50 rounded-2xl p-4 border border-green-100">
              <h3 className="font-bold text-green-800 mb-2">ข้อมูลสำคัญ</h3>
              <div className="space-y-2 text-sm text-green-700">
                <p>• กำหนดชำระค่าเช่า: ทุกวันที่ 1-5 ของเดือน</p>
                <p>• ค่าน้ำ-ไฟ: แจ้งพร้อมค่าเช่า</p>
                <p>• แจ้งซ่อมด่วน: 081-234-5678 ตลอด 24 ชม.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ApartmentPage() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <Suspense>
        <ApartmentContent />
      </Suspense>
    </LiffProvider>
  );
}
