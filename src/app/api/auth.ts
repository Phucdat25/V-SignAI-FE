// ============ TYPES ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ============ CONFIG ============
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const AUTH_URL = API_BASE_URL.replace(/\/+$/, "") + "/auth";
const TOKEN_KEY = "authToken";

// ============ UTILS ============
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${AUTH_URL}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Merge additional headers safely
  if (options.headers) {
    if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
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

    // Handle JWT token response (plain string)
    if (text.startsWith("eyJ")) {
      return { token: text } as T;
    }

    // Handle empty response
    if (!text.trim()) {
      return {} as T;
    }

    // Parse JSON response
    return JSON.parse(text);
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

// ============ AUTH ENDPOINTS ============
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuthToken(response.token);
  return response;
}

export async function register(
  payload: RegisterRequest
): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuthToken(response.token);
  return response;
}

export async function loginWithGoogle(
  payload: GoogleLoginRequest
): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>("/google", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setAuthToken(response.token);
  return response;
}

export async function logout(): Promise<void> {
  clearAuthToken();
}
