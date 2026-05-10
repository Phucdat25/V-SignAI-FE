// ============ GENERIC API SERVICE ============
import { ApiError } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

export interface ApiRequestInit extends RequestInit {
  query?: Record<string, string | number | boolean>;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestInit = {}
): Promise<T> {
  const { query, ...fetchOptions } = options;
  const url = new URL(endpoint, API_BASE_URL);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Merge additional headers safely
  if (fetchOptions.headers) {
    if (Array.isArray(fetchOptions.headers)) {
      fetchOptions.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else if (fetchOptions.headers instanceof Headers) {
      fetchOptions.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, fetchOptions.headers);
    }
  }

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
    });

    const text = await response.text();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        text || response.statusText || `HTTP ${response.status}`,
        text
      );
    }

    if (!text) {
      return {} as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      0,
      error instanceof Error ? error.message : "Network error"
    );
  }
}

// ============ COMMON METHODS ============
export function get<T>(
  endpoint: string,
  options?: Omit<ApiRequestInit, "method">
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "GET" });
}

export function post<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestInit, "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function put<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestInit, "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function patch<T>(
  endpoint: string,
  body?: unknown,
  options?: Omit<ApiRequestInit, "method" | "body">
): Promise<T> {
  return apiRequest<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function del<T>(
  endpoint: string,
  options?: Omit<ApiRequestInit, "method">
): Promise<T> {
  return apiRequest<T>(endpoint, { ...options, method: "DELETE" });
}
