'use server'

import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function initAuthDb() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS userguidekc (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    const [rows]: any = await db.query('SELECT COUNT(*) as count FROM userguidekc');
    
    if (rows[0].count === 0) {
      await db.query(
        `INSERT INTO userguidekc (username, password) VALUES (?, ?)`, 
        ['admin', 'admin123']
      );
      console.log('Đã tạo tài khoản mặc định: admin / admin123');
    }
  } catch (error) {
    console.error('Lỗi khởi tạo database Auth:', error);
  }
}

export async function loginAction(formData: FormData) {
  await initAuthDb();

  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  try {
    const [rows]: any = await db.query(
      'SELECT * FROM userguidekc WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length > 0) {
      const cookieStore = await cookies();
      // ĐỔI TÊN COOKIE Ở ĐÂY ĐỂ DÙNG CHUNG CHO CẢ APP
      cookieStore.set('guidekc_auth', 'true', { 
        maxAge: 86400,
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production' 
      });
      return { success: true };
    } else {
      return { success: false, message: 'Sai tài khoản hoặc mật khẩu!' };
    }
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    return { success: false, message: 'Lỗi kết nối cơ sở dữ liệu' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  // ĐỔI TÊN COOKIE Ở ĐÂY
  cookieStore.delete('guidekc_auth');
}