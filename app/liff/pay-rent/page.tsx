"use client";

import { LiffProvider, useLiff } from "@/components/liff/LiffProvider";

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID_PAY_RENT || "";

function PayRentContent() {
  const { profile, isLoading, error } = useLiff();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-4xl animate-pulse">💳</div>
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

  const paymentMethods = [
    {
      icon: "🏦",
      title: "โอนธนาคาร",
      detail: "กสิกรไทย 123-4-56789-0\nชื่อบัญชี: DC Co-Business",
    },
    {
      icon: "📱",
      title: "พร้อมเพย์",
      detail: "หมายเลขพร้อมเพย์: 0812345678",
    },
    {
      icon: "💵",
      title: "เงินสด",
      detail: "ชำระที่สำนักงาน อาคาร A ชั้น 1\nจ-ศ 9:00-18:00 น.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 pt-10 pb-6">
        <div className="text-3xl mb-2">💳</div>
        <h1 className="text-white font-bold text-xl mb-1">ชำระค่าเช่า</h1>
        <p className="text-green-100 text-sm">สวัสดี {profile?.displayName}!</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-green-800 font-medium text-sm">
            📅 กำหนดชำระ: วันที่ 1-5 ของทุกเดือน
          </p>
          <p className="text-green-600 text-xs mt-1">
            หากชำระเกินกำหนด จะมีค่าปรับ 1% ต่อวัน
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-gray-900">ช่องทางการชำระ</h3>
          {paymentMethods.map((m) => (
            <div key={m.title} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{m.icon}</span>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{m.title}</p>
                  <p className="text-gray-600 text-xs mt-1 whitespace-pre-line">{m.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-3">หลังชำระเงิน</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            กรุณาส่งหลักฐานการโอนเงิน (สลิป) มาที่ LINE นี้ พร้อมระบุ:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            <li>• เลขห้อง</li>
            <li>• เดือนที่ชำระ</li>
            <li>• จำนวนเงิน</li>
          </ul>
        </div>

        <a
          href="tel:0812345678"
          className="block bg-green-600 text-white text-center py-4 rounded-2xl font-bold"
        >
          📞 ติดต่อสอบถาม
        </a>
      </div>
    </div>
  );
}

export default function PayRentPage() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <PayRentContent />
    </LiffProvider>
  );
}
