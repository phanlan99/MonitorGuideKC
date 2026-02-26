// src/app/kc2/analysis/AnalysisClient.tsx
'use client';

import { useState } from 'react';
import AnalysisSidebar from "@/components/AnalysisSidebar";
import AnalysisChart7ngay from "@/components/AnalysisChart7ngay";
import AnalysisChartWeekly from "@/components/AnalysisChartWeekly";
import AnalysisChartMonthly from "@/components/AnalysisChartMonthly";
import AnalysisChartTrend from "@/components/AnalysisChartTrend";

export default function AnalysisClient() {
  const [activeTab, setActiveTab] = useState<'7days' | 'weekly' | 'monthly' | 'trend'>('7days');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      
      <AnalysisSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <section className="flex-1 min-h-[500px]">
        {activeTab === '7days' && (
          <div className="animate-in fade-in zoom-in duration-300">
             <AnalysisChart7ngay />
          </div>
        )}

        {activeTab === 'weekly' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <AnalysisChartWeekly />
          </div>
        )}

        {activeTab === 'monthly' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <AnalysisChartMonthly />
          </div>
        )}

        {activeTab === 'trend' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <AnalysisChartTrend />
          </div>
        )}
      </section>

    </div>
  );
}