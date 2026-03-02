'use server'

import { db } from '@/lib/db';

export interface TopIssue {
  code: number;
  content: string;
  count: number;
}

export interface DailyDetailStat {
  date: string;
  fullDate: string;
  error_total: number;
  error_resolved: number;
  warning_total: number;
  warning_resolved: number;
  top_errors: TopIssue[];
  top_warnings: TopIssue[];
}

export async function getKC2DailyDetailedStats(): Promise<DailyDetailStat[]> {
  try {
    const days: DailyDetailStat[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`; 

      days.push({
        date: displayStr,
        fullDate: dateStr,
        error_total: 0,
        error_resolved: 0,
        warning_total: 0,
        warning_resolved: 0,
        top_errors: [],
        top_warnings: []
      });
    }

    const getGroupedData = async (tableName: string) => {
      const sql = `
        SELECT DATE(occurred_at) as log_date, error_code, error_content, COUNT(*) as count 
        FROM ${tableName} 
        WHERE occurred_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(occurred_at), error_code, error_content
      `;
      const [rows] = await db.query(sql);
      return rows as any[];
    };

    // === CHÚ Ý: Sử dụng 4 bảng của KC2 ===
    const [errActive, errResolved, warActive, warResolved] = await Promise.all([
      getGroupedData('guidekc_alarm_new4'), // Lỗi đang có
      getGroupedData('guidekc_alarm_new5'), // Lỗi đã xử lý
      getGroupedData('guidekc_alarm_new6'), // Cảnh báo đang có
      getGroupedData('guidekc_alarm_new7'), // Cảnh báo đã xử lý
    ]);

    const finalData = days.map(day => {
      const dayErrA = errActive.filter(r => new Date(r.log_date).toISOString().split('T')[0] === day.fullDate);
      const dayErrR = errResolved.filter(r => new Date(r.log_date).toISOString().split('T')[0] === day.fullDate);
      const dayWarA = warActive.filter(r => new Date(r.log_date).toISOString().split('T')[0] === day.fullDate);
      const dayWarR = warResolved.filter(r => new Date(r.log_date).toISOString().split('T')[0] === day.fullDate);

      const sum = (arr: any[]) => arr.reduce((acc, curr) => acc + curr.count, 0);
      const totalErrA = sum(dayErrA);
      const totalErrR = sum(dayErrR);
      const totalWarA = sum(dayWarA);
      const totalWarR = sum(dayWarR);

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

        return Array.from(issueMap.values())
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      };

      return {
        ...day,
        error_total: totalErrA + totalErrR,
        error_resolved: totalErrR,
        warning_total: totalWarA + totalWarR,
        warning_resolved: totalWarR,
        top_errors: getTop5(dayErrA, dayErrR),
        top_warnings: getTop5(dayWarA, dayWarR)
      };
    });

    return finalData;

  } catch (error) {
    console.error('Lỗi tính toán Daily Stats KC2:', error);
    return [];
  }
}