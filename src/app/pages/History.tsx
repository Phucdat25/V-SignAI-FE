import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Lock, Download, Eye, Calendar, X } from "lucide-react";
import { ApiError, formatUserPlan, getAuthToken, getUserInfo, isFreePlan } from "../api/auth";
import {
  getHistoryTypeColor,
  getMyTranslationHistory,
  getTranslationDetail,
  mapTranslationHistoryItem,
  type HistoryDisplayItem,
  type TranslationDetailDisplay,
} from "../api/translations";

const PAGE_SIZE = 10;
const FREE_HISTORY_LIMIT = 3;
const UPGRADE_MESSAGE = "Vui lòng nâng cấp để xem tính năng này";

export function History() {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryDisplayItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [planLabel, setPlanLabel] = useState("Gói miễn phí");
  const [isFreeUser, setIsFreeUser] = useState(true);
  const [upgradeHint, setUpgradeHint] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<TranslationDetailDisplay | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const closeDetail = () => {
    setDetailOpen(false);
    setDetail(null);
    setDetailError("");
  };

  const handleView = async (item: HistoryDisplayItem, isLocked: boolean) => {
    if (isLocked) {
      promptUpgrade();
      return;
    }

    setDetailOpen(true);
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);

    try {
      const data = await getTranslationDetail(item.id);
      setDetail(data);
    } catch (err) {
      console.error("History - Error fetching translation detail:", err);
      setDetailError(
        err instanceof ApiError ? err.message : "Không thể tải chi tiết bản dịch."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    const user = getUserInfo();
    const plan = user?.plan;
    setPlanLabel(formatUserPlan(plan));
    setIsFreeUser(isFreePlan(plan));
  }, []);

  const promptUpgrade = () => {
    setUpgradeHint(UPGRADE_MESSAGE);
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        if (!getAuthToken()) {
          setItems([]);
          setTotalPages(0);
          setTotalElements(0);
          setError("Vui lòng đăng nhập để xem lịch sử.");
          return;
        }

        const data = await getMyTranslationHistory(currentPage, PAGE_SIZE);
        const list = Array.isArray(data.content) ? data.content : [];
        setItems(list.map(mapTranslationHistoryItem));
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
      } catch (err) {
        console.error("History - Error fetching translation history:", err);
        setItems([]);
        if (err instanceof ApiError) {
          setError(err.message || "Không thể tải lịch sử dịch.");
        } else {
          setError("Không thể tải lịch sử dịch.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1F2937" }}>📜 Lịch sử</h1>
            <p style={{ color: "#6B7280", fontSize: 15, marginTop: 2 }}>Các cuộc hội thoại của bạn</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}>
            {planLabel}
          </span>
        </div>

        {isFreeUser && (
          <div
            className="rounded-2xl p-4 mb-6 flex items-center gap-3"
            style={{ backgroundColor: "#fffbeb", border: "1.5px solid #fde68a" }}
          >
            <Lock size={18} color="#d97706" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "#92400e" }}>Gói miễn phí: chỉ xem 3 hội thoại gần nhất</p>
              <p style={{ fontSize: 13, color: "#b45309" }}>{UPGRADE_MESSAGE}</p>
            </div>
            <button
              onClick={() => navigate("/upgrade")}
              className="ml-auto px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all whitespace-nowrap"
              style={{ backgroundColor: "#d97706", color: "white" }}
            >
              Nâng cấp
            </button>
          </div>
        )}

        {upgradeHint && (
          <div
            className="rounded-2xl p-4 mb-6 flex items-center gap-3"
            style={{ backgroundColor: "#EFF6FF", border: "1.5px solid #93c5fd" }}
          >
            <Lock size={18} color="#2563EB" />
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1d4ed8", flex: 1 }}>{upgradeHint}</p>
            <button
              onClick={() => navigate("/upgrade")}
              className="px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap"
              style={{ backgroundColor: "#2563EB", color: "white" }}
            >
              Nâng cấp ngay
            </button>
            <button
              onClick={() => setUpgradeHint("")}
              className="px-3 py-2 rounded-xl text-xs font-semibold"
              style={{ color: "#6B7280" }}
            >
              Đóng
            </button>
          </div>
        )}

        {loading && (
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p style={{ color: "#6B7280", fontSize: 15 }}>Đang tải lịch sử...</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl p-6 mb-6 text-center" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
            <p style={{ color: "#b91c1c", fontSize: 15 }}>{error}</p>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p style={{ color: "#6B7280", fontSize: 15 }}>Chưa có lịch sử hội thoại nào.</p>
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <div className="flex flex-col gap-4">
            {items.map((item, index) => {
              const typeColor = getHistoryTypeColor(item.type);
              const globalIndex = currentPage * PAGE_SIZE + index;
              const isLocked =
                item.locked || (isFreeUser && globalIndex >= FREE_HISTORY_LIMIT);

              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-5 shadow-sm relative"
                  style={{ backgroundColor: "white", border: "1px solid #e5e7eb", opacity: isLocked ? 0.75 : 1 }}
                >
                  {isLocked && (
                    <div
                      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center px-6 text-center"
                      style={{ backgroundColor: "rgba(255,255,255,0.85)", zIndex: 2 }}
                    >
                      <Lock size={28} color="#9CA3AF" />
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#6B7280", marginTop: 8 }}>
                        {UPGRADE_MESSAGE}
                      </p>
                      <button
                        onClick={() => navigate("/upgrade")}
                        className="mt-3 px-4 py-2 rounded-xl text-xs font-bold"
                        style={{ backgroundColor: "#2563EB", color: "white" }}
                      >
                        Nâng cấp ngay
                      </button>
                    </div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Calendar size={13} color="#9CA3AF" />
                          <span style={{ fontSize: 13, color: "#6B7280" }}>{item.date} · {item.time}</span>
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: typeColor + "22", color: typeColor }}
                        >
                          {item.type}
                        </span>
                        {item.duration ? (
                          <span style={{ fontSize: 12, color: "#9CA3AF" }}>⏱ {item.duration}</span>
                        ) : null}
                      </div>
                      <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.5 }} className="line-clamp-2">
                        {item.preview}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleView(item, isLocked)}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-blue-50"
                      style={{ border: "1.5px solid #2563EB", color: "#2563EB" }}
                    >
                      <Eye size={14} /> Xem
                    </button>
                    {/* <button
                      onClick={() => {
                        if (isLocked || isFreeUser) {
                          promptUpgrade();
                        }
                      }}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={
                        isLocked || isFreeUser
                          ? { backgroundColor: "#f3f4f6", color: "#9CA3AF" }
                          : { border: "1.5px solid #16A34A", color: "#16A34A" }
                      }
                    >
                      {isLocked || isFreeUser ? <Lock size={14} /> : <Download size={14} />}
                      Xuất file
                    </button> */}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div
            className="mt-6 flex items-center justify-between rounded-2xl px-4 py-3"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <p className="text-sm" style={{ color: "#6B7280" }}>
              {totalElements} hội thoại · Trang {currentPage + 1}/{totalPages}
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-50"
                style={{ borderColor: "#e5e7eb", color: "#6B7280" }}
                onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                disabled={currentPage === 0}
              >
                Trước
              </button>
              <button
                className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-50"
                style={{ borderColor: "#e5e7eb", color: "#6B7280" }}
                onClick={() => {
                  if (isFreeUser) {
                    promptUpgrade();
                    return;
                  }
                  setCurrentPage((page) => Math.min(totalPages - 1, page + 1));
                }}
                disabled={currentPage >= totalPages - 1}
              >
                Tiếp
              </button>
            </div>
          </div>
        )}
      </div>

      {detailOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={closeDetail}
        >
          <div
            className="rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl"
            style={{ backgroundColor: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-4 border-b sticky top-0"
              style={{ borderColor: "#e5e7eb", backgroundColor: "white" }}
            >
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1F2937" }}>Chi tiết bản dịch</h2>
              <button
                onClick={closeDetail}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Đóng"
              >
                <X size={20} color="#6B7280" />
              </button>
            </div>

            <div className="px-6 py-5">
              {detailLoading && (
                <p style={{ fontSize: 15, color: "#6B7280", textAlign: "center", padding: "24px 0" }}>
                  Đang tải chi tiết...
                </p>
              )}

              {!detailLoading && detailError && (
                <p style={{ fontSize: 15, color: "#b91c1c", textAlign: "center", padding: "24px 0" }}>
                  {detailError}
                </p>
              )}

              {!detailLoading && !detailError && detail && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontSize: 13, color: "#6B7280" }}>
                      {detail.date} · {detail.time}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: getHistoryTypeColor(detail.type) + "22",
                        color: getHistoryTypeColor(detail.type),
                      }}
                    >
                      {detail.type}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: "#f0fdf4", color: "#16A34A" }}
                    >
                      {detail.status}
                    </span>
                  </div>

                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}
                  >
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>
                      Nội dung đầu vào
                    </p>
                    <p style={{ fontSize: 15, color: "#1F2937", lineHeight: 1.5 }}>{detail.inputLabel}</p>
                  </div>

                  <div
                    className="rounded-xl p-4"
                    style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}
                  >
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", marginBottom: 6 }}>
                      Kết quả dịch
                    </p>
                    <p style={{ fontSize: 15, color: "#1F2937", lineHeight: 1.5, fontWeight: 600 }}>
                      {detail.outputLabel}
                    </p>
                  </div>

                  {detail.resultUrl && (
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>
                        Video ký hiệu
                      </p>
                      <video
                        src={detail.resultUrl}
                        controls
                        className="w-full rounded-xl"
                        style={{ maxHeight: 320, backgroundColor: "#000" }}
                      />
                    </div>
                  )}

                  {detail.sourceUrl && (
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>
                        Nguồn gốc
                      </p>
                      <a
                        href={detail.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 14, color: "#2563EB", wordBreak: "break-all" }}
                      >
                        {detail.sourceUrl}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
