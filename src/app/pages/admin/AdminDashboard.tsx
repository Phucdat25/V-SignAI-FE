import { AdminLayout } from "../../components/AdminLayout";
import { Users, TrendingUp, Crown, Target } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const statCards = [
  {
    icon: Users,
    title: "Tổng người dùng",
    value: "12,458",
    trend: "+12.5%",
    trendUp: true,
    color: "#2563EB",
  },
  {
    icon: TrendingUp,
    title: "Dịch thuật hàng ngày",
    value: "8,942",
    trend: "+8.2%",
    trendUp: true,
    color: "#1d4ed8",
  },
  {
    icon: Crown,
    title: "Người dùng cao cấp",
    value: "2,847",
    trend: "+18.4%",
    trendUp: true,
    color: "#F59E0B",
  },
  {
    icon: Target,
    title: "Độ chính xác AI",
    value: "99.2%",
    trend: "+0.3%",
    trendUp: true,
    color: "#10B981",
  },
];

const dailyTranslationsData = [
  { date: "T2", translations: 6500 },
  { date: "T3", translations: 7200 },
  { date: "T4", translations: 8100 },
  { date: "T5", translations: 7800 },
  { date: "T6", translations: 9200 },
  { date: "T7", translations: 8400 },
  { date: "CN", translations: 7600 },
];

const userGrowthData = [
  { month: "T1", users: 8200 },
  { month: "T2", users: 9100 },
  { month: "T3", users: 9800 },
  { month: "T4", users: 10500 },
  { month: "T5", users: 11200 },
  { month: "T6", users: 12458 },
];

const subscriptionData = [
  { month: "T1", free: 7200, premium: 1000 },
  { month: "T2", free: 7800, premium: 1300 },
  { month: "T3", free: 8100, premium: 1700 },
  { month: "T4", free: 8600, premium: 1900 },
  { month: "T5", free: 9000, premium: 2200 },
  { month: "T6", free: 9611, premium: 2847 },
];

const recentUsers = [
  {
    id: "USR-1248",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    plan: "Cao cấp",
    status: "Hoạt động",
    lastActive: "2 phút trước",
  },
  {
    id: "USR-1247",
    name: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    plan: "Miễn phí",
    status: "Hoạt động",
    lastActive: "15 phút trước",
  },
  {
    id: "USR-1246",
    name: "Lê Hoàng Minh",
    email: "lehoangminh@email.com",
    plan: "Cao cấp",
    status: "Hoạt động",
    lastActive: "1 giờ trước",
  },
  {
    id: "USR-1245",
    name: "Phạm Thu Hà",
    email: "phamthuha@email.com",
    plan: "Miễn phí",
    status: "Không hoạt động",
    lastActive: "2 ngày trước",
  },
];

export function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
            Tổng quan
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Chào mừng trở lại! Đây là những gì đang diễn ra với V-Sign AI hôm nay.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: stat.trendUp ? "#DCFCE7" : "#FEE2E2",
                      color: stat.trendUp ? "#16A34A" : "#DC2626",
                    }}
                  >
                    {stat.trend}
                  </span>
                </div>
                <div className="text-3xl font-bold mb-1" style={{ color: "#1F2937" }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: "#6B7280" }}>
                  {stat.title}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Translations Chart */}
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
              Sử dụng dịch thuật hàng ngày
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailyTranslationsData}>
                <defs>
                  <linearGradient id="colorTranslations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="translations"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTranslations)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth Chart */}
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
              Tăng trưởng người dùng hàng tháng
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#1d4ed8"
                  strokeWidth={3}
                  dot={{ fill: "#1d4ed8", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Subscription Rate Chart */}
          <div
            className="p-6 rounded-2xl lg:col-span-2"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
              Tỷ lệ đăng ký cao cấp
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={subscriptionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="free" fill="#9CA3AF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="premium" fill="#2563EB" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#e5e7eb" }}>
            <h3 className="text-lg font-bold" style={{ color: "#1F2937" }}>
              Người dùng gần đây
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    MÃ NGƯỜI DÙNG
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    TÊN
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    EMAIL
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    GÓI
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    TRẠNG THÁI
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    HOẠT ĐỘNG LẦN CUỐI
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    THAO TÁC
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-t" style={{ borderColor: "#e5e7eb" }}>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                      {user.id}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#1F2937" }}>
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: user.plan === "Cao cấp" ? "#EFF6FF" : "#F3F4F6",
                          color: user.plan === "Cao cấp" ? "#2563EB" : "#6B7280",
                        }}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: user.status === "Hoạt động" ? "#DCFCE7" : "#FEE2E2",
                          color: user.status === "Hoạt động" ? "#16A34A" : "#DC2626",
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-sm font-medium hover:underline"
                        style={{ color: "#2563EB" }}
                      >
                        Xem
                      </button>
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