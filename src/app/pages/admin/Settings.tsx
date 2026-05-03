import { AdminLayout } from "../../components/AdminLayout";
import { Save, Bell, Shield, Database, Zap, Mail, Globe } from "lucide-react";
import { useState } from "react";

export function Settings() {
  const [settings, setSettings] = useState({
    siteName: "V-Sign AI",
    siteUrl: "https://vsign.ai",
    adminEmail: "admin@vsign.ai",
    supportEmail: "support@vsign.ai",
    enableRegistration: true,
    requireEmailVerification: true,
    enableNotifications: true,
    emailNotifications: true,
    pushNotifications: false,
    maintenanceMode: false,
    aiModelVersion: "v2.5.3",
    maxFreeMinutes: 5,
    maxFreeQuickPhrases: 10,
    premiumPrice: "79000",
    annualPrice: "799000",
  });

  const handleChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
              Cài đặt
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Cấu hình cài đặt và tùy chọn nền tảng
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
            style={{ backgroundColor: "#2563EB", color: "white" }}
          >
            <Save size={18} />
            Lưu thay đổi
          </button>
        </div>

        {/* General Settings */}
        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#FFF7ED" }}
            >
              <Globe size={20} style={{ color: "#2563EB" }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                Cài đặt chung
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Cấu hình nền tảng cơ bản
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
                  Tên trang web
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm"
                  style={{
                    border: "1px solid #e5e7eb",
                    color: "#1F2937",
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
                  URL trang web
                </label>
                <input
                  type="text"
                  value={settings.siteUrl}
                  onChange={(e) => handleChange("siteUrl", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm"
                  style={{
                    border: "1px solid #e5e7eb",
                    color: "#1F2937",
                  }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
                  Email quản trị
                </label>
                <input
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleChange("adminEmail", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm"
                  style={{
                    border: "1px solid #e5e7eb",
                    color: "#1F2937",
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
                  Email hỗ trợ
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm"
                  style={{
                    border: "1px solid #e5e7eb",
                    color: "#1F2937",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#E0F2F1" }}
            >
              <Shield size={20} style={{ color: "#1d4ed8" }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                Quản lý người dùng
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Cài đặt đăng ký và xác thực
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "#e5e7eb" }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>
                  Cho phép đăng ký người dùng
                </p>
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  Cho phép người dùng mới đăng ký
                </p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.enableRegistration}
                  onChange={(e) => handleChange("enableRegistration", e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-12 h-6 rounded-full peer transition-colors cursor-pointer"
                  style={{
                    backgroundColor: settings.enableRegistration ? "#2563EB" : "#E5E7EB",
                  }}
                >
                  <div
                    className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform"
                    style={{
                      transform: settings.enableRegistration ? "translateX(24px)" : "translateX(0)",
                    }}
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "#e5e7eb" }}>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>
                  Yêu cầu xác minh email
                </p>
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  Người dùng phải xác minh email trước khi truy cập
                </p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => handleChange("requireEmailVerification", e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-12 h-6 rounded-full peer transition-colors cursor-pointer"
                  style={{
                    backgroundColor: settings.requireEmailVerification ? "#2563EB" : "#E5E7EB",
                  }}
                >
                  <div
                    className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform"
                    style={{
                      transform: settings.requireEmailVerification ? "translateX(24px)" : "translateX(0)",
                    }}
                  />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>
                  Chế độ bảo trì
                </p>
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  Tạm thời vô hiệu hóa truy cập công khai
                </p>
              </div>
              <label className="relative inline-block w-12 h-6">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                  className="sr-only peer"
                />
                <div
                  className="w-12 h-6 rounded-full peer transition-colors cursor-pointer"
                  style={{
                    backgroundColor: settings.maintenanceMode ? "#DC2626" : "#E5E7EB",
                  }}
                >
                  <div
                    className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform"
                    style={{
                      transform: settings.maintenanceMode ? "translateX(24px)" : "translateX(0)",
                    }}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Notifications */}
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#FEF3C7" }}
              >
                <Bell size={20} style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                  Thông báo
                </h2>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Tùy chọn cảnh báo
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: "#e5e7eb" }}>
                <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>
                  Thông báo qua email
                </p>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-12 h-6 rounded-full peer transition-colors cursor-pointer"
                    style={{
                      backgroundColor: settings.emailNotifications ? "#2563EB" : "#E5E7EB",
                    }}
                  >
                    <div
                      className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform"
                      style={{
                        transform: settings.emailNotifications ? "translateX(24px)" : "translateX(0)",
                      }}
                    />
                  </div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <p className="text-sm font-semibold" style={{ color: "#1F2937" }}>
                  Thông báo đẩy
                </p>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleChange("pushNotifications", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div
                    className="w-12 h-6 rounded-full peer transition-colors cursor-pointer"
                    style={{
                      backgroundColor: settings.pushNotifications ? "#2563EB" : "#E5E7EB",
                    }}
                  >
                    <div
                      className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform"
                      style={{
                        transform: settings.pushNotifications ? "translateX(24px)" : "translateX(0)",
                      }}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* AI Configuration */}
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#DCFCE7" }}
              >
                <Zap size={20} style={{ color: "#16A34A" }} />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                  Cấu hình AI
                </h2>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  Cài đặt mô hình
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
                Phiên bản mô hình AI
              </label>
              <select
                value={settings.aiModelVersion}
                onChange={(e) => handleChange("aiModelVersion", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{
                  border: "1px solid #e5e7eb",
                  color: "#1F2937",
                }}
              >
                <option value="v2.5.3">v2.5.3 (Hiện tại)</option>
                <option value="v2.5.2">v2.5.2</option>
                <option value="v2.5.1">v2.5.1</option>
              </select>
            </div>
          </div>
        </div>

        {/* Free Plan Limits */}
        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#F3F4F6" }}
            >
              <Database size={20} style={{ color: "#6B7280" }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                Giới hạn gói miễn phí
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Cấu hình các hạn chế gói miễn phí
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
                Số phút tối đa mỗi ngày
              </label>
              <input
                type="number"
                value={settings.maxFreeMinutes}
                onChange={(e) => handleChange("maxFreeMinutes", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{
                  border: "1px solid #e5e7eb",
                  color: "#1F2937",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
                Số cụm từ nhanh tối đa
              </label>
              <input
                type="number"
                value={settings.maxFreeQuickPhrases}
                onChange={(e) => handleChange("maxFreeQuickPhrases", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{
                  border: "1px solid #e5e7eb",
                  color: "#1F2937",
                }}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#FFF7ED" }}
            >
              <Mail size={20} style={{ color: "#2563EB" }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                Giá gói đăng ký
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Thiết lập giá gói cao cấp (VND)
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
                Giá cao cấp tháng (VND)
              </label>
              <input
                type="text"
                value={settings.premiumPrice}
                onChange={(e) => handleChange("premiumPrice", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{
                  border: "1px solid #e5e7eb",
                  color: "#1F2937",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#1F2937" }}>
                Giá cao cấp năm (VND)
              </label>
              <input
                type="text"
                value={settings.annualPrice}
                onChange={(e) => handleChange("annualPrice", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{
                  border: "1px solid #e5e7eb",
                  color: "#1F2937",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}