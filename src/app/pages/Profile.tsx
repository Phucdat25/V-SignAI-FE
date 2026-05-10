import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { LogOut, ChevronRight, Moon, Sun, Shield, Bell, HelpCircle } from "lucide-react";
import { getUserInfo, logout, formatUserPlan } from "../api";

export function Profile() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string; plan?: string } | null>(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo) {
      setUser({
        name: userInfo.name,
        email: userInfo.email,
        plan: userInfo.plan,
      });
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1F2937", marginBottom: 24 }}>👤 Hồ sơ</h1>

        {/* Thẻ avatar */}
        <div
          className="rounded-3xl p-6 mb-6 flex items-center gap-5 shadow-sm"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1F2937" }}>{user?.name || "Người dùng"}</h2>
            <p style={{ fontSize: 14, color: "#6B7280", marginTop: 2 }}>{user?.email || "email@example.com"}</p>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}>
                {formatUserPlan(user?.plan)}
              </span>
              <button
                onClick={() => navigate("/upgrade")}
                className="px-3 py-1 rounded-full text-xs font-bold hover:opacity-90 transition-all"
                style={{ backgroundColor: "#2563EB", color: "white" }}
              >
                Nâng cấp →
              </button>
            </div>
          </div>
        </div>

        {/* Cài đặt */}
        <div className="rounded-3xl overflow-hidden shadow-sm mb-4" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
          <div className="px-5 py-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1 }}>TÙY CHỈNH</p>
          </div>

          {/* Chế độ tối */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f3f4f6" }}>
                {darkMode ? <Moon size={20} color="#6B7280" /> : <Sun size={20} color="#d97706" />}
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#1F2937" }}>Chế độ tối</p>
                <p style={{ fontSize: 12, color: "#6B7280" }}>Chuyển sang giao diện tối</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="relative rounded-full transition-all"
              style={{ width: 48, height: 26, backgroundColor: darkMode ? "#2563EB" : "#d1d5db", flexShrink: 0 }}
            >
              <div
                className="absolute top-1 rounded-full transition-all"
                style={{ width: 18, height: 18, backgroundColor: "white", left: darkMode ? 26 : 4, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
              />
            </button>
          </div>

          {/* Thông báo */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#f0fdf4" }}>
                <Bell size={20} color="#16A34A" />
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#1F2937" }}>Thông báo</p>
                <p style={{ fontSize: 12, color: "#6B7280" }}>Thông báo đẩy và email</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className="relative rounded-full transition-all"
              style={{ width: 48, height: 26, backgroundColor: notifications ? "#2563EB" : "#d1d5db", flexShrink: 0 }}
            >
              <div
                className="absolute top-1 rounded-full transition-all"
                style={{ width: 18, height: 18, backgroundColor: "white", left: notifications ? 26 : 4, boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
              />
            </button>
          </div>
        </div>

        {/* Tùy chọn khác */}
        <div className="rounded-3xl overflow-hidden shadow-sm mb-6" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
          {[
            { icon: <Shield size={18} color="#2563EB" />, bg: "#EFF6FF", label: "Quyền riêng tư & Bảo mật" },
            { icon: <HelpCircle size={18} color="#7c3aed" />, bg: "#faf5ff", label: "Trợ giúp & Hỗ trợ" },
          ].map((item, i) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
              style={{ borderBottom: i === 0 ? "1px solid #f3f4f6" : "none" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.bg }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#1F2937", flex: 1, textAlign: "left" }}>
                {item.label}
              </span>
              <ChevronRight size={18} color="#9CA3AF" />
            </button>
          ))}
        </div>

        {/* Đăng xuất */}
        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all hover:opacity-90"
          style={{ backgroundColor: "#fee2e2", color: "#DC2626", fontSize: 15 }}
        >
          <LogOut size={18} />
          Đăng xuất
        </button>

        <p className="text-center mt-6" style={{ fontSize: 12, color: "#9CA3AF" }}>
          SignBridge v1.0.0 · Hỗ trợ cộng đồng Việt Nam 🇻🇳
        </p>
      </div>
    </div>
  );
}
