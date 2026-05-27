import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { getUserInfo, formatUserPlan } from "../api";
import { initiatePayment, redirectToVNPay } from "../api/payment";
import { CheckCircle, X, Zap } from "lucide-react";

export function Upgrade() {
  const navigate = useNavigate();
  const [upgraded, setUpgraded] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userInfo = getUserInfo();
    setCurrentPlan(userInfo?.plan || "FREE");
  }, []);

  const normalizedCurrentPlan = currentPlan?.trim().toUpperCase() || "FREE";
  const isCurrentPlanFree = normalizedCurrentPlan === "FREE";
  const isCurrentPlanProMonth = normalizedCurrentPlan.includes("PRO") && normalizedCurrentPlan.includes("MONTH");
  const isCurrentPlanProYear = normalizedCurrentPlan.includes("PRO") && normalizedCurrentPlan.includes("YEAR");

  const handleUpgrade = async (packageType: "PRO_MONTH" | "PRO_YEAR") => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await initiatePayment(packageType);
      
      if (response.paymentUrl) {
        // Redirect to VNPay
        redirectToVNPay(response.paymentUrl);
      } else {
        setError("Không thể khởi tạo thanh toán. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4"
            style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}
          >
            <Zap size={14} />
            Nâng cao trải nghiệm của bạn
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1F2937" }}>Chọn gói của bạn</h1>
          <p style={{ color: "#6B7280", fontSize: 16, marginTop: 8 }}>Mở khóa toàn bộ tính năng không giới hạn</p>
          {currentPlan && (
            <div
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full"
              style={{ backgroundColor: "#f8fafc", color: "#2563eb", border: "1px solid #dbeafe" }}
            >
              Gói hiện tại: <strong>{formatUserPlan(currentPlan)}</strong>
            </div>
          )}
        </div>

        {upgraded && (
          <div
            className="rounded-2xl p-4 mb-8 flex items-center gap-3 justify-center"
            style={{ backgroundColor: "#f0fdf4", border: "1.5px solid #86efac" }}
          >
            <CheckCircle size={20} color="#16A34A" />
            <span style={{ color: "#15803d", fontWeight: 700 }}>🎉 Đã nâng cấp Premium! Đang chuyển về trang chủ...</span>
          </div>
        )}

        {error && (
          <div
            className="rounded-2xl p-4 mb-8 flex items-center gap-3 justify-center"
            style={{ backgroundColor: "#fef2f2", border: "1.5px solid #fca5a5" }}
          >
            <X size={20} color="#DC2626" />
            <span style={{ color: "#991b1b", fontWeight: 700 }}>{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* MIỄN PHÍ */}
          <div
            className="rounded-3xl p-8 shadow-sm"
            style={{
              backgroundColor: "white",
              border: isCurrentPlanFree ? "2px solid #22c55e" : "1.5px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", letterSpacing: 2, marginBottom: 8 }}>MIỄN PHÍ</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#1F2937", lineHeight: 1 }}>0₫</div>
            <div style={{ color: "#6B7280", fontSize: 14, marginBottom: 28, marginTop: 4 }}>Miễn phí mãi mãi</div>

            {[
              { label: "5 phút/ngày nhận diện giọng nói", ok: true },
              { label: "10 cụm từ nhanh", ok: true },
              { label: "Thư viện ký hiệu cơ bản", ok: true },
              { label: "Lưu lịch sử", ok: false },
              { label: "Xuất hội thoại", ok: false },
              { label: "Không quảng cáo", ok: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 mb-3">
                {item.ok ? (
                  <CheckCircle size={18} color="#16A34A" />
                ) : (
                  <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "#f3f4f6" }}>
                    <X size={10} color="#9CA3AF" />
                  </div>
                )}
                <span style={{ fontSize: 14, color: item.ok ? "#374151" : "#9CA3AF" }}>{item.label}</span>
              </div>
            ))}

            <button
              className="w-full mt-8 py-4 rounded-xl border-2 text-sm font-bold transition-all"
              style={{
                borderColor: isCurrentPlanFree ? "#22c55e" : "#2563EB",
                color: isCurrentPlanFree ? "#ffffff" : "#2563EB",
                backgroundColor: isCurrentPlanFree ? "#16a34a" : "white",
              }}
            >
              {isCurrentPlanFree ? "Gói hiện tại" : "Giữ nguyên miễn phí"}
            </button>
          </div>

          {/* CAO CẤP THÁNG */}
          <div
            className="rounded-3xl p-8 shadow-xl relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #1e40af 0%, #2563EB 50%, #3b82f6 100%)",
              color: "white",
              border: isCurrentPlanProMonth ? "2px solid #22c55e" : "none",
            }}
          >
            <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            <div className="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#fbbf24", color: "#1F2937" }}>
              ⚡ PHỔ BIẾN
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.7, marginBottom: 8 }}>CAO CẤP</div>
              <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>79.000₫</div>
              <div style={{ opacity: 0.7, fontSize: 14, marginBottom: 28, marginTop: 4 }}>mỗi tháng</div>

              {[
                "Nhận diện giọng nói không giới hạn",
                "50+ cụm từ nhanh",
                "Thư viện ký hiệu đầy đủ",
                "Lưu toàn bộ lịch sử",
                "Xuất hội thoại",
                "Không quảng cáo",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 mb-3">
                  <CheckCircle size={18} color="#bfdbfe" />
                  <span style={{ fontSize: 14, opacity: 0.9 }}>{item}</span>
                </div>
              ))}

              <button
                onClick={() => handleUpgrade("PRO_MONTH")}
                disabled={isCurrentPlanProMonth || isLoading}
                className="w-full mt-8 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isCurrentPlanProMonth ? "#22c55e" : "white",
                  color: isCurrentPlanProMonth ? "white" : "#2563EB",
                  fontSize: 16,
                }}
              >
                {isCurrentPlanProMonth 
                  ? "Gói hiện tại" 
                  : isLoading 
                  ? "Đang xử lý..." 
                  : upgraded 
                  ? "✓ Đã nâng cấp!" 
                  : "Nâng cấp ngay – 79.000₫/tháng"}
              </button>
              <p style={{ fontSize: 12, opacity: 0.6, textAlign: "center", marginTop: 12 }}>
                Hủy bất cứ lúc nào · Không phí ẩn
              </p>
            </div>
          </div>

          {/* CAO CẤP NĂM */}
          <div
            className="rounded-3xl p-8 shadow-xl relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #1e40af 0%, #2563EB 50%, #3b82f6 100%)",
              color: "white",
              border: isCurrentPlanProYear ? "2px solid #22c55e" : "none",
            }}
          >
            <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ position: "absolute", bottom: -30, left: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
            <div className="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#10B981", color: "white" }}>
              💰 TIẾT KIỆM NHẤT
            </div>

            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.7, marginBottom: 8 }}>CAO CẤP NĂM</div>
              <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1 }}>799.000₫</div>
              <div style={{ opacity: 0.7, fontSize: 14, marginBottom: 28, marginTop: 4 }}>mỗi năm</div>

              {[
                "Tất cả tính năng gói Cao cấp",
                "Tiết kiệm hơn so với trả theo tháng",
                "Ưu tiên tốc độ AI",
                "Hỗ trợ sớm tính năng mới",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 mb-3">
                  <CheckCircle size={18} color="#bfdbfe" />
                  <span style={{ fontSize: 14, opacity: 0.9 }}>{item}</span>
                </div>
              ))}

              <button
                onClick={() => handleUpgrade("PRO_YEAR")}
                disabled={isCurrentPlanProYear || isLoading}
                className="w-full mt-20 py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isCurrentPlanProYear ? "#22c55e" : "white",
                  color: isCurrentPlanProYear ? "white" : "#2563EB",
                  fontSize: 16,
                }}
              >
                {isCurrentPlanProYear 
                  ? "Gói hiện tại" 
                  : isLoading 
                  ? "Đang xử lý..." 
                  : upgraded 
                  ? "✓ Đã nâng cấp!" 
                  : "Đăng ký năm – 799.000₫"}
              </button>
              <p style={{ fontSize: 12, opacity: 0.6, textAlign: "center", marginTop: 12 }}>
                Hủy bất cứ lúc nào · Tiết kiệm 89.000₫/năm
              </p>
            </div>
          </div>
        </div>

        {/* Câu hỏi thường gặp */}
        <div className="mt-12">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1F2937", marginBottom: 16, textAlign: "center" }}>
            Câu hỏi thường gặp
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { q: "Tôi có thể hủy bất cứ lúc nào không?", a: "Có, bạn có thể hủy đăng ký bất cứ lúc nào mà không bị phạt." },
              { q: "Độ chính xác nhận diện giọng nói?", a: "AI đạt độ chính xác 99% với tối ưu hóa cho tiếng Việt." },
              { q: "Dữ liệu của tôi có an toàn không?", a: "Tất cả hội thoại đều được mã hóa và lưu trữ an toàn. Chúng tôi không chia sẻ dữ liệu." },
              { q: "Ứng dụng có hoạt động offline không?", a: "Thư viện ký hiệu cơ bản hoạt động offline. Nhận diện giọng nói cần internet." },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", marginBottom: 6 }}>{item.q}</p>
                <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}