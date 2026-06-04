"use client";

import { LiffProvider, useLiff } from "@/components/liff/LiffProvider";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID_APARTMENT || "";

function ApartmentContent() {
  const { profile, isLoading, error } = useLiff();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-4xl animate-pulse">🏠</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const services = [
    {
      icon: "💳",
      title: "ชำระค่าเช่า",
      desc: "ชำระค่าเช่าและค่าส่วนกลางออนไลน์",
      color: "bg-green-500",
      href: `/liff/pay-rent`,
    },
    {
      icon: "🔧",
      title: "แจ้งซ่อม",
      desc: "แจ้งปัญหาห้องพัก ไฟฟ้า ประปา แอร์",
      color: "bg-orange-500",
      href: `/liff/repair`,
    },
    {
      icon: "📞",
      title: "ติดต่อเจ้าหน้าที่",
      desc: "โทร 081-234-5678 จ-ศ 9:00-18:00",
      color: "bg-blue-500",
      href: "tel:0812345678",
    },
    {
      icon: "📢",
      title: "ประกาศ",
      desc: "ข่าวสารและประกาศสำหรับผู้เช่า",
      color: "bg-purple-500",
      href: "#",
    },
    {
      icon: "🏠",
      title: "ข้อมูลห้องพัก",
      desc: "ดูรายละเอียดห้องและสัญญาเช่า",
      color: "bg-teal-500",
      href: "#",
    },
    {
      icon: "🗺️",
      title: "แผนที่",
      desc: "ดูแผนที่และสิ่งอำนวยความสะดวก",
      color: "bg-indigo-500",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 pt-10 pb-6">
        <div className="text-3xl mb-2">🏠</div>
        <h1 className="text-white font-bold text-xl mb-1">ห้องพัก/อพาร์ตเมนต์</h1>
        <p className="text-green-100 text-sm">สวัสดี {profile?.displayName}! บริการสำหรับผู้เช่า</p>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {services.map((service) => (
            <a
              key={service.title}
              href={service.href}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 block hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 ${service.color} rounded-xl flex items-center justify-center text-xl mb-3`}
              >
                {service.icon}
              </div>
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
      </div>
    </div>
  );
}

export default function ApartmentPage() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <ApartmentContent />
    </LiffProvider>
  );
}
