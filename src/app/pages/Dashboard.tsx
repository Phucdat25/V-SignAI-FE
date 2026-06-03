import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { RecentConversations } from "../components/RecentConversations";
import { MessageSquare, BookOpen, History, Zap, Mic, TrendingUp, Bell } from "lucide-react";
import { getUserInfo, getTodayUsage, getAuthToken } from "../api";

export function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [usedSeconds, setUsedSeconds] = useState(0);
  const [limitSeconds, setLimitSeconds] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [loadingUsage, setLoadingUsage] = useState(true);

  useEffect(() => {
    const user = getUserInfo();
    console.log("Dashboard - User Info:", user);
    if (user) {
      console.log("Dashboard - User Name:", user.name);
      setUserName(user.name || "User");
      setUserPlan(user.plan || "FREE");
    } else {
      console.warn("Dashboard - No user info found in localStorage");
    }

    // Fetch usage data
    const fetchUsage = async () => {
      try {
        setLoadingUsage(true);
        const token = getAuthToken();
        console.log("Dashboard - Auth token before API call:", token ? token.substring(0, 20) + "..." : "null");
        
        if (!token) {
          console.warn("Dashboard - No auth token available, skipping usage fetch");
          setUsedSeconds(0);
          setLimitSeconds(180);
          setRemainingSeconds(180);
          setLoadingUsage(false);
          return;
        }
        
        const usage = await getTodayUsage();
        console.log("Dashboard - Usage Data:", usage);
        
        setUsedSeconds(usage.usedSeconds);
        setLimitSeconds(usage.limitSeconds);
        setRemainingSeconds(usage.remainingSeconds);
      } catch (error) {
        console.error("Dashboard - Error fetching usage:", error);
        // Fallback values if API fails
        setUsedSeconds(0);
        setLimitSeconds(180);
        setRemainingSeconds(180);
      } finally {
        setLoadingUsage(false);
      }
    };

    fetchUsage();
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Chào */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1F2937" }}>Xin chào, {userName}!</h1>
          </div>
        </div>

        {/* Bắt đầu hội thoại */}
        <div
          className="rounded-3xl p-8 mb-6 shadow-lg relative overflow-hidden cursor-pointer hover:opacity-95 transition-all"
          style={{ background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)" }}
          onClick={() => navigate("/conversation")}
        >
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: -30, right: 60, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
              <Mic size={32} color="white" />
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "white" }}>Bắt đầu hội thoại</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, marginTop: 6 }}>
              Chuyển giọng nói thành chữ thời gian thực với hỗ trợ ký hiệu ngôn ngữ
            </p>
            <button
              className="mt-6 px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all"
              style={{ backgroundColor: "white", color: "#2563EB", fontSize: 15 }}
            >
              Mở hội thoại →
            </button>
          </div>
        </div>

        {/* Sử dụng hôm nay - Only show for FREE plan */}
        {(!userPlan || userPlan.toUpperCase() === "FREE") && (
          <div className="rounded-2xl p-6 mb-6 shadow-sm" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} color="#2563EB" />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1F2937" }}>Sử dụng hôm nay</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}>
                Gói miễn phí
              </span>
            </div>
            <div>
              {loadingUsage ? (
                <div style={{ fontSize: 14, color: "#6B7280" }}>Đang tải dữ liệu...</div>
              ) : (
                <>
                  <div className="flex justify-between mb-2">
                    <span style={{ fontSize: 14, color: "#374151" }}>Thời gian nhận diện</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>
                      {usedSeconds} / {limitSeconds} giây
                    </span>
                  </div>
                  <div className="w-full rounded-full h-3" style={{ backgroundColor: "#e5e7eb" }}>
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${limitSeconds > 0 ? (usedSeconds / limitSeconds) * 100 : 0}%`,
                        background: "linear-gradient(90deg, #2563EB, #60a5fa)",
                      }}
                    />
                  </div>
                  <p style={{ fontSize: 12, color: "#6B7280", marginTop: 6 }}>
                    Còn {remainingSeconds} giây hôm nay
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Lối tắt */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <MessageSquare size={24} color="#2563EB" />, bg: "#EFF6FF", label: "Hội thoại", path: "/conversation" },
            { icon: <BookOpen size={24} color="#16A34A" />, bg: "#f0fdf4", label: "Thư viện ký hiệu", path: "/signs" },
            { icon: <History size={24} color="#7c3aed" />, bg: "#faf5ff", label: "Lịch sử", path: "/history" },
            { icon: <Zap size={24} color="#d97706" />, bg: "#fffbeb", label: "Nâng cấp", path: "/upgrade" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="rounded-2xl p-6 flex flex-col items-center gap-3 hover:shadow-md transition-all"
              style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.bg }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>{item.label}</span>
            </button>
          ))}
        </div>

        <RecentConversations title="Hội thoại gần đây" variant="dashboard" />
      </div>
    </div>
  );
}
