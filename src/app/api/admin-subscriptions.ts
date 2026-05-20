import { get, post, put } from "./client";
import { ApiResponse } from "./admin-users";

export interface SubscriptionPlanRequest {
  code: string;
  name: string;
  price: number;
  currency: string;
  intervalUnit: string;
  intervalCount: number;
  isActive?: boolean;
}

export interface AdminSubscriptionPlanResponse {
  id: number;
  code: string;
  name: string;
  price: number;
  currency: string;
  intervalUnit: string;
  intervalCount: number;
  isActive: boolean;
  activeUserCount: number;
}

export async function getAdminSubscriptionPlans(): Promise<AdminSubscriptionPlanResponse[]> {
  const response = await get<ApiResponse<AdminSubscriptionPlanResponse[]>>(
    "/api/admin/subscription-plans"
  );
  return response.data;
}

export async function createAdminSubscriptionPlan(
  request: SubscriptionPlanRequest
): Promise<AdminSubscriptionPlanResponse> {
  const response = await post<ApiResponse<AdminSubscriptionPlanResponse>>(
    "/api/admin/subscription-plans",
    request
  );
  return response.data;
}

export async function updateAdminSubscriptionPlan(
  id: number,
  request: SubscriptionPlanRequest
): Promise<AdminSubscriptionPlanResponse> {
  const response = await put<ApiResponse<AdminSubscriptionPlanResponse>>(
    `/api/admin/subscription-plans/${id}`,
    request
  );
  return response.data;
}
