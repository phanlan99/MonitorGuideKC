import { cookies } from "next/headers"; // Dùng để đọc cookie
import Navbar from "@/components/Navbar";
import HistoryClient1 from "./HistoryClient1";
import LoginForm from "@/components/LoginForm";
import LogoutButton from "./LogoutButton"; 

export default async function KC1HistoryPage() {
  // Đọc cookie xác thực chung của toàn ứng dụng
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('guidekc_auth')?.value === 'true';

  // NẾU CHƯA ĐĂNG NHẬP -> Hiện form Login
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoginForm title="Trang Lịch sử GuideKC #1 yêu cầu đăng nhập" />
        </div>
      </main>
    );
  }

  // NẾU ĐÃ ĐĂNG NHẬP -> Hiện nội dung
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Lịch sử hoạt động GuideKC #1
            </h1>
            <p className="mt-2 text-slate-600">
              Tra cứu chi tiết lịch sử lỗi và cảnh báo.
            </p>
          </div>
          
          <LogoutButton />
        </div>

        <HistoryClient1 />
        
      </div>
    </main>
  );
}