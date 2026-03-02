'use client';

import { useEffect, useState } from 'react';
import { getKC1DailyDetailedStats, DailyDetailStat } from '@/services/kc1-daily-stats';
import { Loader2, Calendar, AlertOctagon, AlertTriangle, CheckCircle, Flame } from 'lucide-react';

export default function AnalysisDailyStats1() {
  const [data, setData] = useState<DailyDetailStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getKC1DailyDetailedStats();
      setData(result);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 bg-white rounded-xl border border-slate-200 mt-6">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400 mr-2" />
        <span className="text-slate-500 font-medium">Đang tải phân tích chi tiết...</span>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-6 h-6 text-orange-500" />
        <h3 className="text-xl font-bold text-slate-800">Phân tích chuyên sâu 7 ngày gần nhất</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {data.map((day, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* HEADER: Thông số tổng quát của Ngày */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg"><Calendar className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Ngày {day.date}</h4>
                  <p className="text-xs text-slate-500">{day.fullDate}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Lỗi (Tổng / Xử lý)</p>
                  <p className="font-bold text-slate-800">
                    <span className="text-red-500">{day.error_total}</span> / <span className="text-green-600">{day.error_resolved}</span>
                  </p>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase">Cảnh báo (Tổng / Xử lý)</p>
                  <p className="font-bold text-slate-800">
                    <span className="text-yellow-600">{day.warning_total}</span> / <span className="text-blue-500">{day.warning_resolved}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* BODY: Top 5 Lỗi và Cảnh báo */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Cột 1: Top 5 Lỗi */}
              <div>
                <h5 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
                  <AlertOctagon className="w-4 h-4 text-red-500" /> Top 5 Lỗi xảy ra nhiều nhất
                </h5>
                {day.top_errors.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Không có lỗi nào ghi nhận.</p>
                ) : (
                  <ul className="space-y-3">
                    {day.top_errors.map((err, i) => (
                      <li key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold text-slate-800 truncate pr-2">M{err.code}: {err.content}</span>
                          <span className="font-bold text-red-600 bg-red-50 px-2 rounded-md">{err.count}</span>
                        </div>
                        {/* Thanh Progress bar tương đối */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-red-400 h-1.5 rounded-full" style={{ width: `${Math.min((err.count / (day.error_total || 1)) * 100, 100)}%` }}></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Cột 2: Top 5 Cảnh báo */}
              <div>
                <h5 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" /> Top 5 Cảnh báo nhiều nhất
                </h5>
                {day.top_warnings.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">Không có cảnh báo nào ghi nhận.</p>
                ) : (
                  <ul className="space-y-3">
                    {day.top_warnings.map((warn, i) => (
                      <li key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-semibold text-slate-800 truncate pr-2">M{warn.code}: {warn.content}</span>
                          <span className="font-bold text-yellow-600 bg-yellow-50 px-2 rounded-md">{warn.count}</span>
                        </div>
                        {/* Thanh Progress bar tương đối */}
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${Math.min((warn.count / (day.warning_total || 1)) * 100, 100)}%` }}></div>
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
    </div>
  );
}