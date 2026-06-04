export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center">
      <div className="text-center text-white px-6">
        <div className="text-6xl mb-6">🏢</div>
        <h1 className="text-3xl font-bold mb-2">DC Co-Business</h1>
        <p className="text-brand-100 text-lg mb-8">
          ห้องพัก • ร้านทอง • อสังหาริมทรัพย์
        </p>
        <div className="bg-white/10 rounded-2xl p-6 max-w-sm mx-auto text-left space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏠</span>
            <span className="font-medium">ห้องพัก/อพาร์ตเมนต์</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">💛</span>
            <span className="font-medium">ร้านทอง DC Gold</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏢</span>
            <span className="font-medium">อสังหาริมทรัพย์</span>
          </div>
        </div>
        <p className="mt-8 text-brand-200 text-sm">
          เพิ่มเพื่อนใน LINE เพื่อรับบริการครบครัน
        </p>
      </div>
    </div>
  );
}
