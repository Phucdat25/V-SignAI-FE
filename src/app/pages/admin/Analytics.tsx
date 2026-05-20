import { AdminLayout } from "../../components/AdminLayout";
import {
  TrendingUp,
  Loader,
  CalendarRange,
  Calendar,
  CalendarClock,
  Percent,
  ChevronDown,
  Filter,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  getAdminRevenue,
  getAdminConversionRate,
  getWeeklyActivity,
  getMonthlyUserGrowth,
  RevenueResponse,
  ConversionRatePointResponse,
  WeeklyActivityResponse,
  MonthlyUserGrowthResponse,
} from "../../api/admin-users";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const weeklyActivityData = [
  { label: "T2", users: 2400, translations: 4200 },
  { label: "T3", users: 2600, translations: 4800 },
  { label: "T4", users: 2900, translations: 5200 },
  { label: "T5", users: 2700, translations: 4900 },
  { label: "T6", users: 3100, translations: 5800 },
  { label: "T7", users: 2800, translations: 5100 },
  { label: "CN", users: 2500, translations: 4400 },
];

const monthlyGrowthData = [
  { month: "T1", users: 8200, premium: 1000 },
  { month: "T2", users: 9100, premium: 1300 },
  { month: "T3", users: 9800, premium: 1700 },
  { month: "T4", users: 10500, premium: 1900 },
  { month: "T5", users: 11200, premium: 2200 },
  { month: "T6", users: 12458, premium: 2847 },
];

function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount ?? 0) + " VND";
}

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDayLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

function parseMonthLabel(label: string): number {
  const match = label.match(/\d+/);
  return match ? Number(match[0]) : 1;
}

function getConversionSummary(points: ConversionRatePointResponse[], year: number) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  let targetMonth =
    year === currentYear
      ? currentMonth
      : Math.max(...points.map((p) => parseMonthLabel(p.label)), 12);

  let current =
    points.find((p) => parseMonthLabel(p.label) === targetMonth) ?? null;

  if (!current) {
    current = [...points]
      .reverse()
      .find((p) => (p.totalUsers ?? 0) > 0) ?? null;
    if (current) targetMonth = parseMonthLabel(current.label);
  }

  const prevMonth = targetMonth === 1 ? 12 : targetMonth - 1;
  const previous = points.find((p) => parseMonthLabel(p.label) === prevMonth);
  const rate = current?.conversionRate ?? 0;
  const prevRate = previous?.conversionRate ?? 0;
  const trend = Math.round((rate - prevRate) * 100) / 100;

  return {
    rate,
    trend,
    targetMonth,
    premiumUsers: current?.premiumUsers ?? 0,
    totalUsers: current?.totalUsers ?? 0,
    periodLabel: current ? `${monthLabels[targetMonth - 1]}/${year}` : undefined,
  };
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);
const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const monthLabels = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

interface RevenueCardProps {
  title: string;
  icon: LucideIcon;
  accent: string;
  accentBg: string;
  loading: boolean;
  error: string | null;
  value: string;
  periodLabel?: string;
  filter: ReactNode;
  footer?: ReactNode;
}

function RevenueCard({
  title,
  icon: Icon,
  accent,
  accentBg,
  loading,
  error,
  value,
  periodLabel,
  filter,
  footer,
}: RevenueCardProps) {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden h-full"
      style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
    >
      <div className="p-5 flex-1">
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: accentBg }}
          >
            <Icon size={22} style={{ color: accent }} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium mb-1" style={{ color: "#6B7280" }}>
              {title}
            </p>
            {loading ? (
              <Loader className="animate-spin mt-1" size={20} style={{ color: accent }} />
            ) : error ? (
              <p className="text-xs mt-1 leading-snug" style={{ color: "#DC2626" }}>
                {error}
              </p>
            ) : (
              <p className="text-lg font-bold leading-tight" style={{ color: "#1F2937" }}>
                {value}
              </p>
            )}
            {periodLabel && !loading && !error && (
              <p className="text-xs mt-1.5 font-medium" style={{ color: accent }}>
                {periodLabel}
              </p>
            )}
          </div>
        </div>
      </div>

      <div
        className="px-4 pb-4 pt-3 border-t"
        style={{ borderColor: "#f3f4f6", backgroundColor: "#f9fafb" }}
      >
        <div className="flex items-center gap-1.5 mb-2.5">
          <Filter size={12} style={{ color: "#9CA3AF" }} />
          <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
            Bộ lọc
          </span>
        </div>
        {filter}
        {footer && !loading && !error && (
          <div className="mt-3 pt-3 border-t border-gray-200">{footer}</div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  children,
}: {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative flex-1 min-w-0">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-800 outline-none transition-shadow hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
      />
    </div>
  );
}

function FilterDateInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <CalendarClock
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
      />
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-800 outline-none transition-shadow hover:border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

export function Analytics() {
  const now = new Date();

  const [yearFilter, setYearFilter] = useState(currentYear);
  const [monthYearFilter, setMonthYearFilter] = useState(currentYear);
  const [monthFilter, setMonthFilter] = useState(now.getMonth() + 1);
  const [dayFilter, setDayFilter] = useState(() => toLocalDateString(new Date()));

  const [yearRevenue, setYearRevenue] = useState<RevenueResponse | null>(null);
  const [monthRevenue, setMonthRevenue] = useState<RevenueResponse | null>(null);
  const [dayRevenue, setDayRevenue] = useState<RevenueResponse | null>(null);

  const [yearLoading, setYearLoading] = useState(true);
  const [monthLoading, setMonthLoading] = useState(true);
  const [dayLoading, setDayLoading] = useState(true);

  const [yearError, setYearError] = useState<string | null>(null);
  const [monthError, setMonthError] = useState<string | null>(null);
  const [dayError, setDayError] = useState<string | null>(null);

  const [conversionYearFilter, setConversionYearFilter] = useState(currentYear);
  const [conversionData, setConversionData] = useState<ConversionRatePointResponse[]>([]);
  const [conversionLoading, setConversionLoading] = useState(true);
  const [conversionError, setConversionError] = useState<string | null>(null);

  const [weeklyActivityData, setWeeklyActivityData] = useState<WeeklyActivityResponse[]>([]);
  const [weeklyActivityLoading, setWeeklyActivityLoading] = useState(true);
  const [weeklyActivityError, setWeeklyActivityError] = useState<string | null>(null);

  const [monthlyGrowthFilter, setMonthlyGrowthFilter] = useState(currentYear);
  const [monthlyGrowthData, setMonthlyGrowthData] = useState<MonthlyUserGrowthResponse[]>([]);
  const [monthlyGrowthLoading, setMonthlyGrowthLoading] = useState(true);
  const [monthlyGrowthError, setMonthlyGrowthError] = useState<string | null>(null);

  useEffect(() => {
    const fetchYearRevenue = async () => {
      try {
        setYearLoading(true);
        setYearError(null);
        const data = await getAdminRevenue({ type: "YEAR", year: yearFilter });
        setYearRevenue(data);
      } catch (err) {
        setYearError(err instanceof Error ? err.message : "Không thể tải doanh thu");
      } finally {
        setYearLoading(false);
      }
    };
    fetchYearRevenue();
  }, [yearFilter]);

  useEffect(() => {
    const fetchMonthRevenue = async () => {
      try {
        setMonthLoading(true);
        setMonthError(null);
        const data = await getAdminRevenue({
          type: "MONTH",
          year: monthYearFilter,
          month: monthFilter,
        });
        setMonthRevenue(data);
      } catch (err) {
        setMonthError(err instanceof Error ? err.message : "Không thể tải doanh thu");
      } finally {
        setMonthLoading(false);
      }
    };
    fetchMonthRevenue();
  }, [monthYearFilter, monthFilter]);

  useEffect(() => {
    const fetchDayRevenue = async () => {
      try {
        setDayLoading(true);
        setDayError(null);
        const data = await getAdminRevenue({ type: "DAY", date: dayFilter });
        setDayRevenue(data);
      } catch (err) {
        setDayError(err instanceof Error ? err.message : "Không thể tải doanh thu");
      } finally {
        setDayLoading(false);
      }
    };
    fetchDayRevenue();
  }, [dayFilter]);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        setConversionLoading(true);
        setConversionError(null);
        const data = await getAdminConversionRate(conversionYearFilter);
        setConversionData(data);
      } catch (err) {
        setConversionError(
          err instanceof Error ? err.message : "Không thể tải tỉ lệ chuyển đổi"
        );
      } finally {
        setConversionLoading(false);
      }
    };
    fetchConversionRate();
  }, [conversionYearFilter]);

  useEffect(() => {
    const fetchWeeklyActivity = async () => {
      try {
        setWeeklyActivityLoading(true);
        setWeeklyActivityError(null);
        const data = await getWeeklyActivity();
        setWeeklyActivityData(data);
      } catch (err) {
        setWeeklyActivityError(
          err instanceof Error ? err.message : "Không thể tải hoạt động hàng tuần"
        );
      } finally {
        setWeeklyActivityLoading(false);
      }
    };
    fetchWeeklyActivity();
  }, []);

  useEffect(() => {
    const fetchMonthlyGrowth = async () => {
      try {
        setMonthlyGrowthLoading(true);
        setMonthlyGrowthError(null);
        const data = await getMonthlyUserGrowth(monthlyGrowthFilter);
        setMonthlyGrowthData(data);
      } catch (err) {
        setMonthlyGrowthError(
          err instanceof Error ? err.message : "Không thể tải tăng trưởng người dùng"
        );
      } finally {
        setMonthlyGrowthLoading(false);
      }
    };
    fetchMonthlyGrowth();
  }, [monthlyGrowthFilter]);

  const conversionSummary = getConversionSummary(conversionData, conversionYearFilter);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
            Doanh thu & Phân tích
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Thông tin chi tiết về doanh thu và phân tích
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <RevenueCard
            title="Doanh thu theo năm"
            icon={CalendarRange}
            accent="#2563EB"
            accentBg="#EFF6FF"
            loading={yearLoading}
            error={yearError}
            value={formatVnd(yearRevenue?.revenue ?? 0)}
            periodLabel={yearRevenue?.label ? `Năm ${yearRevenue.label}` : undefined}
            filter={
              <FilterSelect
                value={yearFilter}
                onChange={(e) => setYearFilter(Number(e.target.value))}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </FilterSelect>
            }
          />

          <RevenueCard
            title="Doanh thu theo tháng"
            icon={Calendar}
            accent="#4F46E5"
            accentBg="#EEF2FF"
            loading={monthLoading}
            error={monthError}
            value={formatVnd(monthRevenue?.revenue ?? 0)}
            periodLabel={monthRevenue?.label ? `Kỳ ${monthRevenue.label}` : undefined}
            filter={
              <div className="flex gap-2">
                <FilterSelect
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(Number(e.target.value))}
                >
                  {monthOptions.map((m) => (
                    <option key={m} value={m}>
                      {monthLabels[m - 1]}
                    </option>
                  ))}
                </FilterSelect>
                <FilterSelect
                  value={monthYearFilter}
                  onChange={(e) => setMonthYearFilter(Number(e.target.value))}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </FilterSelect>
              </div>
            }
          />

          <RevenueCard
            title="Doanh thu theo ngày"
            icon={CalendarClock}
            accent="#059669"
            accentBg="#ECFDF5"
            loading={dayLoading}
            error={dayError}
            value={formatVnd(dayRevenue?.revenue ?? 0)}
            periodLabel={dayRevenue?.label ? formatDayLabel(dayRevenue.label) : undefined}
            filter={
              <FilterDateInput
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
              />
            }
          />

          <RevenueCard
            title="Tỉ lệ chuyển đổi"
            icon={Percent}
            accent="#D97706"
            accentBg="#FFFBEB"
            loading={conversionLoading}
            error={conversionError}
            value={`${conversionSummary.rate}%`}
            periodLabel={
              conversionSummary.periodLabel
                ? `${conversionSummary.periodLabel} · ${conversionSummary.premiumUsers}/${conversionSummary.totalUsers} cao cấp`
                : undefined
            }
            filter={
              <FilterSelect
                value={conversionYearFilter}
                onChange={(e) => setConversionYearFilter(Number(e.target.value))}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </FilterSelect>
            }
            footer={
              <div className="flex items-center gap-1.5">
                <TrendingUp
                  size={14}
                  style={{
                    color: conversionSummary.trend >= 0 ? "#16A34A" : "#DC2626",
                  }}
                />
                <span
                  className="text-xs font-semibold"
                  style={{
                    color: conversionSummary.trend >= 0 ? "#16A34A" : "#DC2626",
                  }}
                >
                  {conversionSummary.trend >= 0 ? "+" : ""}
                  {conversionSummary.trend}% so với tháng trước
                </span>
              </div>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <h3 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
              Hoạt động hàng tuần
            </h3>
            {weeklyActivityLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Loader className="animate-spin" size={24} style={{ color: "#2563EB" }} />
              </div>
            ) : weeklyActivityError ? (
              <div className="h-80 flex items-center justify-center">
                <p className="text-sm" style={{ color: "#DC2626" }}>
                  {weeklyActivityError}
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
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
            )}
          </div>

          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                Tăng trưởng người dùng hàng tháng
              </h3>
              <FilterSelect
                value={monthlyGrowthFilter}
                onChange={(e) => setMonthlyGrowthFilter(Number(e.target.value))}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    Năm {y}
                  </option>
                ))}
              </FilterSelect>
            </div>
            {monthlyGrowthLoading ? (
              <div className="h-80 flex items-center justify-center">
                <Loader className="animate-spin" size={24} style={{ color: "#2563EB" }} />
              </div>
            ) : monthlyGrowthError ? (
              <div className="h-80 flex items-center justify-center">
                <p className="text-sm" style={{ color: "#DC2626" }}>
                  {monthlyGrowthError}
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// import { AdminLayout } from "../../components/AdminLayout";
// import {
//   TrendingUp,
//   Loader,
//   CalendarRange,
//   Calendar,
//   CalendarClock,
//   Percent,
//   ChevronDown,
//   Filter,
//   type LucideIcon,
// } from "lucide-react";
// import { useEffect, useState, type ReactNode } from "react";
// import {
//   getAdminRevenue,
//   getAdminConversionRate,
//   RevenueResponse,
//   ConversionRatePointResponse,
// } from "../../api/admin-users";
// import {
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from "recharts";

// const weeklyActivityData = [
//   { day: "T2", users: 2400, translations: 4200 },
//   { day: "T3", users: 2600, translations: 4800 },
//   { day: "T4", users: 2900, translations: 5200 },
//   { day: "T5", users: 2700, translations: 4900 },
//   { day: "T6", users: 3100, translations: 5800 },
//   { day: "T7", users: 2800, translations: 5100 },
//   { day: "CN", users: 2500, translations: 4400 },
// ];

// const monthlyGrowthData = [
//   { month: "T1", users: 8200, premium: 1000 },
//   { month: "T2", users: 9100, premium: 1300 },
//   { month: "T3", users: 9800, premium: 1700 },
//   { month: "T4", users: 10500, premium: 1900 },
//   { month: "T5", users: 11200, premium: 2200 },
//   { month: "T6", users: 12458, premium: 2847 },
// ];

// function formatVnd(amount: number): string {
//   return new Intl.NumberFormat("vi-VN").format(amount ?? 0) + " VND";
// }

// function toLocalDateString(date: Date): string {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, "0");
//   const d = String(date.getDate()).padStart(2, "0");
//   return `${y}-${m}-${d}`;
// }

// function formatDayLabel(isoDate: string): string {
//   const [y, m, d] = isoDate.split("-");
//   return `${d}/${m}/${y}`;
// }

// function parseMonthLabel(label: string): number {
//   const match = label.match(/\d+/);
//   return match ? Number(match[0]) : 1;
// }

// function getConversionSummary(points: ConversionRatePointResponse[], year: number) {
//   const currentYear = new Date().getFullYear();
//   const currentMonth = new Date().getMonth() + 1;

//   let targetMonth =
//     year === currentYear
//       ? currentMonth
//       : Math.max(...points.map((p) => parseMonthLabel(p.label)), 12);

//   let current =
//     points.find((p) => parseMonthLabel(p.label) === targetMonth) ?? null;

//   if (!current) {
//     current = [...points]
//       .reverse()
//       .find((p) => (p.totalUsers ?? 0) > 0) ?? null;
//     if (current) targetMonth = parseMonthLabel(current.label);
//   }

//   const prevMonth = targetMonth === 1 ? 12 : targetMonth - 1;
//   const previous = points.find((p) => parseMonthLabel(p.label) === prevMonth);
//   const rate = current?.conversionRate ?? 0;
//   const prevRate = previous?.conversionRate ?? 0;
//   const trend = Math.round((rate - prevRate) * 100) / 100;

//   return {
//     rate,
//     trend,
//     targetMonth,
//     premiumUsers: current?.premiumUsers ?? 0,
//     totalUsers: current?.totalUsers ?? 0,
//     periodLabel: current ? `${monthLabels[targetMonth - 1]}/${year}` : undefined,
//   };
// }

// const currentYear = new Date().getFullYear();
// const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - i);
// const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
// const monthLabels = [
//   "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
//   "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
// ];

// interface RevenueCardProps {
//   title: string;
//   icon: LucideIcon;
//   accent: string;
//   accentBg: string;
//   loading: boolean;
//   error: string | null;
//   value: string;
//   periodLabel?: string;
//   filter: ReactNode;
//   footer?: ReactNode;
// }

// function RevenueCard({
//   title,
//   icon: Icon,
//   accent,
//   accentBg,
//   loading,
//   error,
//   value,
//   periodLabel,
//   filter,
//   footer,
// }: RevenueCardProps) {
//   return (
//     <div
//       className="flex flex-col rounded-2xl overflow-hidden h-full"
//       style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
//     >
//       <div className="p-5 flex-1">
//         <div className="flex items-start gap-3">
//           <div
//             className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
//             style={{ backgroundColor: accentBg }}
//           >
//             <Icon size={22} style={{ color: accent }} strokeWidth={2} />
//           </div>
//           <div className="min-w-0 flex-1">
//             <p className="text-xs font-medium mb-1" style={{ color: "#6B7280" }}>
//               {title}
//             </p>
//             {loading ? (
//               <Loader className="animate-spin mt-1" size={20} style={{ color: accent }} />
//             ) : error ? (
//               <p className="text-xs mt-1 leading-snug" style={{ color: "#DC2626" }}>
//                 {error}
//               </p>
//             ) : (
//               <p className="text-lg font-bold leading-tight" style={{ color: "#1F2937" }}>
//                 {value}
//               </p>
//             )}
//             {periodLabel && !loading && !error && (
//               <p className="text-xs mt-1.5 font-medium" style={{ color: accent }}>
//                 {periodLabel}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       <div
//         className="px-4 pb-4 pt-3 border-t"
//         style={{ borderColor: "#f3f4f6", backgroundColor: "#f9fafb" }}
//       >
//         <div className="flex items-center gap-1.5 mb-2.5">
//           <Filter size={12} style={{ color: "#9CA3AF" }} />
//           <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
//             Bộ lọc
//           </span>
//         </div>
//         {filter}
//         {footer && !loading && !error && (
//           <div className="mt-3 pt-3 border-t border-gray-200">{footer}</div>
//         )}
//       </div>
//     </div>
//   );
// }

// function FilterSelect({
//   value,
//   onChange,
//   children,
// }: {
//   value: string | number;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   children: ReactNode;
// }) {
//   return (
//     <div className="relative flex-1 min-w-0">
//       <select
//         value={value}
//         onChange={onChange}
//         className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-800 outline-none transition-shadow hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
//       >
//         {children}
//       </select>
//       <ChevronDown
//         size={16}
//         className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
//       />
//     </div>
//   );
// }

// function FilterDateInput({
//   value,
//   onChange,
// }: {
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }) {
//   return (
//     <div className="relative">
//       <CalendarClock
//         size={16}
//         className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
//       />
//       <input
//         type="date"
//         value={value}
//         onChange={onChange}
//         className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-800 outline-none transition-shadow hover:border-gray-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
//       />
//     </div>
//   );
// }

// export function Analytics() {
//   const now = new Date();

//   const [yearFilter, setYearFilter] = useState(currentYear);
//   const [monthYearFilter, setMonthYearFilter] = useState(currentYear);
//   const [monthFilter, setMonthFilter] = useState(now.getMonth() + 1);
//   const [dayFilter, setDayFilter] = useState(() => toLocalDateString(new Date()));

//   const [yearRevenue, setYearRevenue] = useState<RevenueResponse | null>(null);
//   const [monthRevenue, setMonthRevenue] = useState<RevenueResponse | null>(null);
//   const [dayRevenue, setDayRevenue] = useState<RevenueResponse | null>(null);

//   const [yearLoading, setYearLoading] = useState(true);
//   const [monthLoading, setMonthLoading] = useState(true);
//   const [dayLoading, setDayLoading] = useState(true);

//   const [yearError, setYearError] = useState<string | null>(null);
//   const [monthError, setMonthError] = useState<string | null>(null);
//   const [dayError, setDayError] = useState<string | null>(null);

//   const [conversionYearFilter, setConversionYearFilter] = useState(currentYear);
//   const [conversionData, setConversionData] = useState<ConversionRatePointResponse[]>([]);
//   const [conversionLoading, setConversionLoading] = useState(true);
//   const [conversionError, setConversionError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchYearRevenue = async () => {
//       try {
//         setYearLoading(true);
//         setYearError(null);
//         const data = await getAdminRevenue({ type: "YEAR", year: yearFilter });
//         setYearRevenue(data);
//       } catch (err) {
//         setYearError(err instanceof Error ? err.message : "Không thể tải doanh thu");
//       } finally {
//         setYearLoading(false);
//       }
//     };
//     fetchYearRevenue();
//   }, [yearFilter]);

//   useEffect(() => {
//     const fetchMonthRevenue = async () => {
//       try {
//         setMonthLoading(true);
//         setMonthError(null);
//         const data = await getAdminRevenue({
//           type: "MONTH",
//           year: monthYearFilter,
//           month: monthFilter,
//         });
//         setMonthRevenue(data);
//       } catch (err) {
//         setMonthError(err instanceof Error ? err.message : "Không thể tải doanh thu");
//       } finally {
//         setMonthLoading(false);
//       }
//     };
//     fetchMonthRevenue();
//   }, [monthYearFilter, monthFilter]);

//   useEffect(() => {
//     const fetchDayRevenue = async () => {
//       try {
//         setDayLoading(true);
//         setDayError(null);
//         const data = await getAdminRevenue({ type: "DAY", date: dayFilter });
//         setDayRevenue(data);
//       } catch (err) {
//         setDayError(err instanceof Error ? err.message : "Không thể tải doanh thu");
//       } finally {
//         setDayLoading(false);
//       }
//     };
//     fetchDayRevenue();
//   }, [dayFilter]);

//   useEffect(() => {
//     const fetchConversionRate = async () => {
//       try {
//         setConversionLoading(true);
//         setConversionError(null);
//         const data = await getAdminConversionRate(conversionYearFilter);
//         setConversionData(data);
//       } catch (err) {
//         setConversionError(
//           err instanceof Error ? err.message : "Không thể tải tỉ lệ chuyển đổi"
//         );
//       } finally {
//         setConversionLoading(false);
//       }
//     };
//     fetchConversionRate();
//   }, [conversionYearFilter]);

//   const conversionSummary = getConversionSummary(conversionData, conversionYearFilter);

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
//             Doanh thu & Phân tích
//           </h1>
//           <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
//             Thông tin chi tiết về doanh thu và phân tích
//           </p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//           <RevenueCard
//             title="Doanh thu theo năm"
//             icon={CalendarRange}
//             accent="#2563EB"
//             accentBg="#EFF6FF"
//             loading={yearLoading}
//             error={yearError}
//             value={formatVnd(yearRevenue?.revenue ?? 0)}
//             periodLabel={yearRevenue?.label ? `Năm ${yearRevenue.label}` : undefined}
//             filter={
//               <FilterSelect
//                 value={yearFilter}
//                 onChange={(e) => setYearFilter(Number(e.target.value))}
//               >
//                 {yearOptions.map((y) => (
//                   <option key={y} value={y}>
//                     Năm {y}
//                   </option>
//                 ))}
//               </FilterSelect>
//             }
//           />

//           <RevenueCard
//             title="Doanh thu theo tháng"
//             icon={Calendar}
//             accent="#4F46E5"
//             accentBg="#EEF2FF"
//             loading={monthLoading}
//             error={monthError}
//             value={formatVnd(monthRevenue?.revenue ?? 0)}
//             periodLabel={monthRevenue?.label ? `Kỳ ${monthRevenue.label}` : undefined}
//             filter={
//               <div className="flex gap-2">
//                 <FilterSelect
//                   value={monthFilter}
//                   onChange={(e) => setMonthFilter(Number(e.target.value))}
//                 >
//                   {monthOptions.map((m) => (
//                     <option key={m} value={m}>
//                       {monthLabels[m - 1]}
//                     </option>
//                   ))}
//                 </FilterSelect>
//                 <FilterSelect
//                   value={monthYearFilter}
//                   onChange={(e) => setMonthYearFilter(Number(e.target.value))}
//                 >
//                   {yearOptions.map((y) => (
//                     <option key={y} value={y}>
//                       {y}
//                     </option>
//                   ))}
//                 </FilterSelect>
//               </div>
//             }
//           />

//           <RevenueCard
//             title="Doanh thu theo ngày"
//             icon={CalendarClock}
//             accent="#059669"
//             accentBg="#ECFDF5"
//             loading={dayLoading}
//             error={dayError}
//             value={formatVnd(dayRevenue?.revenue ?? 0)}
//             periodLabel={dayRevenue?.label ? formatDayLabel(dayRevenue.label) : undefined}
//             filter={
//               <FilterDateInput
//                 value={dayFilter}
//                 onChange={(e) => setDayFilter(e.target.value)}
//               />
//             }
//           />

//           <RevenueCard
//             title="Tỉ lệ chuyển đổi"
//             icon={Percent}
//             accent="#D97706"
//             accentBg="#FFFBEB"
//             loading={conversionLoading}
//             error={conversionError}
//             value={`${conversionSummary.rate}%`}
//             periodLabel={
//               conversionSummary.periodLabel
//                 ? `${conversionSummary.periodLabel} · ${conversionSummary.premiumUsers}/${conversionSummary.totalUsers} cao cấp`
//                 : undefined
//             }
//             filter={
//               <FilterSelect
//                 value={conversionYearFilter}
//                 onChange={(e) => setConversionYearFilter(Number(e.target.value))}
//               >
//                 {yearOptions.map((y) => (
//                   <option key={y} value={y}>
//                     Năm {y}
//                   </option>
//                 ))}
//               </FilterSelect>
//             }
//             footer={
//               <div className="flex items-center gap-1.5">
//                 <TrendingUp
//                   size={14}
//                   style={{
//                     color: conversionSummary.trend >= 0 ? "#16A34A" : "#DC2626",
//                   }}
//                 />
//                 <span
//                   className="text-xs font-semibold"
//                   style={{
//                     color: conversionSummary.trend >= 0 ? "#16A34A" : "#DC2626",
//                   }}
//                 >
//                   {conversionSummary.trend >= 0 ? "+" : ""}
//                   {conversionSummary.trend}% so với tháng trước
//                 </span>
//               </div>
//             }
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div
//             className="p-6 rounded-2xl"
//             style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
//           >
//             <h3 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
//               Hoạt động hàng tuần
//             </h3>
//             <ResponsiveContainer width="100%" height={280}>
//               <LineChart data={weeklyActivityData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="day" stroke="#9CA3AF" style={{ fontSize: 12 }} />
//                 <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
//                 <Tooltip />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="users"
//                   name="Người dùng"
//                   stroke="#2563EB"
//                   strokeWidth={2}
//                   dot={{ fill: "#2563EB", r: 4 }}
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="translations"
//                   name="Dịch thuật"
//                   stroke="#1d4ed8"
//                   strokeWidth={2}
//                   dot={{ fill: "#1d4ed8", r: 4 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div
//             className="p-6 rounded-2xl"
//             style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
//           >
//             <h3 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
//               Tăng trưởng người dùng hàng tháng
//             </h3>
//             <ResponsiveContainer width="100%" height={280}>
//               <BarChart data={monthlyGrowthData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: 12 }} />
//                 <YAxis stroke="#9CA3AF" style={{ fontSize: 12 }} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="users" name="Người dùng" fill="#9CA3AF" radius={[8, 8, 0, 0]} />
//                 <Bar dataKey="premium" name="Cao cấp" fill="#2563EB" radius={[8, 8, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }
