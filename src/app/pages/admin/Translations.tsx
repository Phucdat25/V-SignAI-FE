import { AdminLayout } from "../../components/AdminLayout";
import { Search, Filter, Eye, X, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { ApiError } from "../../api/auth";
import {
  getAdminTranslationHistory,
  getHistoryTypeColor,
  getTranslationDetail,
  mapAdminTranslationHistoryItem,
  type AdminTranslationHistoryItem,
  type TranslationDetailDisplay,
} from "../../api/translations";

const PAGE_SIZE = 10;

export function Translations() {
  const [items, setItems] = useState<AdminTranslationHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<TranslationDetailDisplay | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminTranslationHistory(currentPage, PAGE_SIZE);
        setItems(data.content.map(mapAdminTranslationHistoryItem));
        setTotalPages(data.totalPages);
        setTotalItems(data.totalElements);
      } catch (err) {
        console.error("Admin translations - fetch error:", err);
        setItems([]);
        setError(
          err instanceof ApiError ? err.message : "Không thể tải lịch sử dịch."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage]);

  const filteredItems = items.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      !q ||
      item.userLabel.toLowerCase().includes(q) ||
      item.inputLabel.toLowerCase().includes(q) ||
      item.outputLabel.toLowerCase().includes(q) ||
      item.preview.toLowerCase().includes(q) ||
      String(item.id).includes(q);
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const closeDetail = () => {
    setDetailOpen(false);
    setDetail(null);
    setDetailError("");
  };

  const handleView = async (id: number) => {
    setDetailOpen(true);
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);

    try {
      const data = await getTranslationDetail(id);
      setDetail(data);
    } catch (err) {
      console.error("Admin translations - detail error:", err);
      setDetailError(
        err instanceof ApiError ? err.message : "Không thể tải chi tiết bản dịch."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
            Lịch sử dịch thuật
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Xem toàn bộ lịch sử dịch của người dùng trong hệ thống
          </p>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Tổng số bản dịch
          </p>
          <p className="text-2xl font-bold mt-1" style={{ color: "#1F2937" }}>
            {totalItems.toLocaleString("vi-VN")}
          </p>
        </div>

        <div
          className="p-6 rounded-2xl"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: "#9CA3AF" }}
              />
              <input
                type="text"
                placeholder="Tìm theo ID, người dùng, nội dung..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm"
                style={{
                  backgroundColor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  color: "#1F2937",
                }}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={18} style={{ color: "#6B7280" }} />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2.5 rounded-lg text-sm border"
                  style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="Giọng nói → Ký hiệu">Giọng nói → Ký hiệu</option>
                  <option value="Ký hiệu → Giọng nói">Ký hiệu → Giọng nói</option>
                </select>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm border"
                style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Thành công">Thành công</option>
                <option value="Thất bại">Thất bại</option>
                <option value="Đang xử lý">Đang xử lý</option>
              </select>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-16" style={{ color: "#6B7280" }}>
              <Loader size={20} className="animate-spin" />
              <span>Đang tải lịch sử...</span>
            </div>
          ) : error ? (
            <div className="py-16 text-center" style={{ color: "#b91c1c" }}>
              {error}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead style={{ backgroundColor: "#f9fafb" }}>
                    <tr>
                      {["ID", "NGƯỜI DÙNG", "LOẠI", "ĐẦU VÀO", "ĐẦU RA", "THỜI GIAN", "TRẠNG THÁI"].map(
                        (col) => (
                          <th
                            key={col}
                            className="text-left px-6 py-4 text-xs font-semibold"
                            style={{ color: "#6B7280" }}
                          >
                            {col}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-sm" style={{ color: "#6B7280" }}>
                          Không có bản dịch nào
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item) => {
                        const typeColor = getHistoryTypeColor(item.type);
                        const isSuccess = item.status === "Thành công";

                        return (
                          <tr
                            key={item.id}
                            className="border-t hover:bg-gray-50"
                            style={{ borderColor: "#e5e7eb" }}
                          >
                            <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                              {item.id}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                              {item.userLabel}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{ backgroundColor: typeColor + "22", color: typeColor }}
                              >
                                {item.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm max-w-[200px] truncate" style={{ color: "#6B7280" }}>
                              {item.inputLabel}
                            </td>
                            <td className="px-6 py-4 text-sm max-w-[200px] truncate" style={{ color: "#6B7280" }}>
                              {item.outputLabel}
                            </td>
                            <td className="px-6 py-4 text-sm whitespace-nowrap" style={{ color: "#6B7280" }}>
                              {item.date} · {item.time}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={{
                                  backgroundColor: isSuccess ? "#DCFCE7" : "#FEF3C7",
                                  color: isSuccess ? "#16A34A" : "#F59E0B",
                                }}
                              >
                                {item.status}
                              </span>
                            </td>
                            {/* <td className="px-6 py-4">
                              <button
                                onClick={() => handleView(item.id)}
                                className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye size={18} color="#2563EB" />
                              </button>
                            </td> */}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div
                className="px-6 py-4 border-t flex items-center justify-between flex-wrap gap-3"
                style={{ borderColor: "#e5e7eb" }}
              >
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  {totalItems} bản dịch · Trang {currentPage + 1}/{Math.max(totalPages, 1)}
                </p>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-50"
                    style={{ borderColor: "#e5e7eb", color: "#6B7280" }}
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0 || loading}
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      className="px-3 py-1.5 rounded-lg text-sm border"
                      style={{
                        backgroundColor: index === currentPage ? "#2563EB" : "white",
                        borderColor: "#e5e7eb",
                        color: index === currentPage ? "white" : "#6B7280",
                      }}
                      onClick={() => setCurrentPage(index)}
                      disabled={loading}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-50"
                    style={{ borderColor: "#e5e7eb", color: "#6B7280" }}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1 || loading}
                  >
                    Tiếp
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
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
              <button onClick={closeDetail} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Đóng">
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
                  <div className="rounded-xl p-4" style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 6 }}>Nội dung đầu vào</p>
                    <p style={{ fontSize: 15, color: "#1F2937" }}>{detail.inputLabel}</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE" }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", marginBottom: 6 }}>Kết quả dịch</p>
                    <p style={{ fontSize: 15, color: "#1F2937", fontWeight: 600 }}>{detail.outputLabel}</p>
                  </div>
                  {detail.resultUrl && (
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 8 }}>Video ký hiệu</p>
                      <video
                        src={detail.resultUrl}
                        controls
                        className="w-full rounded-xl"
                        style={{ maxHeight: 320, backgroundColor: "#000" }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
