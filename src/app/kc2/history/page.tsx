import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import HistoryClient from "./HistoryClient";
import LoginForm from "@/components/LoginForm";
import LogoutButton from "./LogoutButton";

export default async function KC2HistoryPage() {
  const cookieStore = await cookies();
  
  // === SỬA TẠI ĐÂY: Đổi kc2_auth thành guidekc_auth ===
  const isAuthenticated = cookieStore.get('guidekc_auth')?.value === 'true';

  // NẾU CHƯA ĐĂNG NHẬP -> Hiển thị màn hình Login
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoginForm title="Trang Lịch sử GuideKC #2 yêu cầu đăng nhập" />
        </div>
      </main>
    );
  }

  // NẾU ĐÃ ĐĂNG NHẬP -> Hiển thị trang lịch sử
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Lịch sử hoạt động GuideKC #2
            </h1>
            <p className="mt-2 text-slate-600">
              Tra cứu chi tiết lịch sử lỗi và cảnh báo.
            </p>
          </div>
          
          <LogoutButton />
        </div>

        <HistoryClient />
        
      </div>
    </main>
  );
}