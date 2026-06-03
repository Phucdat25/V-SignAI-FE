import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  History,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { getAuthToken, clearAuthToken, getUserInfo, getAuthRole, isAdminRole, clearUserInfo } from "../api";

const logoImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%232563EB'/%3E%3C/svg%3E";

interface AdminLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Tổng quan", path: "/admin" },
  { icon: Users, label: "Quản lý người dùng", path: "/admin/users" },
  // { icon: Database, label: "Dữ liệu ngôn ngữ ký hiệu", path: "/admin/dataset" },
  { icon: History, label: "Lịch sử", path: "/admin/translations" },
  { icon: BarChart3, label: "Phân tích", path: "/admin/analytics" },
  { icon: CreditCard, label: "Gói đăng ký", path: "/admin/subscriptions" },
  { icon: Settings, label: "Cài đặt", path: "/admin/settings" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return;
    }
    
    const user = getUserInfo();
    const role = user?.role;
    
    if (!isAdminRole(role)) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogout = () => {
    clearAuthToken();
    clearUserInfo();
    navigate("/login");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ backgroundColor: "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: 240, backgroundColor: "white", borderRight: "1px solid #e5e7eb" }}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <img
              src={logoImg}
              alt="V-Sign AI Logo"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="font-bold text-base" style={{ color: "#1F2937" }}>
                V-Sign AI
              </h1>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Bảng Quản Trị
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
                  style={{
                    backgroundColor: isActive ? "#EFF6FF" : "transparent",
                    color: isActive ? "#2563EB" : "#6B7280",
                  }}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all w-full mt-8"
            style={{ color: "#DC2626" }}
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-60">
        {/* Header */}
        <header
          className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between gap-4"
          style={{ backgroundColor: "white", borderBottom: "1px solid #e5e7eb" }}
        >
          {/* Logo and Brand - visible on mobile when sidebar is closed */}
          <div className="flex items-center gap-4 lg:hidden ml-12">
            <div className="flex items-center gap-2">
              <img
                src={logoImg}
                alt="V-Sign AI Logo"
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="font-bold text-sm" style={{ color: "#1F2937" }}>
                  V-Sign AI
                </h1>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  Bảng Quản Trị
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-md lg:ml-0 hidden lg:block">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9CA3AF" }}
              />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm"
                style={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  color: "#1F2937",
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              className="px-3 py-2 rounded-lg text-sm border"
              style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
            >
              <option>VI</option>
              <option>EN</option>
            </select>

            <button
              className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: "#6B7280" }}
            >
              <Bell size={20} />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: "#2563EB" }}
              />
            </button>

            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)" }}
              >
                AD
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>
                  Admin
                </p>
                <p className="text-xs" style={{ color: "#9CA3AF" }}>
                  admin@vsign.ai
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}