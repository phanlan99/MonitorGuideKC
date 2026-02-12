import Navbar from "@/components/Navbar";
import HistoryClient from "./HistoryClient";

export default function KC2HistoryPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Lịch sử hoạt động GuideKC #2
          </h1>
          <p className="mt-2 text-slate-600">
            Tra cứu chi tiết lịch sử lỗi và cảnh báo. Dữ liệu được lưu trữ từ hệ thống PLC.
          </p>
        </div>

        {/* Client Component chứa Logic tìm kiếm */}
        <HistoryClient />
        
      </div>
    </main>
  );
}