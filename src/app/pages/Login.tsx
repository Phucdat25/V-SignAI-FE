import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";

const logoImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%232563EB'/%3E%3C/svg%3E";

export function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #dbeafe 100%)" }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img 
              src={logoImg} 
              alt="V-Sign AI Logo" 
              className="h-12 w-12 object-contain"
            />
            <span style={{ fontSize: 26, fontWeight: 800, color: "#1F2937" }}>V-Sign AI</span>
          </Link>
          <p className="mt-2" style={{ color: "#6B7280", fontSize: 15 }}>Chào mừng trở lại! Đăng nhập để tiếp tục.</p>
        </div>

        <div className="rounded-3xl p-8 shadow-xl" style={{ backgroundColor: "white" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1F2937", marginBottom: 24 }}>Đăng nhập</h2>

          <form onSubmit={handleLogin}>
            <div className="mb-5">
              <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ban@email.com"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{ border: "1.5px solid #e5e7eb", fontSize: 15, color: "#1F2937" }}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <div className="mb-6">
              <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all pr-12"
                  style={{ border: "1.5px solid #e5e7eb", fontSize: 15, color: "#1F2937" }}
                  onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                  onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <a href="#" style={{ fontSize: 13, color: "#2563EB" }}>Quên mật khẩu?</a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-white font-bold shadow-md hover:opacity-90 transition-all"
              style={{ backgroundColor: "#2563EB", fontSize: 16 }}
            >
              Đăng nhập
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }} />
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>hoặc tiếp tục với</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }} />
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-3 border transition-all hover:bg-gray-50"
            style={{ border: "1.5px solid #e5e7eb", color: "#374151", fontSize: 15, fontWeight: 600 }}
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.6 33.1 30.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 2.9l6.3-6.3C34.5 5.9 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.2-2.7-.5-4z" />
              <path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16 19.2 13 24 13c3.1 0 5.8 1.1 8 2.9l6.3-6.3C34.5 5.9 29.6 4 24 4c-7.6 0-14.2 4.3-17.7 10.7z" />
              <path fill="#FBBC05" d="M24 44c5.9 0 11.1-2 14.9-5.3l-6.9-5.6C29.8 35 27 36 24 36c-6.2 0-10.6-2.9-11.8-7.5l-7 5.4C8 40.3 15.4 44 24 44z" />
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-.9 2.6-2.7 4.8-5.1 6.3l6.9 5.6c4-3.8 6.4-9.4 6.4-16.4 0-1.3-.2-2.7-.5-4z" />
            </svg>
            Tiếp tục với Google
          </button>

          <p className="text-center mt-6" style={{ fontSize: 14, color: "#6B7280" }}>
            Chưa có tài khoản?{" "}
            <button onClick={() => navigate("/dashboard")} style={{ color: "#2563EB", fontWeight: 600 }}>
              Đăng ký miễn phí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
