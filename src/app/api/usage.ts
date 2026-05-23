// ============ TYPES ============
export interface UsageTodayResponse {
  usedSeconds: number;
  limitSeconds: number;
  remainingSeconds: number;
}

// ============ USAGE API ============
import { get } from "./client";

export async function getTodayUsage(): Promise<UsageTodayResponse> {
  return get<UsageTodayResponse>("/api/usage/today");
}

/**
 * Convert seconds to minutes
 */
export function secondsToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}
