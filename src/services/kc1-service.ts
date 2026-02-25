'use server'

import { db } from '@/lib/db';

// Có thể dùng chung interface LogItem với KC2 nếu muốn, nhưng định nghĩa lại cho an toàn
export interface LogItemKC1 {
  id: number;
  error_code: number;
  error_content: string;
  product_info: string;
  occurred_at: string; 
  status: 'active' | 'resolved';
}

export async function getKC1Logs(type: 'error' | 'warning'): Promise<LogItemKC1[]> {
  try {
    let query = '';

    if (type === 'error') {
      // KC1 - Lỗi: Bảng guidekc_alarm_new và guidekc_alarm1_new
      query = `
        (SELECT id, error_code, error_content, product_info, occurred_at, 'active' as status FROM guidekc_alarm_new)
        UNION ALL
        (SELECT id, error_code, error_content, product_info, occurred_at, 'resolved' as status FROM guidekc_alarm1_new)
        ORDER BY occurred_at DESC
        LIMIT 20
      `;
    } else {
      // KC1 - Cảnh báo: Bảng guidekc_alarm2_new và guidekc_alarm3_new
      query = `
        (SELECT id, error_code, error_content, product_info, occurred_at, 'active' as status FROM guidekc_alarm2_new)
        UNION ALL
        (SELECT id, error_code, error_content, product_info, occurred_at, 'resolved' as status FROM guidekc_alarm3_new)
        ORDER BY occurred_at DESC
        LIMIT 20
      `;
    }

    const [rows] = await db.query(query);
    
    const data = (rows as any[]).map(row => ({
      ...row,
      occurred_at: new Date(row.occurred_at).toISOString(),
      product_info: row.product_info || 'Không rõ'
    }));

    return data as LogItemKC1[];

  } catch (error) {
    console.error('Lỗi lấy dữ liệu KC1:', error);
    return []; 
  }
}

// ... (Phần getKC1Logs giữ nguyên)

// --- PHẦN LỊCH SỬ CHO KC1 ---
export interface HistoryFilterKC1 {
  startDate: string; 
  endDate: string;   
  errorCode?: string;
  content?: string;
  productInfo?: string; 
  status: 'all' | 'active' | 'resolved';
  type: 'all' | 'error' | 'warning';
}

export interface HistoryItemKC1 extends LogItemKC1 {
  type: 'error' | 'warning';
}

export async function searchKC1History(filter: HistoryFilterKC1): Promise<HistoryItemKC1[]> {
  try {
    const queries: string[] = [];
    
    // === CHÚ Ý: Sử dụng các bảng của KC1 ===
    if (filter.type === 'all' || filter.type === 'error') {
      if (filter.status === 'all' || filter.status === 'active') {
        queries.push(`SELECT id, error_code, error_content, product_info, occurred_at, 'active' as status, 'error' as type FROM guidekc_alarm_new`);
      }
      if (filter.status === 'all' || filter.status === 'resolved') {
        queries.push(`SELECT id, error_code, error_content, product_info, occurred_at, 'resolved' as status, 'error' as type FROM guidekc_alarm1_new`);
      }
    }

    if (filter.type === 'all' || filter.type === 'warning') {
      if (filter.status === 'all' || filter.status === 'active') {
        queries.push(`SELECT id, error_code, error_content, product_info, occurred_at, 'active' as status, 'warning' as type FROM guidekc_alarm2_new`);
      }
      if (filter.status === 'all' || filter.status === 'resolved') {
        queries.push(`SELECT id, error_code, error_content, product_info, occurred_at, 'resolved' as status, 'warning' as type FROM guidekc_alarm3_new`);
      }
    }

    const unionQuery = queries.join(' UNION ALL ');
    let finalQuery = `SELECT * FROM (${unionQuery}) as t WHERE 1=1`;
    const params: any[] = [];

    // Áp dụng bộ lọc
    if (filter.startDate) {
      finalQuery += ` AND occurred_at >= ?`;
      params.push(filter.startDate.replace('T', ' ') + ':00'); 
    }
    if (filter.endDate) {
      finalQuery += ` AND occurred_at <= ?`;
      params.push(filter.endDate.replace('T', ' ') + ':59'); 
    }
    if (filter.errorCode) {
      finalQuery += ` AND error_code = ?`;
      params.push(filter.errorCode);
    }
    if (filter.content) {
      finalQuery += ` AND error_content LIKE ?`;
      params.push(`%${filter.content}%`);
    }
    if (filter.productInfo) {
      finalQuery += ` AND product_info LIKE ?`;
      params.push(`%${filter.productInfo}%`);
    }

    finalQuery += ` ORDER BY occurred_at DESC LIMIT 500`;

    const [rows] = await db.query(finalQuery, params);

    const data = (rows as any[]).map(row => ({
      ...row,
      occurred_at: new Date(row.occurred_at).toISOString(),
      product_info: row.product_info || 'Không rõ'
    }));

    return data as HistoryItemKC1[];

  } catch (error) {
    console.error('Lỗi tìm kiếm lịch sử KC1:', error);
    return [];
  }
}