// src/app/kc1/analysis/page.tsx
'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import AnalysisSidebar from "@/components/AnalysisSidebar"; // Dùng chung Sidebar với KC2
import AnalysisChart7ngay1 from '@/components/AnalysisChart7ngay1';
import AnalysisChartWeekly1 from '@/components/AnalysisChartWeekly1';
import AnalysisChartMonthly1 from '@/components/AnalysisChartMonthly1';
import AnalysisChartTrend1 from '@/components/AnalysisChartTrend1';
import { PieChart } from "lucide-react";

export default function KC1AnalysisPage() {
  const [activeTab, setActiveTab] = useState<'7days' | 'weekly' | 'monthly' | 'trend'>('7days');

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"> {/* Đổi màu xanh cho khác biệt với KC2 */}
            <PieChart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Phân tích dữ liệu GuideKC #1
            </h1>
            <p className="text-slate-600">
              Trung tâm báo cáo và thống kê hiệu suất vận hành theo đa chiều thời gian.
            </p>
          </div>
        </div>

        {/* Layout Sidebar + Content */}
        <div className="flex flex-col md:flex-row gap-6">
          
          <AnalysisSidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          <section className="flex-1 min-h-[500px]">
            {activeTab === '7days' && (
              <div className="animate-in fade-in zoom-in duration-300">
                 <AnalysisChart7ngay1 />
              </div>
            )}

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
        
      </div>
    </main>
  );
}