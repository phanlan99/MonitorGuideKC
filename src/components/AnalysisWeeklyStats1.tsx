'use client';

import { useEffect, useState } from 'react';
import { getKC1WeeklyDetailedStats, WeeklyDetailStat, WeeklyStatsResponse } from '@/services/kc1-weekly-stats';
import { Loader2, CalendarDays, AlertOctagon, AlertTriangle, Siren, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AnalysisWeeklyStats1({ selectedYear }: { selectedYear: number }) {
  const [data, setData] = useState<WeeklyStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  // LOGIC PHÂN TRANG (PAGINATION)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Hiển thị 4 tuần mỗi trang cho vừa màn hình

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getKC1WeeklyDetailedStats(selectedYear);
      setData(result);
      setCurrentPage(1); // Trả về trang 1 khi đổi năm
      setLoading(false);
    };
    fetchData();
  }, [selectedYear]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center p-10 bg-white rounded-xl border border-slate-200 mt-6">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400 mr-2" />
        <span className="text-slate-500 font-medium">Đang tải phân tích chi tiết tuần năm {selectedYear}...</span>
      </div>
    );
  }

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const totalPages = Math.ceil(data.weeks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentWeeks = data.weeks.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="mt-8 space-y-6">
      
      {/* KHỐI HIGHLIGHT: TUẦN TỒI TỆ NHẤT */}
      {data.worstWeek && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full animate-pulse">
              <Siren className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-700">Tuần nhiều sự cố nhất năm {selectedYear}</h3>
              <p className="text-sm text-red-600 font-medium">
                Tuần {data.worstWeek.week} ghi nhận tổng cộng {data.worstWeek.error_total + data.worstWeek.warning_total} sự cố.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DANH SÁCH CÁC TUẦN */}
      <div className="grid grid-cols-1 gap-6">
        {currentWeeks.map((w, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* HEADER */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg"><CalendarDays className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Tuần thứ {w.week}</h4>
                  <p className="text-xs text-slate-500">Năm {selectedYear}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Lỗi (Tổng / Xử lý)</p>
                  <p className="font-bold text-slate-800">
                    <span className="text-red-500">{w.error_total}</span> / <span className="text-green-600">{w.error_resolved}</span>
                  </p>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Cảnh báo (Tổng / Xử lý)</p>
                  <p className="font-bold text-slate-800">
                    <span className="text-yellow-600">{w.warning_total}</span> / <span className="text-blue-500">{w.warning_resolved}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* BODY: Top 5 */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top 5 Lỗi */}
              <div>
                <h5 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
                  <AlertOctagon className="w-4 h-4 text-red-500" /> Top 5 Lỗi xảy ra nhiều nhất
                </h5>
                {w.top_errors.length === 0 ? <p className="text-sm text-slate-400 italic">Không có lỗi.</p> : (
                  <ul className="space-y-3">
                    {w.top_errors.map((err, i) => (
                      <li key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold text-slate-800 truncate pr-2">M{err.code}: {err.content}</span>
                          <span className="font-bold text-red-600 bg-red-50 px-2 rounded-md">{err.count}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-red-400 h-1.5 rounded-full" style={{ width: `${Math.min((err.count / (w.error_total || 1)) * 100, 100)}%` }}></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Top 5 Cảnh báo */}
              <div>
                <h5 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" /> Top 5 Cảnh báo nhiều nhất
                </h5>
                {w.top_warnings.length === 0 ? <p className="text-sm text-slate-400 italic">Không có cảnh báo.</p> : (
                  <ul className="space-y-3">
                    {w.top_warnings.map((warn, i) => (
                      <li key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold text-slate-800 truncate pr-2">M{warn.code}: {warn.content}</span>
                          <span className="font-bold text-yellow-600 bg-yellow-50 px-2 rounded-md">{warn.count}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${Math.min((warn.count / (w.warning_total || 1)) * 100, 100)}%` }}></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) */}
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