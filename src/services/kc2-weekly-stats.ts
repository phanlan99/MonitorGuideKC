'use server'

import { db } from '@/lib/db';

export interface TopIssue {
  code: number;
  content: string;
  count: number;
}

export interface WeeklyDetailStat {
  week: number;
  error_total: number;
  error_resolved: number;
  warning_total: number;
  warning_resolved: number;
  top_errors: TopIssue[];
  top_warnings: TopIssue[];
}

export interface WeeklyStatsResponse {
  worstWeek: WeeklyDetailStat | null;
  weeks: WeeklyDetailStat[];
}

export async function getKC2WeeklyDetailedStats(year: number): Promise<WeeklyStatsResponse> {
  try {
    // 1. Khởi tạo mảng 52 tuần (từ mới nhất đến cũ nhất)
    const weeks: WeeklyDetailStat[] = [];
    for (let i = 52; i >= 1; i--) {
      weeks.push({
        week: i,
        error_total: 0,
        error_resolved: 0,
        warning_total: 0,
        warning_resolved: 0,
        top_errors: [],
        top_warnings: []
      });
    }

    // 2. Query gom nhóm theo Tuần + Mã lỗi của Năm được chọn
    const getGroupedData = async (tableName: string) => {
      const sql = `
        SELECT WEEK(occurred_at, 1) as week_num, error_code, error_content, COUNT(*) as count 
        FROM ${tableName} 
        WHERE YEAR(occurred_at) = ?
        GROUP BY WEEK(occurred_at, 1), error_code, error_content
      `;
      const [rows] = await db.query(sql, [year]);
      return rows as any[];
    };

    // === CHÚ Ý: Dùng 4 bảng của KC2 ===
    const [errActive, errResolved, warActive, warResolved] = await Promise.all([
      getGroupedData('guidekc_alarm_new4'), // Lỗi Active
      getGroupedData('guidekc_alarm_new5'), // Lỗi Resolved
      getGroupedData('guidekc_alarm_new6'), // Cảnh báo Active
      getGroupedData('guidekc_alarm_new7'), // Cảnh báo Resolved
    ]);

    let worstWeek: WeeklyDetailStat | null = null;
    let maxTotalIssues = -1;

    // 3. Xử lý dữ liệu
    const finalWeeks = weeks.map(w => {
      const wErrA = errActive.filter(r => r.week_num === w.week);
      const wErrR = errResolved.filter(r => r.week_num === w.week);
      const wWarA = warActive.filter(r => r.week_num === w.week);
      const wWarR = warResolved.filter(r => r.week_num === w.week);

      const sum = (arr: any[]) => arr.reduce((acc, curr) => acc + curr.count, 0);
      const totalErrA = sum(wErrA);
      const totalErrR = sum(wErrR);
      const totalWarA = sum(wWarA);
      const totalWarR = sum(wWarR);

      const getTop5 = (activeArr: any[], resolvedArr: any[]) => {
        const issueMap = new Map<number, TopIssue>();
        const addToMap = (arr: any[]) => {
          arr.forEach(item => {
            if (issueMap.has(item.error_code)) {
              issueMap.get(item.error_code)!.count += item.count;
            } else {
              issueMap.set(item.error_code, { code: item.error_code, content: item.error_content, count: item.count });
            }
          });
        };
        addToMap(activeArr);
        addToMap(resolvedArr);
        return Array.from(issueMap.values()).sort((a, b) => b.count - a.count).slice(0, 5);
      };

      const weekData = {
        ...w,
        error_total: totalErrA + totalErrR,
        error_resolved: totalErrR,
        warning_total: totalWarA + totalWarR,
        warning_resolved: totalWarR,
        top_errors: getTop5(wErrA, wErrR),
        top_warnings: getTop5(wWarA, wWarR)
      };

      // Tìm Tuần Tồi Tệ Nhất
      const currentTotalIssues = weekData.error_total + weekData.warning_total;
      if (currentTotalIssues > maxTotalIssues && currentTotalIssues > 0) {
        maxTotalIssues = currentTotalIssues;
        worstWeek = weekData;
      }

      return weekData;
    });

    return {
      worstWeek,
      weeks: finalWeeks
    };

  } catch (error) {
    console.error('Lỗi tính toán Weekly Stats KC2:', error);
    return { worstWeek: null, weeks: [] };
  }
}