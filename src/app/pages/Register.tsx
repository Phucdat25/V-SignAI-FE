import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { register as registerApi, ApiError, type RegisterRequest } from "../api";
import { Navbar } from "../components/Navbar";

const logoImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%232563EB'/%3E%3C/svg%3E";

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: RegisterRequest = { name, email, password };
      await registerApi(payload);
      navigate("/login");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Lỗi đăng ký");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #dbeafe 100%)" }}
    >
        <div className="flex items-center justify-center p-4 flex-1">
        <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={logoImg} alt="V-Sign AI Logo" className="h-12 w-12 object-contain" />
            <span style={{ fontSize: 26, fontWeight: 800, color: "#1F2937" }}>V-Sign AI</span>
          </Link>
          <p className="mt-2" style={{ color: "#6B7280", fontSize: 15 }}>
            Tạo tài khoản mới và bắt đầu sử dụng dịch vụ.
          </p>
        </div>

        <div className="rounded-3xl p-8 shadow-xl" style={{ backgroundColor: "white" }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#1F2937", marginBottom: 24 }}>Đăng ký</h2>

          {error ? (
            <div className="mb-4 rounded-xl bg-red-100 p-3 text-sm text-red-700">{error}</div>
          ) : null}

          <form onSubmit={handleRegister}>
            <div className="mb-5">
              <label style={{ fontSize: 14, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                Họ và tên
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{ border: "1.5px solid #e5e7eb", fontSize: 15, color: "#1F2937" }}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{ border: "1.5px solid #e5e7eb", fontSize: 15, color: "#1F2937" }}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-bold shadow-md hover:opacity-90 transition-all disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "#2563EB", fontSize: 16 }}
            >
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>

          <p className="text-center mt-6" style={{ fontSize: 14, color: "#6B7280" }}>
            Đã có tài khoản? <Link to="/login" style={{ color: "#2563EB", fontWeight: 600 }}>Đăng nhập</Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
