import { AdminLayout } from "../../components/AdminLayout";
import { Users, TrendingUp, Crown, Target, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAdminDashboardOverview,
  AdminDashboardOverviewResponse,
} from "../../api/admin-users";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
}

function formatCount(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function AdminDashboard() {
  const [overview, setOverview] = useState<AdminDashboardOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAdminDashboardOverview();
        setOverview(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Không thể tải dữ liệu tổng quan";
        setError(errorMessage);
        console.error("Error fetching dashboard overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const statCards = overview
    ? [
        {
          icon: Target,
          title: "Doanh thu hàng tháng",
          value: formatVnd(overview.monthlyRevenue ?? 0),
          color: "#10B981",
        },
        {
          icon: Users,
          title: "Tổng người dùng",
          value: formatCount(overview.totalUsers ?? 0),
          color: "#2563EB",
        },
        {
          icon: TrendingUp,
          title: "Tổng lượt dịch",
          value: formatCount(overview.totalTranslations ?? 0),
          color: "#1d4ed8",
        },
        {
          icon: Crown,
          title: "Người dùng cao cấp",
          value: formatCount(overview.premiumUsers ?? 0),
          color: "#F59E0B",
        },
      ]
    : [];

  const dailyTranslationsData =
    overview?.dailyTranslations.map((point) => ({
      date: point.label,
      translations: point.value,
    })) ?? [];

  const userGrowthData =
    overview?.monthlyUserGrowth.map((point) => ({
      month: point.label,
      users: point.value,
    })) ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
            Tổng quan
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Chào mừng trở lại! Đây là những gì đang diễn ra với V-Sign AI hôm nay.
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader className="animate-spin" size={32} style={{ color: "#2563EB" }} />
          </div>
        )}

        {error && !loading && (
          <div
            className="p-4 rounded-xl text-sm"
            style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
          >
            {error}
          </div>
        )}

        {!loading && !error && overview && (
          <>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      name="Số lượt dịch"
                      dataKey="translations"
                      stroke="#2563EB"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorTranslations)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

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
                      name="Người dùng"
                      dataKey="users"
                      stroke="#1d4ed8"
                      strokeWidth={3}
                      dot={{ fill: "#1d4ed8", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
