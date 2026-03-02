'use server'

import { db } from '@/lib/db';

export interface MonthlyDetailStat {
  month: number;
  error_total: number;
  error_resolved: number;
  warning_total: number;
  warning_resolved: number;
}

export interface MonthlyStatsResponse {
  worstErrorMonth: MonthlyDetailStat | null;
  worstWarningMonth: MonthlyDetailStat | null;
  months: MonthlyDetailStat[];
}

export async function getKC1MonthlyDetailedStats(year: number): Promise<MonthlyStatsResponse> {
  try {
    // 1. Khởi tạo mảng 12 tháng (Tháng 12 lùi về Tháng 1)
    const months: MonthlyDetailStat[] = [];
    for (let i = 12; i >= 1; i--) {
      months.push({
        month: i,
        error_total: 0,
        error_resolved: 0,
        warning_total: 0,
        warning_resolved: 0
      });
    }

    // 2. Query gom nhóm theo Tháng của Năm được chọn
    const getGroupedData = async (tableName: string) => {
      const sql = `
        SELECT MONTH(occurred_at) as month_num, COUNT(*) as count 
        FROM ${tableName} 
        WHERE YEAR(occurred_at) = ?
        GROUP BY MONTH(occurred_at)
      `;
      const [rows] = await db.query(sql, [year]);
      return rows as any[];
    };

    // Dùng 4 bảng của KC1
    const [errActive, errResolved, warActive, warResolved] = await Promise.all([
      getGroupedData('guidekc_alarm_new'),
      getGroupedData('guidekc_alarm1_new'),
      getGroupedData('guidekc_alarm2_new'),
      getGroupedData('guidekc_alarm3_new'),
    ]);

    let worstErrorMonth: MonthlyDetailStat | null = null;
    let worstWarningMonth: MonthlyDetailStat | null = null;
    let maxErrors = -1;
    let maxWarnings = -1;

    // 3. Xử lý dữ liệu và tìm ra tháng tồi tệ nhất
    const finalMonths = months.map(m => {
      const mErrA = errActive.find(r => r.month_num === m.month)?.count || 0;
      const mErrR = errResolved.find(r => r.month_num === m.month)?.count || 0;
      const mWarA = warActive.find(r => r.month_num === m.month)?.count || 0;
      const mWarR = warResolved.find(r => r.month_num === m.month)?.count || 0;

      const monthData = {
        ...m,
        error_total: mErrA + mErrR,
        error_resolved: mErrR,
        warning_total: mWarA + mWarR,
        warning_resolved: mWarR
      };

      // Xác định tháng nhiều lỗi nhất
      if (monthData.error_total > maxErrors && monthData.error_total > 0) {
        maxErrors = monthData.error_total;
        worstErrorMonth = monthData;
      }

      // Xác định tháng nhiều cảnh báo nhất
      if (monthData.warning_total > maxWarnings && monthData.warning_total > 0) {
        maxWarnings = monthData.warning_total;
        worstWarningMonth = monthData;
      }

      return monthData;
    });

    return {
      worstErrorMonth,
      worstWarningMonth,
      months: finalMonths
    };

  } catch (error) {
    console.error('Lỗi tính toán Monthly Stats KC1:', error);
    return { worstErrorMonth: null, worstWarningMonth: null, months: [] };
  }
}