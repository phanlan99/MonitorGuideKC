import Navbar from "@/components/Navbar";
import { PieChart } from "lucide-react";

export default function KC1AnalysisPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 text-center">
        <div className="inline-flex p-4 bg-green-100 rounded-full text-green-600 mb-6">
          <PieChart className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">
          Đây là trang phân tích dữ liệu GuideKC #1
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          (Khu vực dành cho biểu đồ Pareto, tần suất lỗi, hiệu suất máy...)
        </p>
      </div>
    </main>
  );
}