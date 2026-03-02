'use client';

import { useState } from 'react';
import AnalysisSidebar from "@/components/AnalysisSidebar";
import AnalysisChart7ngay1 from "@/components/AnalysisChart7ngay1";
import AnalysisChartWeekly1 from "@/components/AnalysisChartWeekly1";
import AnalysisChartMonthly1 from "@/components/AnalysisChartMonthly1";
import AnalysisChartTrend1 from "@/components/AnalysisChartTrend1";
import AnalysisDailyStats1 from "@/components/AnalysisDailyStats1"; // <-- IMPORT COMPONENT MỚI

export default function AnalysisClient1() {
  const [activeTab, setActiveTab] = useState<'7days' | 'weekly' | 'monthly' | 'trend'>('7days');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      <AnalysisSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <section className="flex-1 min-h-[500px]">
        {/* TAB: 7 NGÀY GẦN NHẤT */}
        {activeTab === '7days' && (
          <div className="animate-in fade-in zoom-in duration-300">
             {/* Biểu đồ tổng quan */}
             <AnalysisChart7ngay1 />
             
             {/* Bảng phân tích chuyên sâu bên dưới */}
             <AnalysisDailyStats1 />
          </div>
        )}

        {/* CÁC TAB KHÁC GIỮ NGUYÊN */}
        {activeTab === 'weekly' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <AnalysisChartWeekly1 />
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <AnalysisChartMonthly1 />
          </div>
        )}

        {activeTab === 'trend' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <AnalysisChartTrend1 />
          </div>
        )}
      </section>

    </div>
  );
}