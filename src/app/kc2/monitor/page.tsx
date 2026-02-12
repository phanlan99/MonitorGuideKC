// src/app/kc2/monitor/page.tsx
import Navbar from "@/components/Navbar";
import MonitorClient from "./MonitorClient"; // Import component vừa tạo

export default function KC2MonitorPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Giám sát GuideKC #2
          </h1>
          <p className="mt-2 text-slate-600">
            Theo dõi trạng thái lỗi và cảnh báo thời gian thực từ PLC (FX3U/FX5U).
          </p>
        </div>

        {/* Khu vực hiển thị bảng dữ liệu (Tab) */}
        <MonitorClient />
        
      </div>
    </main>
  );
}