// src/app/page.tsx
import Navbar from "@/components/Navbar"; // 1. Import Navbar vào đây
import Link from "next/link";
import { Server, AlertTriangle, CheckCircle, Activity } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* 2. Đặt Navbar ở ngay đầu trang */}
      <Navbar />

      {/* Phần nội dung chính của Dashboard */}
      <div className="flex-1 max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Giám Sát
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Chọn máy GuideKC để xem dữ liệu thời gian thực và lịch sử cảnh báo.
          </p>
        </div>

        {/* Grid hiển thị 2 máy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Máy 1 */}
          <MachineCard 
            id="kc1" 
            name="GuideKC #1" 
            status="online" 
            path="/kc1" // Trang chi tiết sẽ tạo sau
          />

          {/* Card Máy 2 */}
          <MachineCard 
            id="kc2" 
            name="GuideKC #2" 
            status="warning" 
            path="/kc2" // Trang chi tiết sẽ tạo sau
          />
        </div>

      </div>
    </main>
  );
}

// --- Component Card (Giữ nguyên logic cũ nhưng tút lại chút UI) ---
function MachineCard({ id, name, status, path }: { id: string; name: string; status: 'online' | 'warning' | 'offline'; path: string }) {
  
  // Logic hiển thị icon và màu sắc
  const isOnline = status === 'online';
  const isWarning = status === 'warning';

  return (
    <Link href={path} className="group block h-full">
      <div className={`
        relative h-full p-6 rounded-2xl border transition-all duration-300
        bg-white shadow-sm hover:shadow-xl hover:-translate-y-1
        ${isOnline ? 'border-slate-200 hover:border-green-300' : ''}
        ${isWarning ? 'border-yellow-200 bg-yellow-50/30 hover:border-yellow-400' : ''}
      `}>
        
        {/* Header Card */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isWarning ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
              <Server className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {name}
              </h2>
              <p className="text-sm text-slate-500 font-medium">Khu vực sản xuất A</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${isOnline ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
          `}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></span>
            {status}
          </div>
        </div>

        {/* Thông tin nhanh (Mockup data) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Kết nối PLC:</span>
            <span className="font-semibold text-slate-700">Ổn định (12ms)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Lỗi hiện tại:</span>
            <span className={`font-bold ${isWarning ? 'text-red-600' : 'text-slate-700'}`}>
              {isWarning ? '3 Lỗi chưa xử lý' : '0'}
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}