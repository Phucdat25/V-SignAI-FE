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

export type UserRole = string;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  fullName?: string;
  role?: UserRole;
  plan?: string;
}

// Backend response format
export interface BackendAuthResponse {
  token: string;
  email?: string;
  fullName?: string;
  user_Id?: number;
  role?: UserRole;
  plan?: string;
  message?: string;
  [key: string]: unknown;
}

interface JwtClaims {
  role?: UserRole | UserRole[];
  roles?: UserRole | UserRole[];
  authority?: UserRole | UserRole[];
  authorities?: UserRole | UserRole[];
}

export interface AuthResponse {
  token: string;
  user?: AuthUser;
  role?: UserRole;
  plan?: string;
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
const USER_INFO_KEY = "userInfo";

// ============ UTILS ============
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setUserInfo(user: any): void {
  // Normalize backend response to AuthUser format
  const normalized: AuthUser = {
    id: user.user_Id?.toString() || user.id || "",
    email: user.email || "",
    name: user.fullName || user.name || "",
    fullName: user.fullName,
    role: user.role,
    plan: user.plan,
  };
  console.log("Auth - Setting user info (normalized):", normalized);
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(normalized));
}

export function getUserInfo(): AuthUser | null {
  const data = localStorage.getItem(USER_INFO_KEY);
  const user = data ? JSON.parse(data) : null;
  console.log("Auth - Getting user info:", user);
  return user;
}

export function clearUserInfo(): void {
  localStorage.removeItem(USER_INFO_KEY);
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function decodeJwt(token: string): JwtClaims | undefined {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return undefined;

    const payload = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const decoded = atob(payload);
    const json = decodeURIComponent(
      decoded
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(json) as JwtClaims;
  } catch {
    return undefined;
  }
}

function resolveClaimValue(value?: UserRole | UserRole[]): UserRole | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export function getAuthRole(response: AuthResponse): UserRole | undefined {
  const roleFromUser = response.user?.role;
  if (roleFromUser) {
    console.log("Auth - Role from user object:", roleFromUser);
    return roleFromUser;
  }
  if (response.role) {
    console.log("Auth - Role from response.role:", response.role);
    return response.role;
  }

  const claims = decodeJwt(response.token);
  console.log("Auth - JWT Claims:", claims);
  if (!claims) return undefined;

  const resolvedRole =
    resolveClaimValue(claims.role) ||
    resolveClaimValue(claims.roles) ||
    resolveClaimValue(claims.authority) ||
    resolveClaimValue(claims.authorities);

  console.log("Auth - Resolved role from JWT:", resolvedRole);
  return resolvedRole;
}

export function isAdminRole(role?: UserRole): boolean {
  return !!role && role.toString().toLowerCase().includes("admin");
}

export function syncAdminAuth(role?: UserRole): void {
  if (isAdminRole(role)) {
    localStorage.setItem("adminAuth", "true");
  } else {
    localStorage.removeItem("adminAuth");
  }
}

export function formatUserPlan(plan?: string): string {
  if (!plan) return "Gói miễn phí";

  const normalized = plan.trim().toUpperCase();
  if (["FREE", "FREE_PLAN", "PRO_FREE"].includes(normalized)) {
    return "Gói miễn phí";
  }
  if (["PRO_MONTHLY", "PRO_MONTH", "PRO_MONTHLY_PLAN", "PROMONTHLY", "PRO_MONTHLY"]
    .includes(normalized)) {
    return "Gói cao cấp tháng";
  }
  if (["PRO_YEARLY", "PRO_YEAR", "PRO_YEARLY_PLAN", "PROYEARLY", "PRO_YEARLY"]
    .includes(normalized)) {
    return "Gói cao cấp năm";
  }
  if (normalized === "PRO" || normalized === "CASH") {
    return "Gói cao cấp";
  }
  if (plan.toLowerCase().includes("monthly")) return "Gói cao cấp tháng";
  if (plan.toLowerCase().includes("year")) return "Gói cao cấp năm";
  if (plan.toLowerCase().includes("free")) return "Gói miễn phí";

  return plan;
}

interface ErrorResponse {
  status: number;
  error: string;
  message: string;
  timestamp?: string;
  [key: string]: unknown;
}

function tryParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function getReadableMessage(raw: unknown): string {
  if (typeof raw === "string") {
    return raw.trim();
  }

  if (Array.isArray(raw)) {
    return raw.map((item) => getReadableMessage(item)).join("; ");
  }

  if (raw && typeof raw === "object") {
    if ("message" in raw) {
      return getReadableMessage((raw as Record<string, unknown>).message);
    }
    return Object.values(raw)
      .map((value) => getReadableMessage(value))
      .filter(Boolean)
      .join("; ");
  }

  return "";
}

function extractServerMessage(endpoint: string, status: number, text: string): string {
  const parsed = tryParseJson(text) as ErrorResponse | Record<string, unknown> | null;
  const rawMessage =
    parsed?.message ||
    parsed?.error ||
    parsed?.detail ||
    parsed?.description ||
    parsed?.title ||
    parsed?.Message ||
    text;

  const message = getReadableMessage(rawMessage) || text || `HTTP ${status}`;
  const normalized = message.toLowerCase();
  const normalizedText = text.toLowerCase();
  const isDuplicateEmail = normalized.includes("email already exists") ||
    normalized.includes("email already registered") ||
    normalized.includes("duplicate email") ||
    normalized.includes("email đã tồn tại") ||
    normalizedText.includes("email already exists") ||
    normalizedText.includes("email already registered") ||
    normalizedText.includes("duplicate email") ||
    normalizedText.includes("email đã tồn tại");

  if (endpoint.toLowerCase().endsWith("/register") && status === 500) {
    if (isDuplicateEmail) {
      return "Email đã tồn tại. Vui lòng dùng email khác hoặc đăng nhập.";
    }
    return message || "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin và thử lại.";
  }

  return message || `HTTP ${status}`;
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
      const message = extractServerMessage(endpoint, response.status, text);
      const details = tryParseJson(text) ?? text;
      throw new ApiError(
        response.status,
        message,
        details
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
  console.log("Login Response:", response);
  setAuthToken(response.token);
  if (response.user) {
    setUserInfo(response.user);
  } else {
    // Backend might return data directly in response
    setUserInfo(response as any);
  }
  return response;
}

export async function register(
  payload: RegisterRequest
): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log("Register Response:", response);
  setAuthToken(response.token);
  if (response.user) {
    setUserInfo(response.user);
  } else {
    setUserInfo(response as any);
  }
  return response;
}

export async function loginWithGoogle(
  payload: GoogleLoginRequest
): Promise<AuthResponse> {
  const response = await apiCall<AuthResponse>("/google", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  console.log("Google Login Response:", response);
  setAuthToken(response.token);
  if (response.user) {
    setUserInfo(response.user);
  } else {
    setUserInfo(response as any);
  }
  return response;
}

export async function logout(): Promise<void> {
  clearAuthToken();
  clearUserInfo();
}
