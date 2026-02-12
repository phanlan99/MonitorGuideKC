// src/app/kc2/analysis/page.tsx
import Navbar from "@/components/Navbar";
import AnalysisChart7ngay from "@/components/AnalysisChart7ngay"; // Import từ components
import { BarChart3 } from "lucide-react";

export default function KC2AnalysisPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Phân tích dữ liệu GuideKC #2
            </h1>
            <p className="text-slate-600">
              Tổng hợp hiệu suất vận hành và tần suất sự cố trong tuần.
            </p>
          </div>
        </div>

        {/* Biểu đồ */}
        <div className="grid grid-cols-1 gap-8">
          {/* Gọi component mới ở đây */}
          <AnalysisChart7ngay />
        </div>
        
      </div>
    </main>
  );
}