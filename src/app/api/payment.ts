// ============ VNPAY PAYMENT SERVICE ============
import { get, post } from "./client";

export interface VNPayParams {
  vnp_TxnRef: string;
  vnp_ResponseCode: string;
  vnp_Amount?: string;
  vnp_OrderInfo?: string;
  vnp_TransactionDate?: string;
  vnp_SecureHash?: string;
  [key: string]: string | undefined;
}

export interface PaymentResponse {
  RspCode: string;
  Message: string;
}

export interface PaymentInitRequest {
  packageType: "PRO_MONTH" | "PRO_YEAR";
}

export interface PaymentInitResponse {
  paymentUrl: string;
  transactionId: string;
}

/**
 * Initiate a payment for subscription upgrade
 * @param packageType - "PRO_MONTH" or "PRO_YEAR"
 * @returns Payment initialization response with VNPay redirect URL
 */
export async function initiatePayment(packageType: "PRO_MONTH" | "PRO_YEAR"): Promise<PaymentInitResponse> {
  const response = await post<PaymentInitResponse>("/api/v1/payments/initiate", {
    packageType,
  });
  return response;
}

/**
 * Redirect to VNPay payment gateway
 * @param paymentUrl - URL from initiatePayment response
 */
export function redirectToVNPay(paymentUrl: string): void {
  window.location.href = paymentUrl;
}

/**
 * Handle VNPay return callback
 * Called when user is redirected back from VNPay gateway after payment
 */
export async function handleVNPayReturn(): Promise<string> {
  return get<string>("/api/v1/payments/vnpay-return");
}

/**
 * Handle VNPay IPN (Instant Payment Notification) callback
 * Verifies payment status and activates subscription if successful
 * @param params - VNPay callback parameters
 */
export async function handleVNPayIPN(params: Record<string, string>): Promise<PaymentResponse> {
  const queryString = new URLSearchParams(params).toString();
  return get<PaymentResponse>(`/api/v1/payments/vnpay-ipn?${queryString}`);
}

/**
 * Check VNPay payment status from URL parameters
 * Useful for handling return callback with query params
 */
export function parseVNPayReturnParams(): VNPayParams {
  const params = new URLSearchParams(window.location.search);
  const result: VNPayParams = {
    vnp_TxnRef: params.get("vnp_TxnRef") || "",
    vnp_ResponseCode: params.get("vnp_ResponseCode") || "",
  };

  // Collect all VNPay params
  params.forEach((value, key) => {
    if (key.startsWith("vnp_")) {
      result[key] = value;
    }
  });

  return result;
}

/**
 * Determine if payment was successful
 */
export function isPaymentSuccess(responseCode: string): boolean {
  return responseCode === "00";
}
