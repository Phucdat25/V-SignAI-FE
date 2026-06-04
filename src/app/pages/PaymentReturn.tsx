import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { parseVNPayReturnParams, isPaymentSuccess, handleVNPayIPN } from "../api/payment";
import { getSubscriptionStatus, getProfile } from "../api/example";
import { getUserInfo, setUserInfo } from "../api/auth";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export function PaymentReturn() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed" | "error">("loading");
  const [message, setMessage] = useState("");
  const [transactionId, setTransactionId] = useState("");

  useEffect(() => {
    const processPayment = async () => {
      try {
        // =====================================================
        // STEP 1 — PARSE VNPAY RETURN PARAMS
        // =====================================================

        const params = parseVNPayReturnParams();
        setTransactionId(params.vnp_TxnRef || "");

        if (!params.vnp_ResponseCode) {
          setStatus("error");
          setMessage("Không tìm thấy tham số thanh toán. Vui lòng thử lại.");
          return;
        }

        // =====================================================
        // STEP 2 — CALL IPN ENDPOINT TO VERIFY PAYMENT
        // =====================================================

        let response: any = null;
        let isConfirmed = false;

        try {
          response = await handleVNPayIPN(params);
          isConfirmed = response.RspCode === "00";
          
          // Also check if response message indicates already confirmed
          if (!isConfirmed && response.Message?.toLowerCase().includes("already confirmed")) {
            console.log("Payment was already confirmed in a previous request");
            isConfirmed = true;
          }
        } catch (ipnError: any) {
          // Check if error is due to payment already being confirmed
          const errorMsg = ipnError?.message || JSON.stringify(ipnError);
          console.warn("IPN verification error:", errorMsg);
          
          if (errorMsg.toLowerCase().includes("already confirmed") || 
              errorMsg.toLowerCase().includes("payment already confirmed")) {
            // Payment was already confirmed in a previous request - this is success!
            isConfirmed = true;
            response = { RspCode: "00", Message: "Payment already confirmed" };
          } else {
            throw ipnError; // Re-throw if it's not the "already confirmed" error
          }
        }

        // =====================================================
        // STEP 3 — HANDLE RESPONSE
        // =====================================================

        if (isPaymentSuccess(params.vnp_ResponseCode)) {
          if (isConfirmed) {
            // Payment confirmed successfully (or was already confirmed)
            setStatus("success");
            setMessage("Thanh toán thành công! Gói Premium của bạn đã được kích hoạt.");

            // =====================================================
            // STEP 4 — FETCH & UPDATE USER SUBSCRIPTION STATUS
            // =====================================================
            const fetchUpdatedUserInfoWithRetry = async (retries = 3, delay = 1000) => {
              for (let i = 0; i < retries; i++) {
                try {
                  // Add delay before each attempt (give backend time to process)
                  await new Promise(resolve => setTimeout(resolve, delay));
                  
                  let updatedData = null;
                  
                  // Try to get subscription status first (new endpoint)
                  try {
                    const subscription = await getSubscriptionStatus();
                    console.log("Got subscription status:", subscription);
                    if (subscription && subscription.plan) {
                      updatedData = subscription;
                    }
                  } catch (subError) {
                    console.warn("Subscription status endpoint failed, trying profile endpoint:", subError);
                    // Fallback to profile endpoint
                    try {
                      const profile = await getProfile();
                      console.log("Got profile:", profile);
                      if (profile && profile.plan) {
                        updatedData = profile;
                      }
                    } catch (profileError) {
                      console.warn("Profile endpoint also failed:", profileError);
                    }
                  }
                  
                  // Update user info if we got new data with plan
                  if (updatedData && updatedData.plan) {
                    const currentUser = getUserInfo();
                    if (currentUser) {
                      setUserInfo({
                        ...currentUser,
                        plan: updatedData.plan,
                      });
                      console.log("User info updated with new plan:", updatedData.plan);
                      return true;
                    }
                  }
                } catch (error) {
                  console.warn(`User info fetch attempt ${i + 1} failed:`, error);
                }
              }
              
              // Even if all retries failed, payment is confirmed, so we can proceed
              console.warn("Failed to fetch updated user info after all retries, but payment is confirmed");
              return false;
            };

            // Try to fetch updated user info, but don't block if it fails
            // Payment is already confirmed by IPN, so we proceed regardless
            await fetchUpdatedUserInfoWithRetry();

            // Redirect to dashboard after 2 seconds
            // (Don't reload page to avoid calling handleVNPayIPN again)
            console.log("Payment successful, redirecting to dashboard...");
            setTimeout(() => {
              navigate("/dashboard");
            }, 2000);
          } else {
            // Payment processed but server returned error
            setStatus("error");
            setMessage(response.Message || "Có lỗi xảy ra khi xác minh thanh toán.");
          }
        } else {
          // Payment failed at VNPay
          setStatus("failed");
          setMessage("Thanh toán bị từ chối. Vui lòng kiểm tra thông tin và thử lại.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Có lỗi xảy ra. Vui lòng liên hệ hỗ trợ."
        );
      }
    };

    processPayment();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8fafc" }}>
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl p-8 shadow-lg bg-white">
          {/* LOADING STATE */}
          {status === "loading" && (
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 animate-spin" size={48} color="#2563EB" />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1F2937", marginBottom: 8 }}>
                Đang xác minh thanh toán
              </h2>
              <p style={{ color: "#6B7280", fontSize: 14 }}>Vui lòng đợi...</p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {status === "success" && (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full p-3" style={{ backgroundColor: "#ecfdf5" }}>
                  <CheckCircle size={48} color="#16A34A" />
                </div>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#15803d", marginBottom: 8 }}>
                ✓ Thanh toán thành công
              </h2>
              <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 12 }}>{message}</p>
              <div
                className="p-3 rounded-lg mb-6"
                style={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb" }}
              >
                <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Mã giao dịch:</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", wordBreak: "break-all" }}>
                  {transactionId}
                </p>
              </div>
              <p style={{ fontSize: 12, color: "#9CA3AF" }}>Đang chuyển hướng tới trang chủ...</p>
            </div>
          )}

          {/* FAILED STATE */}
          {status === "failed" && (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full p-3" style={{ backgroundColor: "#fef2f2" }}>
                  <XCircle size={48} color="#DC2626" />
                </div>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#991b1b", marginBottom: 8 }}>
                ✗ Thanh toán thất bại
              </h2>
              <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>{message}</p>
              <div
                className="p-3 rounded-lg mb-6"
                style={{ backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb" }}
              >
                <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Mã giao dịch:</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1F2937", wordBreak: "break-all" }}>
                  {transactionId || "N/A"}
                </p>
              </div>
              <button
                onClick={() => navigate("/upgrade")}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                style={{
                  backgroundColor: "#2563EB",
                  color: "white",
                }}
              >
                Quay lại trang nâng cấp
              </button>
            </div>
          )}

          {/* ERROR STATE */}
          {status === "error" && (
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full p-3" style={{ backgroundColor: "#fef2f2" }}>
                  <XCircle size={48} color="#DC2626" />
                </div>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#991b1b", marginBottom: 8 }}>
                ⚠ Có lỗi xảy ra
              </h2>
              <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 16 }}>{message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/upgrade")}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    backgroundColor: "white",
                    color: "#2563EB",
                    border: "2px solid #2563EB",
                  }}
                >
                  Thử lại
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
                  style={{
                    backgroundColor: "#2563EB",
                    color: "white",
                  }}
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
