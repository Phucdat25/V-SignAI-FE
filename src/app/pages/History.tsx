import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Lock, Download, Eye, Calendar } from "lucide-react";

const LICH_SU = [
  {
    id: 1,
    date: "03/03/2026",
    time: "09:45",
    preview: "Xin chào, tôi cần khám bệnh hôm nay. Tôi bị đau đầu...",
    duration: "4:32",
    type: "Bệnh viện",
  },
  {
    id: 2,
    date: "02/03/2026",
    time: "15:12",
    preview: "Bạn có thể giúp tôi không? Tôi cần tìm phòng số...",
    duration: "2:15",
    type: "Hàng ngày",
  },
  {
    id: 3,
    date: "01/03/2026",
    time: "11:30",
    preview: "Tôi muốn đặt bàn ăn cho hai người vào lúc sáu giờ...",
    duration: "3:48",
    type: "Hàng ngày",
  },
  {
    id: 4,
    date: "28/02/2026",
    time: "14:00",
    preview: "Thưa giáo viên, tôi không hiểu bài này. Bạn có thể...",
    duration: "1:55",
    type: "Trường học",
    locked: true,
  },
  {
    id: 5,
    date: "27/02/2026",
    time: "10:20",
    preview: "Cần gọi cấp cứu ngay, có người bị ngã...",
    duration: "0:45",
    type: "Khẩn cấp",
    locked: true,
  },
];

const TYPE_COLORS: Record<string, string> = {
  "Bệnh viện": "#DC2626",
  "Hàng ngày": "#2563EB",
  "Trường học": "#7c3aed",
  "Khẩn cấp": "#d97706",
};

export function History() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1F2937" }}>📜 Lịch sử</h1>
            <p style={{ color: "#6B7280", fontSize: 15, marginTop: 2 }}>Các cuộc hội thoại của bạn</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}>
            Gói miễn phí
          </span>
        </div>

        {/* Thông báo người dùng miễn phí */}
        <div
          className="rounded-2xl p-4 mb-6 flex items-center gap-3"
          style={{ backgroundColor: "#fffbeb", border: "1.5px solid #fde68a" }}
        >
          <Lock size={18} color="#d97706" />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#92400e" }}>Gói miễn phí: chỉ xem 3 hội thoại gần nhất</p>
            <p style={{ fontSize: 13, color: "#b45309" }}>Nâng cấp lên Premium để truy cập toàn bộ lịch sử và xuất file.</p>
          </div>
          <button
            onClick={() => navigate("/upgrade")}
            className="ml-auto px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all whitespace-nowrap"
            style={{ backgroundColor: "#d97706", color: "white" }}
          >
            Nâng cấp
          </button>
        </div>

        {/* Danh sách lịch sử */}
        <div className="flex flex-col gap-4">
          {LICH_SU.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-5 shadow-sm relative"
              style={{ backgroundColor: "white", border: "1px solid #e5e7eb", opacity: item.locked ? 0.75 : 1 }}
            >
              {item.locked && (
                <div
                  className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.85)", zIndex: 2 }}
                >
                  <Lock size={28} color="#9CA3AF" />
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#6B7280", marginTop: 8 }}>
                    Nâng cấp để xem
                  </p>
                  <button
                    onClick={() => navigate("/upgrade")}
                    className="mt-3 px-4 py-2 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: "#2563EB", color: "white" }}
                  >
                    Nâng cấp ngay
                  </button>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <Calendar size={13} color="#9CA3AF" />
                      <span style={{ fontSize: 13, color: "#6B7280" }}>{item.date} · {item.time}</span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: TYPE_COLORS[item.type] + "22", color: TYPE_COLORS[item.type] }}
                    >
                      {item.type}
                    </span>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>⏱ {item.duration}</span>
                  </div>
                  <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.5 }} className="line-clamp-2">
                    {item.preview}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-blue-50"
                  style={{ border: "1.5px solid #2563EB", color: "#2563EB" }}
                >
                  <Eye size={14} /> Xem
                </button>
                {item.locked ? (
                  <button
                    onClick={() => navigate("/upgrade")}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold"
                    style={{ backgroundColor: "#f3f4f6", color: "#9CA3AF" }}
                  >
                    <Lock size={14} /> Xuất file
                  </button>
                ) : (
                  <button
                    className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-green-50"
                    style={{ border: "1.5px solid #16A34A", color: "#16A34A" }}
                  >
                    <Download size={14} /> Xuất file
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
