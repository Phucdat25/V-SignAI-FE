import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { Search } from "lucide-react";

const signImg1 = "https://images.unsplash.com/photo-1509307191386-b0bf1fc15f9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWduJTIwbGFuZ3VhZ2UlMjBhbHBoYWJldCUyMGhhbmR8ZW58MXx8fHwxNzcyNTQ0NDM4fDA&ixlib=rb-4.1.0&q=80&w=400";
const signImg2 = "https://images.unsplash.com/photo-1758600588332-f115280edb2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kJTIwc2lnbiUyMGxhbmd1YWdlJTIwZ2VzdHVyZXxlbnwxfHx8fDE3NzI0NDc0NDd8MA&ixlib=rb-4.1.0&q=80&w=400";
const signImg3 = "https://images.unsplash.com/photo-1662580946467-9279de61ed99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWFmJTIwY29tbXVuaWNhdGlvbiUyMHNpZ24lMjBsYW5ndWFnZXxlbnwxfHx8fDE3NzI1NDQ0MzZ8MA&ixlib=rb-4.1.0&q=80&w=400";

const KY_HIEU = [
  { id: 1, phrase: "Xin chào", category: "Hàng ngày", img: signImg1 },
  { id: 2, phrase: "Cảm ơn", category: "Hàng ngày", img: signImg2 },
  { id: 3, phrase: "Xin lỗi", category: "Hàng ngày", img: signImg3 },
  { id: 4, phrase: "Tôi cần bác sĩ", category: "Bệnh viện", img: signImg1 },
  { id: 5, phrase: "Đau ở đây", category: "Bệnh viện", img: signImg2 },
  { id: 6, phrase: "Thuốc giảm đau", category: "Bệnh viện", img: signImg3 },
  { id: 7, phrase: "Thưa giáo viên", category: "Trường học", img: signImg2 },
  { id: 8, phrase: "Tôi không hiểu", category: "Trường học", img: signImg1 },
  { id: 9, phrase: "Bài tập về nhà", category: "Trường học", img: signImg3 },
  { id: 10, phrase: "Gọi cấp cứu", category: "Khẩn cấp", img: signImg1 },
  { id: 11, phrase: "Cần giúp đỡ", category: "Khẩn cấp", img: signImg2 },
  { id: 12, phrase: "Nguy hiểm!", category: "Khẩn cấp", img: signImg3 },
  { id: 13, phrase: "Tốt lắm", category: "Hàng ngày", img: signImg2 },
  { id: 14, phrase: "Không được", category: "Hàng ngày", img: signImg1 },
  { id: 15, phrase: "Vâng / Đồng ý", category: "Hàng ngày", img: signImg3 },
];

const TABS = ["Tất cả", "Hàng ngày", "Bệnh viện", "Trường học", "Khẩn cấp"];
const TAB_COLORS: Record<string, { bg: string; color: string }> = {
  "Tất cả": { bg: "#2563EB", color: "white" },
  "Hàng ngày": { bg: "#16A34A", color: "white" },
  "Bệnh viện": { bg: "#DC2626", color: "white" },
  "Trường học": { bg: "#7c3aed", color: "white" },
  "Khẩn cấp": { bg: "#d97706", color: "white" },
};

export function SignLibrary() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [selectedSign, setSelectedSign] = useState<typeof KY_HIEU[0] | null>(null);

  const filtered = KY_HIEU.filter((s) => {
    const matchSearch = s.phrase.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "Tất cả" || s.category === activeTab;
    return matchSearch && matchTab;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1F2937", marginBottom: 6 }}>📚 Thư viện ký hiệu</h1>
        <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 24 }}>Ngôn ngữ ký hiệu Việt Nam cho giao tiếp hàng ngày</p>

        {/* Tìm kiếm */}
        <div className="relative mb-5">
          <Search size={18} color="#9CA3AF" className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm ký hiệu..."
            className="w-full pl-12 pr-4 py-3 rounded-xl outline-none"
            style={{ border: "1.5px solid #e5e7eb", fontSize: 15, backgroundColor: "white" }}
            onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>

        {/* Tabs lọc */}
        <div className="flex gap-2 flex-wrap mb-6">
          {TABS.map((tab) => {
            const active = activeTab === tab;
            const c = TAB_COLORS[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: active ? c.bg : "white",
                  color: active ? c.color : "#6B7280",
                  border: `1.5px solid ${active ? c.bg : "#e5e7eb"}`,
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Lưới ký hiệu */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((sign) => (
            <button
              key={sign.id}
              onClick={() => setSelectedSign(sign)}
              className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all text-left"
              style={{
                backgroundColor: "white",
                border: selectedSign?.id === sign.id ? "2px solid #2563EB" : "1px solid #e5e7eb",
              }}
            >
              <div style={{ height: 140, overflow: "hidden" }}>
                <img src={sign.img} alt={sign.phrase} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1F2937" }}>{sign.phrase}</p>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1"
                  style={{
                    backgroundColor: TAB_COLORS[sign.category].bg + "22",
                    color: TAB_COLORS[sign.category].bg,
                  }}
                >
                  {sign.category}
                </span>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p style={{ fontSize: 16, color: "#9CA3AF" }}>Không tìm thấy ký hiệu cho "{search}"</p>
          </div>
        )}

        {selectedSign && (
          <div
            className="fixed bottom-6 right-6 rounded-2xl shadow-2xl p-4 flex gap-4 items-center"
            style={{ backgroundColor: "white", border: "2px solid #2563EB", maxWidth: 320, zIndex: 100 }}
          >
            <img src={selectedSign.img} alt={selectedSign.phrase} className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#1F2937" }}>{selectedSign.phrase}</p>
              <p style={{ fontSize: 13, color: "#6B7280" }}>{selectedSign.category}</p>
            </div>
            <button onClick={() => setSelectedSign(null)} style={{ color: "#9CA3AF", marginLeft: "auto" }}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
}
