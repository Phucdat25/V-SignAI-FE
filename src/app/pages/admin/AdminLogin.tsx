import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

const logoImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%232563EB'/%3E%3C/svg%3E";

export function AdminLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication check (in production, this would be a real API call)
    if (credentials.email === "admin@vsign.ai" && credentials.password === "admin123") {
      // Store admin session (in production, use proper authentication)
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else {
      setError("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
      }}
    >
      {/* Back to Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
        style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
      >
        <ArrowLeft size={18} />
        Quay lại trang chủ
      </button>

      <div
        className="w-full max-w-md rounded-3xl p-8 shadow-2xl"
        style={{ backgroundColor: "white" }}
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src={logoImg}
              alt="V-Sign AI Logo"
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#1F2937" }}>
            V-Sign AI Admin
          </h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Đăng nhập để truy cập Bảng Quản Trị
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div
              className="p-4 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
              Email
            </label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="admin@vsign.ai"
              required
              className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
              style={{
                border: "2px solid #e5e7eb",
                color: "#1F2937",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2563EB";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
              Mật khẩu
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl text-sm transition-all focus:outline-none focus:ring-2"
              style={{
                border: "2px solid #e5e7eb",
                color: "#1F2937",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2563EB";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 shadow-lg"
            style={{
              background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
              color: "white",
            }}
          >
            Đăng nhập Admin
          </button>
        </form>

        {/* Demo Credentials Info */}
        <div
          className="mt-6 p-4 rounded-xl"
          style={{ backgroundColor: "#EFF6FF", border: "1px solid #DBEAFE" }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: "#1E40AF" }}>
            THÔNG TIN ĐĂNG NHẬP DEMO:
          </p>
          <p className="text-xs" style={{ color: "#1E40AF" }}>
            Email: <span className="font-mono font-semibold">admin@vsign.ai</span>
          </p>
          <p className="text-xs" style={{ color: "#1E40AF" }}>
            Password: <span className="font-mono font-semibold">admin123</span>
          </p>
        </div>

        {/* Security Note */}
        <p className="text-xs text-center mt-6" style={{ color: "#9CA3AF" }}>
          🔒 Trang này chỉ dành cho quản trị viên. Mọi hoạt động đều được ghi lại.
        </p>
      </div>
    </div>
  );
}