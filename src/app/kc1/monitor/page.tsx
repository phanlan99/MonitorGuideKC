import Navbar from "@/components/Navbar";
import MonitorClient1 from "./MonitorClient1"; // Import Client Component

export default function KC1MonitorPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Page */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Giám sát GuideKC #1
          </h1>
          <p className="mt-2 text-slate-600">
            Theo dõi trạng thái lỗi và cảnh báo thời gian thực từ PLC.
          </p>
        </div>

        {/* Khu vực hiển thị bảng dữ liệu */}
        <MonitorClient1 />
        
      </div>
    </main>
  );
}