'use client';

import { useEffect, useState } from 'react';
import { getKC1MonthlyDetailedStats, MonthlyStatsResponse } from '@/services/kc1-monthly-stats';
import { Loader2, Calendar, AlertOctagon, AlertTriangle, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export default function AnalysisMonthlyStats1({ selectedYear }: { selectedYear: number }) {
  const [data, setData] = useState<MonthlyStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  // LOGIC PHÂN TRANG (PAGINATION)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Hiển thị 6 tháng 1 trang (12 tháng = 2 trang)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getKC1MonthlyDetailedStats(selectedYear);
      setData(result);
      setCurrentPage(1); 
      setLoading(false);
    };
    fetchData();
  }, [selectedYear]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-10 bg-white rounded-xl border border-slate-200 mt-6">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400 mr-2" />
        <span className="text-slate-500 font-medium">Đang tải phân tích chi tiết tháng năm {selectedYear}...</span>
      </div>
    );
  }

  const totalPages = Math.ceil(data.months.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMonths = data.months.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="mt-8 space-y-6">
      
      {/* === KHỐI HIGHLIGHT === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tháng nhiều lỗi nhất */}
        <div className={`rounded-xl p-5 shadow-sm border ${data.worstErrorMonth ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${data.worstErrorMonth ? 'bg-red-100 animate-pulse' : 'bg-slate-200'}`}>
              <AlertOctagon className={`w-6 h-6 ${data.worstErrorMonth ? 'text-red-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${data.worstErrorMonth ? 'text-red-700' : 'text-slate-600'}`}>Tháng nhiều LỖI nhất</h3>
              {data.worstErrorMonth ? (
                <p className="text-sm text-red-600 font-medium">
                  Tháng {data.worstErrorMonth.month} ghi nhận kỷ lục <span className="font-bold text-lg">{data.worstErrorMonth.error_total}</span> lỗi.
                </p>
              ) : (
                <p className="text-sm text-slate-500">Chưa có dữ liệu lỗi năm {selectedYear}.</p>
              )}
            </div>
          </div>
        </div>

        {/* Tháng nhiều cảnh báo nhất */}
        <div className={`rounded-xl p-5 shadow-sm border ${data.worstWarningMonth ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-full ${data.worstWarningMonth ? 'bg-yellow-100 animate-pulse' : 'bg-slate-200'}`}>
              <AlertTriangle className={`w-6 h-6 ${data.worstWarningMonth ? 'text-yellow-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${data.worstWarningMonth ? 'text-yellow-700' : 'text-slate-600'}`}>Tháng nhiều CẢNH BÁO nhất</h3>
              {data.worstWarningMonth ? (
                <p className="text-sm text-yellow-600 font-medium">
                  Tháng {data.worstWarningMonth.month} ghi nhận <span className="font-bold text-lg">{data.worstWarningMonth.warning_total}</span> cảnh báo.
                </p>
              ) : (
                <p className="text-sm text-slate-500">Chưa có dữ liệu cảnh báo năm {selectedYear}.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === DANH SÁCH CÁC THÁNG (GRID LAYOUT ĐỂ TIẾT KIỆM DIỆN TÍCH) === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentMonths.map((m, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:border-blue-200 transition-colors">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-slate-800 text-lg">Tháng {m.month} <span className="text-sm font-normal text-slate-500">/{selectedYear}</span></h4>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-slate-500">
                <TrendingUp className="w-4 h-4" /> Tổng: {m.error_total + m.warning_total} sự cố
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
                  <AlertOctagon className="w-3 h-3 text-red-500" /> Lỗi
                </p>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-red-600">{m.error_total}</span>
                  <span className="text-xs text-green-600 font-medium">Đã Xử lý: {m.error_resolved}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-yellow-500" /> Cảnh báo
                </p>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold text-yellow-600">{m.warning_total}</span>
                  <span className="text-xs text-blue-500 font-medium">Đã Xử lý: {m.warning_resolved}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === THANH ĐIỀU HƯỚNG PHÂN TRANG === */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border border-slate-200 rounded-xl shadow-sm">
        <button 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Trang trước
        </button>
        
        <span className="text-sm font-medium text-slate-600">
          Trang <span className="font-bold text-blue-600">{currentPage}</span> / {totalPages}
        </span>

        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
        >
          Trang tiếp <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}