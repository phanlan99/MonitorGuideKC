import Navbar from "@/components/Navbar";

export default function KC1MonitorPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Đây là màn hình theo dõi lỗi của máy GuideKC #1
        </h1>
        <p className="mt-4 text-slate-600">
          (Nội dung chi tiết bảng lỗi, trạng thái thời gian thực sẽ hiển thị tại đây...)
        </p>
      </div>
    </main>
  );
}