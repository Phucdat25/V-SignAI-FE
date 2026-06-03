import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Menu, X } from "lucide-react";

const image_6bcfb9ad6a37e4385292e31219fa90429f4d1bd0 =
  "https://res.cloudinary.com/dinw9zchn/image/upload/v1780503696/z7897842107211_8ae108e28ddcd9595e1991d52dde7862_gwhpti.jpg";
interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = ["/dashboard", "/conversation", "/signs", "/history", "/upgrade", "/profile"].some(p => location.pathname.startsWith(p));

  return (
    <nav
      style={{ backgroundColor: transparent ? "transparent" : "#ffffff" }}
      className={`w-full z-50 ${transparent ? "absolute top-0 left-0" : "sticky top-0 shadow-sm border-b border-gray-100"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 bg-[#00000000]">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={image_6bcfb9ad6a37e4385292e31219fa90429f4d1bd0} 
              alt="V-Sign AI Logo" 
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className="text-xl" style={{ color: transparent ? "white" : "#1F2937", fontWeight: 700 }}>V-Sign AI</span>
          </Link>

          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8">
              <a href="#tinh-nang" className="text-sm" style={{ color: transparent ? "rgba(255,255,255,0.85)" : "#6B7280" }}>
                Tính năng
              </a>
              <a href="#bang-gia" className="text-sm" style={{ color: transparent ? "rgba(255,255,255,0.85)" : "#6B7280" }}>
                Bảng giá
              </a>
              <Link to="/login" className="text-sm" style={{ color: transparent ? "rgba(255,255,255,0.85)" : "#6B7280" }}>
                Đăng nhập
              </Link>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl text-white text-sm shadow-md hover:opacity-90 transition-all"
                style={{ backgroundColor: "#2563EB" }}
              >
                Dùng miễn phí
              </button>
            </div>
          )}

          {isDashboard && (
            <div className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-sm" style={{ color: location.pathname === "/dashboard" ? "#2563EB" : "#6B7280", fontWeight: location.pathname === "/dashboard" ? 600 : 400 }}>
                Trang chủ
              </Link>
              <Link to="/conversation" className="text-sm" style={{ color: location.pathname === "/conversation" ? "#2563EB" : "#6B7280", fontWeight: location.pathname === "/conversation" ? 600 : 400 }}>
                Hội thoại
              </Link>
              {/* <Link to="/signs" className="text-sm" style={{ color: location.pathname === "/signs" ? "#2563EB" : "#6B7280", fontWeight: location.pathname === "/signs" ? 600 : 400 }}>
                Ký hiệu
              </Link> */}
              <Link to="/history" className="text-sm" style={{ color: location.pathname === "/history" ? "#2563EB" : "#6B7280", fontWeight: location.pathname === "/history" ? 600 : 400 }}>
                Lịch sử
              </Link>
              <Link to="/profile">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "#2563EB" }}>
                  N
                </div>
              </Link>
            </div>
          )}

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} color={transparent ? "white" : "#1F2937"} /> : <Menu size={24} color={transparent ? "white" : "#1F2937"} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white rounded-xl shadow-lg mb-4 p-4 flex flex-col gap-3">
            {!isDashboard ? (
              <>
                <a href="#tinh-nang" className="text-sm py-2" style={{ color: "#6B7280" }}>Tính năng</a>
                <a href="#bang-gia" className="text-sm py-2" style={{ color: "#6B7280" }}>Bảng giá</a>
                <Link to="/login" className="text-sm py-2" style={{ color: "#6B7280" }}>Đăng nhập</Link>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-3 rounded-xl text-white text-sm"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  Dùng miễn phí
                </button>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-sm py-2" style={{ color: "#1F2937" }}>Trang chủ</Link>
                <Link to="/conversation" className="text-sm py-2" style={{ color: "#1F2937" }}>Hội thoại</Link>
                {/* <Link to="/signs" className="text-sm py-2" style={{ color: "#1F2937" }}>Ký hiệu</Link> */}
                <Link to="/history" className="text-sm py-2" style={{ color: "#1F2937" }}>Lịch sử</Link>
                <Link to="/profile" className="text-sm py-2" style={{ color: "#1F2937" }}>Hồ sơ</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
