// ============ TYPES ============
export interface AdminUserResponse {
  id: number;
  name: string;
  email: string;
  planCode: string;
  planName: string;
  role: string;
  status: "Hoạt động" | "Không hoạt động" | "Bị đình chỉ";
  joined?: string;
  lastActive?: string;
  translations?: number;
}

export interface AdminUserStatisticsResponse {
  totalUsers: number;
  premiumUsers: number;
  activeToday: number;
  suspendedUsers?: number;
}

export interface ChartPointResponse {
  label: string;
  value: number;
}

export interface AdminDashboardOverviewResponse {
  monthlyRevenue: number;
  totalUsers: number;
  totalTranslations: number;
  premiumUsers: number;
  dailyTranslations: ChartPointResponse[];
  monthlyUserGrowth: ChartPointResponse[];
}

export interface AdminUsersPageResponse {
  content: AdminUserResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export type RevenueFilterType = "DAY" | "MONTH" | "YEAR";

export interface RevenueResponse {
  type: string;
  label: string;
  revenue: number;
}

export interface GetRevenueParams {
  type: RevenueFilterType;
  year?: number;
  month?: number;
  date?: string;
}

export interface ConversionRatePointResponse {
  label: string;
  totalUsers: number;
  premiumUsers: number;
  conversionRate: number;
}

export interface WeeklyActivityResponse {
  label: string;
  users: number;
  translations: number;
}

export interface MonthlyUserGrowthResponse {
  month: string;
  users: number;
  premium: number;
}

// Backend returns { label, totalUsers, premiumUsers } — map to frontend shape
export interface BackendMonthlyUserGrowthResponse {
  label: string;
  totalUsers: number;
  premiumUsers: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ============ ADMIN USERS API ============
import { get, patch, post } from "./client";

export async function getAdminUserStatistics(): Promise<AdminUserStatisticsResponse> {
  const response = await get<ApiResponse<AdminUserStatisticsResponse>>("/api/admin/users/statistics");
  return response.data;
}

export async function getAdminDashboardOverview(): Promise<AdminDashboardOverviewResponse> {
  const response = await get<ApiResponse<AdminDashboardOverviewResponse>>("/api/admin/users/overview");
  return response.data;
}

export async function getAdminRevenue(params: GetRevenueParams): Promise<RevenueResponse> {
  const query: Record<string, string | number | boolean> = { type: params.type };
  if (params.year != null) query.year = params.year;
  if (params.month != null) query.month = params.month;
  if (params.date != null) query.date = params.date;

  const response = await get<ApiResponse<RevenueResponse>>("/api/admin/users/revenue", { query });
  return response.data;
}

export async function getAdminConversionRate(year?: number): Promise<ConversionRatePointResponse[]> {
  const query: Record<string, string | number | boolean> = {};
  if (year != null) query.year = year;

  const response = await get<ApiResponse<ConversionRatePointResponse[]>>(
    "/api/admin/users/conversion-rate",
    { query }
  );
  return response.data;
}

export async function getWeeklyActivity(): Promise<WeeklyActivityResponse[]> {
  const response = await get<ApiResponse<WeeklyActivityResponse[]>>(
    "/api/admin/users/weekly-activity"
  );
  return response.data;
}

export async function getMonthlyUserGrowth(year?: number): Promise<MonthlyUserGrowthResponse[]> {
  const query: Record<string, string | number | boolean> = {};
  if (year != null) query.year = year;

  const response = await get<ApiResponse<BackendMonthlyUserGrowthResponse[]>>(
    "/api/admin/users/monthly-user-growth",
    { query }
  );

  // Map backend fields to frontend expected keys
  return (response.data || []).map((r) => ({
    month: r.label,
    users: r.totalUsers ?? 0,
    premium: r.premiumUsers ?? 0,
  }));
}

export async function getAdminUsers(page: number = 0, size: number = 10): Promise<AdminUsersPageResponse> {
  const response = await get<ApiResponse<AdminUsersPageResponse>>("/api/admin/users", {
    query: { page, size },
  });
  return response.data;
}

export async function getAdminUserDetail(id: number): Promise<AdminUserResponse> {
  const response = await get<ApiResponse<AdminUserResponse>>(`/api/admin/users/${id}`);
  return response.data;
}

export async function updateAdminUserStatus(id: number, status: string): Promise<string> {
  const response = await patch<ApiResponse<string>>(`/api/admin/users/${id}/status`, null, {
    query: { status },
  });
  return response.data;
}

export interface AdminCreateUserRequest {
  email: string;
  name: string;
  planCode: string;
  role: string;
  password: string;
}
export async function createAdminUser(
  request: AdminCreateUserRequest
): Promise<AdminUserResponse> {
  const response = await post<ApiResponse<AdminUserResponse>>(
    "/api/admin/users",
    request
  );
  return response.data;
}
