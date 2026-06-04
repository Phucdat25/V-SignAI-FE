import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Mic, Hand, Sparkles, Volume2, Zap, BookOpen, CheckCircle, Star, ArrowRight, Building2, School, Landmark, Facebook } from "lucide-react";

const logoImg =
  "https://res.cloudinary.com/dinw9zchn/image/upload/v1780503696/z7897842107211_8ae108e28ddcd9595e1991d52dde7862_gwhpti.jpg";

const heroImg =
  "https://res.cloudinary.com/dinw9zchn/image/upload/v1780503696/z7897842107211_8ae108e28ddcd9595e1991d52dde7862_gwhpti.jpg";

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#ffffff" }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #2563EB 50%, #3b82f6 100%)",
          minHeight: "100vh",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        <Navbar transparent />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
                style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "white" }}
              >
                <Star size={14} fill="white" />
                Công nghệ AI tiên tiến
              </div>
              <h1
                className="mb-6"
                style={{ fontSize: 48, fontWeight: 800, color: "white", lineHeight: 1.15 }}
              >
                Giao tiếp<br />
                <span style={{ color: "#bfdbfe" }}>Không Rào Cản</span>
              </h1>
              <p className="mb-8 text-lg" style={{ color: "rgba(255,255,255,0.85)", lineHeight: 1.7, maxWidth: 480 }}>
                Công cụ giao tiếp hỗ trợ AI dành cho người khiếm thính tại Việt Nam. Kết nối người nghe và người điếc qua dịch thuật thời gian thực.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 rounded-xl text-base shadow-lg hover:opacity-90 transition-all"
                  style={{ backgroundColor: "white", color: "#2563EB", fontWeight: 700 }}
                >Bắt đầu</button>
                <button
                  onClick={() => {
                    const section = document.getElementById('cach-hoat-dong');
                    section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-8 py-4 rounded-xl text-base border-2 transition-all hover:bg-white/10"
                  style={{ borderColor: "rgba(255,255,255,0.5)", color: "white", fontWeight: 600 }}
                >Xem cách hoạt động</button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div
                className="rounded-3xl overflow-hidden shadow-2xl"
                style={{ aspectRatio: "4/3", background: "rgba(255,255,255,0.1)" }}
              >
                <img src={heroImg} alt="SignBridge" className="w-full h-full object-cover opacity-90" />
              </div>
            </div>
          </div>

          {/* Social Proof / Real World Use Cases */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="mb-4" style={{ fontSize: 32, fontWeight: 800, color: "white" }}>&nbsp;&nbsp;Có thể dùng trong nhiều môi trường thực tế</h2>
              <p className="max-w-3xl mx-auto" style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.7 }}>
                V-Sign AI hỗ trợ giao tiếp giữa người nghe và người khiếm thính trong nhiều bối cảnh khác nhau.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Building2 size={32} color="#2563EB" />,
                  title: "Bệnh viện",
                  desc: "Bác sĩ có thể giao tiếp với bệnh nhân khiếm thính nhanh chóng nhờ AI dịch ngôn ngữ ký hiệu sang văn bản và giọng nói."
                },
                {
                  icon: <School size={32} color="#2563EB" />,
                  title: "Trường học",
                  desc: "Hỗ trợ giáo viên và học sinh khiếm thính giao tiếp dễ dàng hơn trong lớp học với dịch ký hiệu thời gian thực."
                },
                {
                  icon: <Landmark size={32} color="#2563EB" />,
                  title: "Dịch vụ công",
                  desc: "Hỗ trợ giao tiếp tại ngân hàng, cơ quan hành chính và các điểm dịch vụ công."
                }
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  style={{ 
                    backgroundColor: "rgba(255,255,255,0.95)", 
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: "#EFF6FF" }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="mb-3" style={{ fontSize: 18, fontWeight: 700, color: "#1F2937" }}>
                    {item.title}
                  </h3>
                  <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How V-Sign AI Works - 4 Steps */}
      <div id="cach-hoat-dong" className="py-20" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="mb-4" style={{ fontSize: 36, fontWeight: 800, color: "#1F2937" }}>
              Cách V-Sign AI Hoạt Động
            </h2>
            <p className="max-w-3xl mx-auto" style={{ color: "#6B7280", fontSize: 16, lineHeight: 1.7 }}>
              Chỉ với vài bước đơn giản, V-Sign AI giúp kết nối người nghe và người khiếm thính trong thời gian thực.
            </p>
          </div>

          <div className="relative">
            {/* Progress Line */}
            <div 
              className="hidden md:block absolute top-20 left-0 right-0 h-1 mx-auto"
              style={{ 
                width: "calc(100% - 200px)", 
                left: "100px",
                background: "linear-gradient(to right, #2563EB 0%, #10B981 50%, #2563EB 100%)",
                opacity: 0.2
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {[
                { 
                  icon: <Mic size={36} color="#2563EB" />, 
                  step: "1", 
                  title: "Người nghe nói", 
                  desc: "Người nghe nói trực tiếp vào điện thoại. Hệ thống AI nhận diện giọng nói ngay lập tức.",
                  color: "#2563EB",
                  bgColor: "#EFF6FF"
                },
                { 
                  icon: <Sparkles size={36} color="#10B981" />, 
                  step: "2", 
                  title: "AI chuyển thành ngôn ngữ ký hiệu", 
                  desc: "AI phân tích nội dung và chuyển đổi thành ngôn ngữ ký hiệu trực quan để người khiếm thính hiểu.",
                  color: "#10B981",
                  bgColor: "#F0FDF4"
                },
                { 
                  icon: <Hand size={36} color="#2563EB" />, 
                  step: "3", 
                  title: "Người khiếm thính phản hồi", 
                  desc: "Người khiếm thính sử dụng ngôn ngữ ký hiệu trước camera để phản hồi.",
                  color: "#2563EB",
                  bgColor: "#EFF6FF"
                },
                { 
                  icon: <Volume2 size={36} color="#10B981" />, 
                  step: "4", 
                  title: "AI chuyển thành giọng nói", 
                  desc: "AI nhận diện ký hiệu và chuyển đổi thành giọng nói để người nghe hiểu.",
                  color: "#10B981",
                  bgColor: "#F0FDF4"
                },
              ].map((item, index) => (
                <div key={item.step} className="relative">
                  <div
                    className="rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full"
                    style={{ backgroundColor: "white" }}
                  >
                    {/* Step Number Badge */}
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
                      style={{ 
                        backgroundColor: item.color,
                        boxShadow: `0 0 0 8px ${item.bgColor}`
                      }}
                    >
                      <span style={{ color: "white", fontSize: 18, fontWeight: 800 }}>{item.step}</span>
                    </div>

                    {/* Icon */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: item.bgColor }}
                    >
                      {item.icon}
                    </div>

                    {/* Title */}
                    <h3 className="mb-3" style={{ fontSize: 18, fontWeight: 700, color: "#1F2937", lineHeight: 1.3 }}>
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>

                  {/* Arrow between steps (desktop only) */}
                  {index < 3 && (
                    <div className="hidden md:flex absolute top-16 -right-4 items-center justify-center z-20">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                      >
                        <ArrowRight size={16} color={index % 2 === 0 ? "#2563EB" : "#10B981"} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="tinh-nang" className="py-20" style={{ backgroundColor: "white" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center mb-3" style={{ fontSize: 32, fontWeight: 800, color: "#1F2937" }}>Tính năng nổi bật</h2>
          <p className="text-center mb-12" style={{ color: "#6B7280" }}>Tất cả những gì bạn cần để giao tiếp dễ tiếp cận</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap size={28} color="white" />,
                bg: "#2563EB",
                title: "Nhận diện giọng nói thời gian thực",
                desc: "Phiên âm tức thì với độ chính xác 99% cho tiếng Việt. Hiển thị chữ to dễ đọc.",
              },
              {
                icon: <Volume2 size={28} color="white" />,
                bg: "#16A34A",
                title: "Chuyển văn bản thành giọng nói",
                desc: "Người điếc gõ câu trả lời và ứng dụng đọc to bằng giọng Việt tự nhiên.",
              },
              {
                icon: <BookOpen size={28} color="white" />,
                bg: "#7c3aed",
                title: "Hỗ trợ ký hiệu ngôn ngữ",
                desc: "Thư viện ngôn ngữ ký hiệu Việt Nam toàn diện: sinh hoạt, bệnh viện, trường học, khẩn cấp.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
                style={{ border: "1px solid #e5e7eb" }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: f.bg }}>
                    {f.icon}
                  </div>
                  <h3 className="mb-2" style={{ fontSize: 18, fontWeight: 700, color: "#1F2937" }}>{f.title}</h3>
                  <p style={{ color: "#6B7280", fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="bang-gia" className="py-20" style={{ backgroundColor: "#EFF6FF" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-center mb-3" style={{ fontSize: 32, fontWeight: 800, color: "#1F2937" }}>Gói dịch vụ</h2>
          <p className="text-center mb-12" style={{ color: "#6B7280" }}>Bắt đầu miễn phí, nâng cấp khi cần thêm</p>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 - Free Plan */}
            <div className="rounded-2xl p-8 bg-white shadow-sm flex flex-col" style={{ border: "2px solid #e5e7eb" }}>
              <div className="flex-1">
                <div style={{ fontSize: 14, fontWeight: 700, color: "#6B7280", letterSpacing: 1 }} className="mb-2">MIỄN PHÍ</div>
                <div style={{ fontSize: 40, fontWeight: 800, color: "#1F2937" }}>0đ</div>
                <div style={{ color: "#6B7280", fontSize: 14 }} className="mb-6">Miễn phí mãi mãi</div>
                <div className="space-y-3 mb-6">
                  {["5 phút/ngày nhận diện", "10 cụm từ nhanh", "Thư viện ký hiệu cơ bản"].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle size={18} color="#16A34A" className="flex-shrink-0 mt-0.5" />
                      <span style={{ color: "#374151", fontSize: 15, lineHeight: 1.5, wordBreak: "break-word" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3.5 rounded-2xl transition-all hover:bg-blue-50"
                style={{ border: "2px solid #2563EB", color: "#2563EB", fontWeight: 700, fontSize: 15 }}
              >
                Bắt đầu ngay
              </button>
            </div>

            {/* Card 2 - Pro Plan (Most Popular) */}
            <div
              className="rounded-2xl p-8 shadow-xl relative overflow-hidden flex flex-col"
              style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)", color: "white" }}
            >
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#fbbf24", color: "#1F2937" }}>
                PHỔ BIẾN
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, opacity: 0.9 }} className="mb-2">CAO CẤP</div>
                <div style={{ fontSize: 40, fontWeight: 800 }}>79.000đ</div>
                <div style={{ opacity: 0.85, fontSize: 14 }} className="mb-6">mỗi tháng</div>
                <div className="space-y-3 mb-6">
                  {["Không giới hạn nhận diện", "50+ cụm từ nhanh", "Thư viện ký hiệu đầy đủ", "Lưu lịch sử hội thoại", "Không quảng cáo"].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle size={18} color="#bfdbfe" className="flex-shrink-0 mt-0.5" />
                      <span style={{ fontSize: 15, opacity: 0.95, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3.5 rounded-2xl font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: "white", color: "#2563EB", fontSize: 15 }}
              >
                Nâng cấp ngay
              </button>
            </div>

            {/* Card 3 - Annual Plan (Best Value) */}
            <div className="rounded-2xl p-8 shadow-xl relative overflow-hidden flex flex-col" style={{ background: "linear-gradient(135deg, #2563EB, #1d4ed8)", color: "white" }}>
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: "#10B981", color: "white" }}>
                TIẾT KIỆM NHẤT
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, opacity: 0.9 }} className="mb-2">CAO CẤP NĂM</div>
                <div style={{ fontSize: 40, fontWeight: 800 }}>799.000đ</div>
                <div style={{ opacity: 0.85, fontSize: 14 }} className="mb-6">mỗi năm</div>
                <div className="space-y-3 mb-6">
                  {["Tất cả tính năng gói Cao cấp", "Tiết kiệm hơn so với trả theo tháng", "Ưu tiên tốc độ AI", "Hỗ trợ sớm tính năng mới"].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle size={18} color="#bfdbfe" className="flex-shrink-0 mt-0.5" />
                      <span style={{ fontSize: 15, opacity: 0.95, lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3.5 rounded-2xl font-bold transition-all hover:opacity-90"
                style={{ backgroundColor: "white", color: "#2563EB", fontSize: 15 }}
              >
                Đăng ký năm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 text-center" style={{ backgroundColor: "#1F2937" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <img 
            src={logoImg} 
            alt="V-Sign AI Logo" 
            className="h-10 w-10 rounded-full object-cover"
            />
          <span style={{ color: "white", fontWeight: 700, fontSize: 18 }}>V-Sign AI</span>
        </div>
        <p style={{ color: "#9CA3AF", fontSize: 14, marginBottom: 12 }}>© 2026 V-Sign AI. Hỗ trợ cộng đồng người khiếm thính tại Việt Nam </p>
        
        {/* Social Media Links */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://facebook.com/vsignai"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:opacity-80"
            style={{ backgroundColor: "#2563EB" }}
            title="Theo dõi Facebook"
          >
            <Facebook size={20} color="white" />
          </a>
          
          <a
            href="https://www.tiktok.com/@vsign.ai4?_r=1&_t=ZS-96em2U4Yr9M"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:opacity-80"
            style={{ backgroundColor: "#000000" }}
            title="Theo dõi TikTok"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: "white" }}>
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.68v13.7a2.4 2.4 0 0 1-2.54 2.4H9.4a2.4 2.4 0 0 1-2.54-2.4 2.4 2.4 0 0 1 2.54-2.4h.09v-3.66a5.85 5.85 0 0 0-5.85 5.82 5.85 5.85 0 0 0 5.85 5.85 5.81 5.81 0 0 0 5.85-5.85V8.54a7.81 7.81 0 0 0 3.77 1.04v-3.7a4.83 4.83 0 0 1-.26-.15Z"/>
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
