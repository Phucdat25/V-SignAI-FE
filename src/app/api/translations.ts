import { get } from "./client";
import type { ApiResponse } from "./types";

export type TranslationType = "SPEECH_TO_SIGN" | "SIGN_TO_SPEECH" | string;

export interface TranslationHistoryResponse {
  id: number;
  createdAt?: string;
  inputContent?: string;
  outputContent?: string;
  translationType?: TranslationType;
  status?: string;
  resultUrl?: string | null;
  sourceUrl?: string | null;
  durationSeconds?: number;
  locked?: boolean;
  isLocked?: boolean;
  userId?: number;
  userName?: string;
  userEmail?: string;
  userFullName?: string;
  email?: string;
}

export interface TranslationHistoryPageResponse {
  content: TranslationHistoryResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface HistoryDisplayItem {
  id: number;
  createdAt?: string;
  date: string;
  time: string;
  preview: string;
  duration: string;
  type: string;
  translationType: TranslationType;
  status: string;
  resultUrl?: string | null;
  locked: boolean;
}

export interface AdminTranslationHistoryItem {
  id: number;
  createdAt?: string;
  date: string;
  time: string;
  userLabel: string;
  inputLabel: string;
  outputLabel: string;
  preview: string;
  type: string;
  translationType: TranslationType;
  status: string;
  duration: string;
}

export interface TranslationDetailDisplay {
  id: number;
  createdAt?: string;
  date: string;
  time: string;
  inputContent: string;
  outputContent: string;
  inputLabel: string;
  outputLabel: string;
  type: string;
  translationType: TranslationType;
  status: string;
  resultUrl?: string | null;
  sourceUrl?: string | null;
}

export const RECENT_CONVERSATIONS_LIMIT = 3;

const TYPE_COLORS: Record<string, string> = {
  "Giọng nói → Ký hiệu": "#2563EB",
  "Ký hiệu → Giọng nói": "#7c3aed",
  "Bệnh viện": "#DC2626",
  "Hàng ngày": "#2563EB",
  "Trường học": "#7c3aed",
  "Khẩn cấp": "#d97706",
};

const TRANSLATION_TYPE_LABELS: Record<string, string> = {
  SPEECH_TO_SIGN: "Giọng nói → Ký hiệu",
  SIGN_TO_SPEECH: "Ký hiệu → Giọng nói",
};

const STATUS_LABELS: Record<string, string> = {
  SUCCESS: "Thành công",
  FAILED: "Thất bại",
  PENDING: "Đang xử lý",
  PROCESSING: "Đang xử lý",
  ERROR: "Lỗi",
  CANCELLED: "Đã hủy",
};

export function formatTranslationStatus(status?: string): string {
  if (!status?.trim()) return "—";
  const key = status.trim().toUpperCase();
  return STATUS_LABELS[key] ?? status;
}

function pickString(...values: (string | undefined)[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function isMediaFileName(value: string): boolean {
  const lower = value.toLowerCase();
  return lower.endsWith(".webm") || lower.endsWith(".mp4") || lower.endsWith(".wav");
}

function formatTranslationTypeLabel(type?: string): string {
  if (!type) return "Dịch thuật";
  return TRANSLATION_TYPE_LABELS[type] ?? type.replaceAll("_", " ");
}

function extractUserInfo(item: Record<string, unknown>): Pick<
  TranslationHistoryResponse,
  "userId" | "userName" | "userEmail" | "userFullName" | "email"
> {
  const nestedSources = [
    asRecord(item.user),
    asRecord(item.userDto),
    asRecord(item.userResponse),
    asRecord(item.userInfo),
    asRecord(item.owner),
    asRecord(item.createdBy),
    item,
  ];

  let userId: number | undefined;
  let userName = "";
  let userEmail = "";
  let userFullName = "";
  let email = "";

  for (const src of nestedSources) {
    if (userId == null) {
      const rawId = src.id ?? src.userId ?? src.user_id;
      if (typeof rawId === "number") userId = rawId;
      else if (typeof rawId === "string" && rawId.trim()) userId = Number(rawId);
    }

    userName =
      userName ||
      pickString(
        src.userName as string | undefined,
        src.user_name as string | undefined,
        src.name as string | undefined,
        src.username as string | undefined
      );
    userEmail =
      userEmail ||
      pickString(
        src.userEmail as string | undefined,
        src.user_email as string | undefined,
        src.email as string | undefined
      );
    userFullName =
      userFullName ||
      pickString(
        src.userFullName as string | undefined,
        src.user_full_name as string | undefined,
        src.fullName as string | undefined,
        src.full_name as string | undefined,
        src.displayName as string | undefined
      );
    email = email || pickString(src.email as string | undefined);
  }

  return { userId, userName, userEmail, userFullName, email };
}

function formatContentLabel(content?: string): string {
  if (!content?.trim()) return "—";
  if (isMediaFileName(content)) return "Bản ghi âm / video";
  return content;
}

function buildPreview(input?: string, output?: string): string {
  const outputText = output?.trim();
  const inputText = input?.trim();

  if (outputText && inputText && !isMediaFileName(inputText) && inputText !== outputText) {
    return `${inputText} → ${outputText}`;
  }
  if (outputText) return outputText;
  if (inputText && !isMediaFileName(inputText)) return inputText;
  if (inputText) return "Phiên dịch từ bản ghi";
  return "Không có nội dung xem trước";
}

function normalizeHistoryItem(raw: unknown): TranslationHistoryResponse {
  const item = asRecord(raw);
  const userInfo = extractUserInfo(item);
  const inputContent = pickString(item.inputContent as string | undefined, item.input_content as string | undefined);
  const outputContent = pickString(
    item.outputContent as string | undefined,
    item.output_content as string | undefined
  );

  return {
    id: Number(item.id ?? 0),
    createdAt: pickString(item.createdAt as string | undefined, item.created_at as string | undefined),
    inputContent,
    outputContent,
    translationType: pickString(
      item.translationType as string | undefined,
      item.translation_type as string | undefined
    ) as TranslationType,
    status: pickString(item.status as string | undefined) || "SUCCESS",
    resultUrl: (item.resultUrl ?? item.result_url ?? null) as string | null,
    sourceUrl: (item.sourceUrl ?? item.source_url ?? null) as string | null,
    durationSeconds:
      typeof item.durationSeconds === "number"
        ? item.durationSeconds
        : typeof item.duration_seconds === "number"
          ? item.duration_seconds
          : undefined,
    locked:
      typeof item.locked === "boolean"
        ? item.locked
        : typeof item.isLocked === "boolean"
          ? item.isLocked
          : undefined,
    ...userInfo,
  };
}

function extractPageItems(page: Record<string, unknown>): unknown[] {
  if (Array.isArray(page.data)) return page.data;
  if (Array.isArray(page.content)) return page.content;
  if (Array.isArray(page.items)) return page.items;

  const nested = asRecord(page.data);
  if (Array.isArray(nested.data)) return nested.data;
  if (Array.isArray(nested.content)) return nested.content;
  if (Array.isArray(nested.items)) return nested.items;

  return [];
}

export function normalizeHistoryPage(data: unknown): TranslationHistoryPageResponse {
  if (Array.isArray(data)) {
    const content = data.map(normalizeHistoryItem);
    return {
      content,
      totalElements: content.length,
      totalPages: content.length > 0 ? 1 : 0,
      currentPage: 0,
    };
  }

  const page = asRecord(data);
  const content = extractPageItems(page).map(normalizeHistoryItem);

  return {
    content,
    totalElements:
      Number(page.totalItems ?? page.total_items ?? page.totalElements ?? page.total_elements) ||
      content.length,
    totalPages: Number(page.totalPages ?? page.total_pages) || (content.length > 0 ? 1 : 0),
    currentPage: Number(page.currentPage ?? page.current_page ?? page.page ?? 0) || 0,
  };
}

export function getHistoryTypeColor(type: string): string {
  return TYPE_COLORS[type] ?? "#6B7280";
}

export function formatHistoryDuration(durationSeconds?: number): string {
  if (durationSeconds == null || durationSeconds <= 0) {
    return "";
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.floor(durationSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function mapTranslationHistoryItem(
  item: TranslationHistoryResponse
): HistoryDisplayItem {
  const rawDate = item.createdAt ?? "";
  const parsedDate = rawDate ? new Date(rawDate) : null;
  const validDate = parsedDate && !Number.isNaN(parsedDate.getTime());
  const typeLabel = formatTranslationTypeLabel(item.translationType);
  const duration = formatHistoryDuration(item.durationSeconds);

  return {
    id: item.id,
    createdAt: item.createdAt,
    date: validDate
      ? parsedDate.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "—",
    time: validDate
      ? parsedDate.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—",
    preview: buildPreview(item.inputContent, item.outputContent),
    duration,
    type: typeLabel,
    translationType: item.translationType ?? "",
    status: item.status ?? "SUCCESS",
    resultUrl: item.resultUrl,
    locked: Boolean(item.locked ?? item.isLocked),
  };
}

export function mapAdminTranslationHistoryItem(
  item: TranslationHistoryResponse
): AdminTranslationHistoryItem {
  const mapped = mapTranslationHistoryItem(item);

  return {
    id: mapped.id,
    createdAt: mapped.createdAt,
    date: mapped.date,
    time: mapped.time,
    userLabel: item.userId != null ? String(item.userId) : "—",
    inputLabel: formatContentLabel(item.inputContent),
    outputLabel: formatContentLabel(item.outputContent) || "—",
    preview: mapped.preview,
    type: mapped.type,
    translationType: mapped.translationType,
    status: formatTranslationStatus(item.status),
    duration: mapped.duration,
  };
}

export async function getAdminTranslationHistory(
  page: number = 0,
  size: number = 10
): Promise<TranslationHistoryPageResponse> {
  const response = await get<ApiResponse<unknown>>("/api/translations/admin", {
    query: { page, size },
  });

  return normalizeHistoryPage(response?.data);
}

export async function getMyTranslationHistory(
  page: number = 0,
  size: number = 10
): Promise<TranslationHistoryPageResponse> {
  const response = await get<ApiResponse<unknown>>("/api/translations/me", {
    query: { page, size },
  });

  return normalizeHistoryPage(response?.data);
}

export function formatRecentConversationLabel(createdAt?: string): string {
  if (!createdAt) return "—";

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return "—";

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfItemDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfItemDay.getTime()) / 86_400_000
  );
  const time = date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

  if (diffDays === 0) return `Hôm nay, ${time}`;
  if (diffDays === 1) return `Hôm qua, ${time}`;
  return `${date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}, ${time}`;
}

export async function getRecentTranslationHistory(
  limit: number = RECENT_CONVERSATIONS_LIMIT
): Promise<HistoryDisplayItem[]> {
  const page = await getMyTranslationHistory(0, limit);
  return page.content.slice(0, limit).map(mapTranslationHistoryItem);
}

export function mapTranslationDetail(
  item: TranslationHistoryResponse
): TranslationDetailDisplay {
  const mapped = mapTranslationHistoryItem(item);

  return {
    id: mapped.id,
    createdAt: mapped.createdAt,
    date: mapped.date,
    time: mapped.time,
    inputContent: item.inputContent ?? "",
    outputContent: item.outputContent ?? "",
    inputLabel: formatContentLabel(item.inputContent),
    outputLabel: formatContentLabel(item.outputContent) || "—",
    type: mapped.type,
    translationType: mapped.translationType,
    status: formatTranslationStatus(mapped.status),
    resultUrl: item.resultUrl,
    sourceUrl: item.sourceUrl,
  };
}

export async function getTranslationDetail(id: number): Promise<TranslationDetailDisplay> {
  const response = await get<ApiResponse<unknown>>(`/api/translations/${id}`);
  const item = normalizeHistoryItem(response?.data);
  return mapTranslationDetail(item);
}
