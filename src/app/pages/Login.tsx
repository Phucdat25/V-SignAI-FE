import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { login as loginApi, loginWithGoogle, ApiError, getAuthRole, isAdminRole, syncAdminAuth, formatUserPlan, type LoginRequest } from "../api";
import { Navbar } from "../components/Navbar";

// Google Sign-In types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: GoogleInitializeConfig) => void;
          renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleInitializeConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleButtonConfig {
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  width?: number;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signup_with';
}

const logoImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%232563EB'/%3E%3C/svg%3E";

export function Login() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authDebug, setAuthDebug] = useState<any>(null);

  // Google Sign-In callback
  const handleGoogleCallback = async (response: GoogleCredentialResponse) => {
    setError("");
    setGoogleLoading(true);

    try {
      const authResponse = await loginWithGoogle({ idToken: response.credential });
      console.log("Login - Google Auth Response:", authResponse);
      setAuthDebug(authResponse);
      const role = getAuthRole(authResponse);
      console.log("Login - Google Role:", role);
      syncAdminAuth(role);

      if (isAdminRole(role)) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Đăng nhập Google thất bại");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Initialize Google Sign-In
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (googleClientId && window.google) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCallback,
      });
    }
  }, []);

  // Render Google Sign-In button
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (googleClientId && window.google) {
      const buttonElement = document.getElementById('google-signin-btn');
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'outline',
          size: 'large',
          width: buttonElement.offsetWidth || 400,
          text: 'continue_with'
        });
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: LoginRequest = { email, password };
      const authResponse = await loginApi(payload);
      console.log("Login - Email/Password Auth Response:", authResponse);
      setAuthDebug(authResponse);
      const role = getAuthRole(authResponse);
      console.log("Login - Email/Password Role:", role);
      syncAdminAuth(role);

      if (isAdminRole(role)) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      // Trigger Google Sign-In prompt
      if (window.google) {
        window.google.accounts.id.prompt();
      } else {
        throw new Error("Google Sign-In chưa được tải");
      }
    } catch (err) {
      setGoogleLoading(false);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(err instanceof Error ? err.message : "Không thể khởi tạo Google Sign-In");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #dbeafe 100%)" }}
    >
      {/* <Navbar transparent={true} /> */}
      <div className="flex items-center justify-center p-4 flex-1">
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
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-bold shadow-md hover:opacity-90 transition-all disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "#2563EB", fontSize: 16 }}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }} />
            <span style={{ fontSize: 13, color: "#9CA3AF" }}>hoặc tiếp tục với</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#e5e7eb" }} />
          </div>

          <div
            id="google-signin-btn"
            className="w-full flex justify-center"
          ></div>

          {error ? (
            <div className="mb-4 rounded-xl bg-red-100 p-3 text-sm text-red-700">{error}</div>
          ) : null}

          {authDebug && (
            <div className="mb-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700" style={{ border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>DEBUG AUTH RESPONSE</div>
              <div>Email: {authDebug.email || "-"}</div>
              <div>FullName: {authDebug.fullName || authDebug.user?.fullName || "-"}</div>
              <div>Role: {authDebug.role || authDebug.user?.role || "-"}</div>
              <div>Plan: {formatUserPlan(authDebug.plan || authDebug.user?.plan)}</div>
              <div style={{ marginTop: 8, whiteSpace: "pre-wrap", fontSize: 12, color: "#6B7280" }}>
                {JSON.stringify(authDebug, null, 2)}
              </div>
            </div>
          )}

          <p className="text-center mt-6" style={{ fontSize: 14, color: "#6B7280" }}>
            Chưa có tài khoản?{" "}
            <button onClick={() => navigate("/register")} style={{ color: "#2563EB", fontWeight: 600 }}>
              Đăng ký miễn phí
            </button>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
