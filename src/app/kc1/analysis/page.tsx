import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import LoginForm from "@/components/LoginForm";
import LogoutButton from "./LogoutButton";
import AnalysisClient1 from "./AnalysisClient1"; // Import file Client vừa tạo
import { PieChart } from "lucide-react";

export default async function KC1AnalysisPage() {
  // Đọc cookie chung của hệ thống
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get('guidekc_auth')?.value === 'true';

  // NẾU CHƯA ĐĂNG NHẬP -> Hiện form
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <LoginForm title="Trang Phân tích GuideKC #1 yêu cầu đăng nhập" />
        </div>
      </main>
    );
  }

  // NẾU ĐÃ ĐĂNG NHẬP -> Hiện trang phân tích
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <PieChart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Phân tích dữ liệu GuideKC #1
              </h1>
              <p className="text-slate-600">
                Trung tâm báo cáo và thống kê hiệu suất vận hành theo đa chiều thời gian.
              </p>
            </div>
          </div>
          
          {/* Nút Đăng xuất */}
          <LogoutButton />
        </div>

        {/* Gọi Component xử lý Tab */}
        <AnalysisClient1 />
        
      </div>
    </main>
  );
}