// src/app/page.tsx
'use client'; // Biến thành Client Component để auto-refresh dữ liệu

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Server, AlertTriangle, CheckCircle, AlertOctagon, Info, Loader2 } from "lucide-react";
import { getTodayStats, MachineStats } from "@/services/dashboard-service";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full py-10 px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Dashboard Giám Sát Tổng Quan
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Dữ liệu tổng hợp tình trạng hoạt động của các máy trong <strong className="text-blue-600">ngày hôm nay</strong>.
          </p>
        </div>

        {/* Grid hiển thị các máy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MachineCard id="kc1" name="GuideKC #1" path="/kc1" />
          <MachineCard id="kc2" name="GuideKC #2" path="/kc2" />
        </div>

      </div>
    </main>
  );
}

// --- Component Card Thông Minh (Tự động lấy dữ liệu) ---
function MachineCard({ id, name, path }: { id: 'kc1' | 'kc2'; name: string; path: string }) {
  const [stats, setStats] = useState<MachineStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu mỗi 5 giây
  useEffect(() => {
    const fetchData = async () => {
      const data = await getTodayStats(id);
      setStats(data);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  // Xác định trạng thái dựa trên số liệu thực tế
  let status: 'online' | 'warning' | 'error' = 'online';
  if (stats) {
    if (stats.error_active > 0) status = 'error';
    else if (stats.warning_active > 0) status = 'warning';
  }

  return (
    <Link href={`${path}/monitor`} className="group block h-full">
      <div className={`
        relative h-full p-6 rounded-2xl border-2 transition-all duration-300
        bg-white shadow-sm hover:shadow-xl hover:-translate-y-1
        ${status === 'online' ? 'border-slate-200 hover:border-green-400' : ''}
        ${status === 'warning' ? 'border-yellow-300 bg-yellow-50/20 hover:border-yellow-500' : ''}
        ${status === 'error' ? 'border-red-300 bg-red-50/20 hover:border-red-500' : ''}
      `}>
        
        {/* Header Card */}
        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl transition-colors
              ${status === 'error' ? 'bg-red-100 text-red-600' : 
                status === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
              <Server className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${status === 'online' ? 'bg-green-400' : status === 'error' ? 'bg-red-400' : 'bg-yellow-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'online' ? 'bg-green-500' : status === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                </span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  PLC Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Khung hiển thị 4 chỉ số thống kê */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wide">Thống kê hôm nay</h3>
          
          {loading ? (
            <div className="flex justify-center py-6 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              
              {/* 1. Lỗi đang xảy ra */}
              <div className={`p-3 rounded-lg border ${stats?.error_active! > 0 ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <AlertOctagon className={`w-5 h-5 ${stats?.error_active! > 0 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                  <span className={`text-xl font-bold ${stats?.error_active! > 0 ? 'text-red-600' : 'text-slate-600'}`}>
                    {stats?.error_active}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">Lỗi đang có</p>
              </div>

              {/* 2. Lỗi đã xử lý */}
              <div className="p-3 rounded-lg border bg-slate-50 border-slate-100 hover:border-green-200 transition-colors">
                <div className="flex items-center justify-between">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-xl font-bold text-slate-700">{stats?.error_resolved}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">Lỗi đã xử lý</p>
              </div>

              {/* 3. Cảnh báo đang xảy ra */}
              <div className={`p-3 rounded-lg border ${stats?.warning_active! > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <AlertTriangle className={`w-5 h-5 ${stats?.warning_active! > 0 ? 'text-yellow-500 animate-pulse' : 'text-slate-400'}`} />
                  <span className={`text-xl font-bold ${stats?.warning_active! > 0 ? 'text-yellow-600' : 'text-slate-600'}`}>
                    {stats?.warning_active}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">Cảnh báo đang có</p>
              </div>

              {/* 4. Cảnh báo đã xử lý */}
              <div className="p-3 rounded-lg border bg-slate-50 border-slate-100 hover:border-blue-200 transition-colors">
                <div className="flex items-center justify-between">
                  <Info className="w-5 h-5 text-blue-400" />
                  <span className="text-xl font-bold text-slate-700">{stats?.warning_resolved}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">CB đã xử lý</p>
              </div>

            </div>
          )}
        </div>

      </div>
    </Link>
  );
}