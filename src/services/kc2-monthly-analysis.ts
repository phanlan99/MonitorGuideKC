// src/services/kc2-monthly-analysis.ts
'use server'

import { db } from '@/lib/db';

export interface MonthlyAnalysisData {
  month: number;         // 1 - 12
  label: string;         // "Tháng 1", "Tháng 2"...
  error_active: number;
  error_resolved: number;
  warning_active: number;
  warning_resolved: number;
}

export async function getYearlyMonthlyAnalysis(year: number): Promise<MonthlyAnalysisData[]> {
  try {
    // 1. Khởi tạo mảng 12 tháng mặc định (Giá trị = 0)
    const months: MonthlyAnalysisData[] = [];
    for (let i = 1; i <= 12; i++) {
      months.push({
        month: i,
        label: `Tháng ${i}`,
        error_active: 0,
        error_resolved: 0,
        warning_active: 0,
        warning_resolved: 0,
      });
    }

    // 2. Hàm helper truy vấn theo tháng
    const getCountByMonth = async (tableName: string) => {
      const sql = `
        SELECT MONTH(occurred_at) as month_num, COUNT(*) as count 
        FROM ${tableName} 
        WHERE YEAR(occurred_at) = ?
        GROUP BY MONTH(occurred_at)
      `;
      const [rows] = await db.query(sql, [year]);
      return rows as any[];
    };

    // 3. Chạy 4 query song song vào các bảng MỚI
    const [errActive, errResolved, warActive, warResolved] = await Promise.all([
      getCountByMonth('guidekc_alarm_new4'),
      getCountByMonth('guidekc_alarm_new5'),
      getCountByMonth('guidekc_alarm_new6'),
      getCountByMonth('guidekc_alarm_new7'),
    ]);

    // 4. Map dữ liệu vào khung 12 tháng
    const finalData = months.map(m => {
      const findCount = (rows: any[]) => {
        const row = rows.find((r: any) => r.month_num === m.month);
        return row ? row.count : 0;
      };

      return {
        ...m,
        error_active: findCount(errActive),
        error_resolved: findCount(errResolved),
        warning_active: findCount(warActive),
        warning_resolved: findCount(warResolved),
      };
    });

    return finalData;

  } catch (error) {
    console.error('Lỗi phân tích tháng:', error);
    return [];
  }
}