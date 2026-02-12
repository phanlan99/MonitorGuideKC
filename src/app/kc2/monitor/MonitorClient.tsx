'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, AlertOctagon, RefreshCw } from 'lucide-react';
// Import trực tiếp hàm từ service
import { getKC2Logs, LogItem } from '@/services/kc2-service';

export default function MonitorClient() {
  const [activeTab, setActiveTab] = useState<'error' | 'warning'>('error');
  const [data, setData] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    setLoading(true);
    try {
      // GỌI TRỰC TIẾP HÀM SERVER Ở ĐÂY (Không cần fetch)
      const logs = await getKC2Logs(activeTab);
      setData(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
      
      {/* --- Phần Tab và Toolbar giữ nguyên như cũ --- */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('error')}
          className={`flex-1 py-4 text-center font-bold text-lg flex items-center justify-center gap-2 transition-colors
            ${activeTab === 'error' 
              ? 'bg-red-50 text-red-600 border-b-2 border-red-500' 
              : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <AlertOctagon className="w-5 h-5" />
          Lỗi (M2001-M2064)
        </button>
        <button
          onClick={() => setActiveTab('warning')}
          className={`flex-1 py-4 text-center font-bold text-lg flex items-center justify-center gap-2 transition-colors
            ${activeTab === 'warning' 
              ? 'bg-yellow-50 text-yellow-600 border-b-2 border-yellow-500' 
              : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <AlertTriangle className="w-5 h-5" />
          Cảnh báo (M2101-M2164)
        </button>
      </div>

      <div className="flex justify-between items-center p-4 bg-slate-50 border-b border-slate-200">
        <span className="text-sm text-slate-500 font-medium">
          Dữ liệu trực tiếp từ Server (Cập nhật 5s/lần)
        </span>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3 h-3" />
          {lastUpdated.toLocaleTimeString()}
          <button onClick={fetchData} disabled={loading} className="p-1 hover:bg-slate-200 rounded">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* --- Phần Table hiển thị --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 font-semibold border-b">Thời gian</th>
              <th className="px-6 py-3 font-semibold border-b">Mã Lỗi</th>
              <th className="px-6 py-3 font-semibold border-b">Nội dung</th>
              <th className="px-6 py-3 font-semibold border-b">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && data.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10">Đang tải...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-10 text-slate-400">Không có dữ liệu</td></tr>
            ) : (
              data.map((item) => (
                <tr key={`${item.id}-${item.status}`} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                    {new Date(item.occurred_at).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">
                    M{item.error_code}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-800">
                    {item.error_content}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} type={activeTab} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Component Badge (Giữ nguyên)
function StatusBadge({ status, type }: { status: 'active' | 'resolved'; type: 'error' | 'warning' }) {
  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <CheckCircle className="w-3 h-3" />
        Đã xử lý
      </span>
    );
  }
  return type === 'error' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 animate-pulse">
      <AlertOctagon className="w-3 h-3" />
      Đang lỗi
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 animate-pulse">
      <AlertTriangle className="w-3 h-3" />
      Cảnh báo
    </span>
  );
}