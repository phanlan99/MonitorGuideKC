// src/services/kc2-service.ts
'use server'

import { db } from '@/lib/db';

export interface LogItem {
  id: number;
  error_code: number;
  error_content: string;
  product_info: string; // <-- THÊM MỚI: Thêm trường này vào interface
  occurred_at: string; 
  status: 'active' | 'resolved';
}

export async function getKC2Logs(type: 'error' | 'warning'): Promise<LogItem[]> {
  try {
    let query = '';

    if (type === 'error') {
      // ĐỔI TÊN BẢNG VÀ THÊM CỘT product_info
      query = `
        (SELECT id, error_code, error_content, product_info, occurred_at, 'active' as status FROM guidekc_alarm_new4)
        UNION ALL
        (SELECT id, error_code, error_content, product_info, occurred_at, 'resolved' as status FROM guidekc_alarm_new5)
        ORDER BY occurred_at DESC
        LIMIT 20
      `;
    } else {
      // ĐỔI TÊN BẢNG VÀ THÊM CỘT product_info
      query = `
        (SELECT id, error_code, error_content, product_info, occurred_at, 'active' as status FROM guidekc_alarm_new6)
        UNION ALL
        (SELECT id, error_code, error_content, product_info, occurred_at, 'resolved' as status FROM guidekc_alarm_new7)
        ORDER BY occurred_at DESC
        LIMIT 20
      `;
    }

    const [rows] = await db.query(query);
    
    const data = (rows as any[]).map(row => ({
      ...row,
      occurred_at: new Date(row.occurred_at).toISOString(),
      product_info: row.product_info || 'Không rõ' // Xử lý nếu NULL
    }));

    return data as LogItem[];

  } catch (error) {
    console.error('Lỗi lấy dữ liệu KC2:', error);
    return []; 
  }
}

// ==========================================
// CẬP NHẬT LUÔN CHO TRANG HISTORY NẾU CẦN
// ==========================================
export interface HistoryFilter {
  startDate: string; 
  endDate: string;   
  errorCode?: string;
  content?: string;
  productInfo?: string; // <--- THÊM MỚI
  status: 'all' | 'active' | 'resolved';
  type: 'all' | 'error' | 'warning';
}

export interface HistoryItem extends LogItem {
  type: 'error' | 'warning';
}

export async function searchKC2History(filter: HistoryFilter): Promise<HistoryItem[]> {
  try {
    const queries: string[] = [];
    
    // Đã đổi sang các bảng _new4, _new5, _new6, _new7 từ bước trước
    if (filter.type === 'all' || filter.type === 'error') {
      if (filter.status === 'all' || filter.status === 'active') {
        queries.push(`SELECT id, error_code, error_content, product_info, occurred_at, 'active' as status, 'error' as type FROM guidekc_alarm_new4`);
      }
      if (filter.status === 'all' || filter.status === 'resolved') {
        queries.push(`SELECT id, error_code, error_content, product_info, occurred_at, 'resolved' as status, 'error' as type FROM guidekc_alarm_new5`);
      }
    }

    if (filter.type === 'all' || filter.type === 'warning') {
      if (filter.status === 'all' || filter.status === 'active') {
        queries.push(`SELECT id, error_code, error_content, product_info, occurred_at, 'active' as status, 'warning' as type FROM guidekc_alarm_new6`);
      }
      if (filter.status === 'all' || filter.status === 'resolved') {
        queries.push(`SELECT id, error_code, error_content, product_info, occurred_at, 'resolved' as status, 'warning' as type FROM guidekc_alarm_new7`);
      }
    }

    const unionQuery = queries.join(' UNION ALL ');
    let finalQuery = `SELECT * FROM (${unionQuery}) as t WHERE 1=1`;
    const params: any[] = [];

    // ... (Các bộ lọc thời gian, mã lỗi, nội dung giữ nguyên)
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

    // THÊM BỘ LỌC MÃ HÀNG TẠI ĐÂY (Tìm gần đúng bằng LIKE)
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

    return data as HistoryItem[];

  } catch (error) {
    console.error('Lỗi tìm kiếm lịch sử:', error);
    return [];
  }
}