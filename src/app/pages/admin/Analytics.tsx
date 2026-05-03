import { AdminLayout } from "../../components/AdminLayout";
import { TrendingUp, Users, MessageSquare, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const weeklyActivityData = [
  { day: "T2", users: 2400, translations: 4200 },
  { day: "T3", users: 2600, translations: 4800 },
  { day: "T4", users: 2900, translations: 5200 },
  { day: "T5", users: 2700, translations: 4900 },
  { day: "T6", users: 3100, translations: 5800 },
  { day: "T7", users: 2800, translations: 5100 },
  { day: "CN", users: 2500, translations: 4400 },
];

const monthlyGrowthData = [
  { month: "T1", users: 8200, premium: 1000 },
  { month: "T2", users: 9100, premium: 1300 },
  { month: "T3", users: 9800, premium: 1700 },
  { month: "T4", users: 10500, premium: 1900 },
  { month: "T5", users: 11200, premium: 2200 },
  { month: "T6", users: 12458, premium: 2847 },
];

const featureUsageData = [
  { name: "Giọng nói sang ký hiệu", value: 4200, color: "#2563EB" },
  { name: "Ký hiệu sang giọng nói", value: 3100, color: "#1d4ed8" },
  { name: "Thư viện ký hiệu", value: 1800, color: "#F59E0B" },
  { name: "Cụm từ nhanh", value: 1400, color: "#10B981" },
];

const peakHoursData = [
  { hour: "00:00", activity: 120 },
  { hour: "03:00", activity: 80 },
  { hour: "06:00", activity: 200 },
  { hour: "09:00", activity: 850 },
  { hour: "12:00", activity: 1200 },
  { hour: "15:00", activity: 900 },
  { hour: "18:00", activity: 1100 },
  { hour: "21:00", activity: 650 },
];

const topUsers = [
  { rank: 1, name: "Nguyễn Văn An", translations: 2847, plan: "Cao cấp" },
  { rank: 2, name: "Trần Thị Bình", translations: 2156, plan: "Cao cấp" },
  { rank: 3, name: "Lê Hoàng Minh", translations: 1842, plan: "Cao cấp" },
  { rank: 4, name: "Phạm Thu Hà", translations: 1534, plan: "Miễn phí" },
  { rank: 5, name: "Võ Minh Tuấn", translations: 1247, plan: "Cao cấp" },
];

export function Analytics() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
            Bảng điều khiển phân tích
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Thông tin chi tiết về hiệu suất nền tảng và hành vi người dùng
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#FFF7ED" }}
              >
                <Users size={24} style={{ color: "#2563EB" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Người dùng hoạt động hàng ngày
                </p>
                <p className="text-2xl font-bold" style={{ color: "#1F2937" }}>
                  8,234
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} style={{ color: "#16A34A" }} />
              <span className="text-xs font-semibold" style={{ color: "#16A34A" }}>
                +12.5% so với tuần trước
              </span>
            </div>
          </div>

          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#E0F2F1" }}
              >
                <MessageSquare size={24} style={{ color: "#1d4ed8" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Dịch thuật hôm nay
                </p>
                <p className="text-2xl font-bold" style={{ color: "#1F2937" }}>
                  8,942
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} style={{ color: "#16A34A" }} />
              <span className="text-xs font-semibold" style={{ color: "#16A34A" }}>
                +8.2% so với hôm qua
              </span>
            </div>
          </div>

          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#DCFCE7" }}
              >
                <TrendingUp size={24} style={{ color: "#16A34A" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Tỷ lệ chuyển đổi
                </p>
                <p className="text-2xl font-bold" style={{ color: "#1F2937" }}>
                  22.8%
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} style={{ color: "#16A34A" }} />
              <span className="text-xs font-semibold" style={{ color: "#16A34A" }}>
                +3.2% tháng này
              </span>
            </div>
          </div>

          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#FEF3C7" }}
              >
                <Clock size={24} style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Thời gian phiên TB
                </p>
                <p className="text-2xl font-bold" style={{ color: "#1F2937" }}>
                  8p 42s
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={14} style={{ color: "#16A34A" }} />
              <span className="text-xs font-semibold" style={{ color: "#16A34A" }}>
                +5.7% so với tuần trước
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity */}
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
              Hoạt động hàng tuần
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Người dùng"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ fill: "#2563EB", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="translations"
                  name="Dịch thuật"
                  stroke="#1d4ed8"
                  strokeWidth={2}
                  dot={{ fill: "#1d4ed8", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Feature Usage */}
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
              Phân bổ sử dụng tính năng
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={featureUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {featureUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Growth */}
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
              Tăng trưởng người dùng hàng tháng
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" name="Người dùng" fill="#9CA3AF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="premium" name="Cao cấp" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Peak Hours */}
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
              Giờ cao điểm hoạt động
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={peakHoursData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="hour" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="activity"
                  name="Hoạt động"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorActivity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Users */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#e5e7eb" }}>
            <h3 className="text-lg font-bold" style={{ color: "#1F2937" }}>
              Người dùng hoạt động tích cực nhất
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    HẠNG
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    TÊN NGƯỜI DÙNG
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    TỔNG DỊCH THUẬT
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    GÓI
                  </th>
                </tr>
              </thead>
              <tbody>
                {topUsers.map((user) => (
                  <tr
                    key={user.rank}
                    className="border-t hover:bg-gray-50"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <td className="px-6 py-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor:
                            user.rank === 1
                              ? "#FFF7ED"
                              : user.rank === 2
                              ? "#F3F4F6"
                              : user.rank === 3
                              ? "#FEF3C7"
                              : "#F9FAFB",
                          color:
                            user.rank === 1
                              ? "#2563EB"
                              : user.rank === 2
                              ? "#6B7280"
                              : user.rank === 3
                              ? "#F59E0B"
                              : "#9CA3AF",
                        }}
                      >
                        {user.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#1F2937" }}>
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#1F2937" }}>
                      {user.translations.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: user.plan === "Cao cấp" ? "#FFF7ED" : "#F3F4F6",
                          color: user.plan === "Cao cấp" ? "#2563EB" : "#6B7280",
                        }}
                      >
                        {user.plan}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
