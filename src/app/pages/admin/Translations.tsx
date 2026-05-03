import { AdminLayout } from "../../components/AdminLayout";
import { Search, Filter, Download, TrendingUp, MessageSquare } from "lucide-react";
import { useState } from "react";

const translationsData = [
  {
    id: "TRN-9847",
    user: "Nguyễn Văn An",
    type: "Giọng nói sang ký hiệu",
    input: "Xin chào, tôi cần giúp đỡ",
    output: "Hello, I need help",
    accuracy: "99.5%",
    duration: "3.2s",
    timestamp: "10/03/2024 14:23:15",
    status: "Thành công",
  },
  {
    id: "TRN-9846",
    user: "Trần Thị Bình",
    type: "Ký hiệu sang giọng nói",
    input: "Cảm ơn bạn",
    output: "Thank you",
    accuracy: "98.8%",
    duration: "2.1s",
    timestamp: "10/03/2024 14:18:42",
    status: "Thành công",
  },
  {
    id: "TRN-9845",
    user: "Lê Hoàng Minh",
    type: "Giọng nói sang ký hiệu",
    input: "Tôi muốn uống nước",
    output: "I want to drink water",
    accuracy: "99.2%",
    duration: "2.8s",
    timestamp: "10/03/2024 14:12:08",
    status: "Thành công",
  },
  {
    id: "TRN-9844",
    user: "Phạm Thu Hà",
    type: "Ký hiệu sang giọng nói",
    input: "Nhà vệ sinh ở đâu?",
    output: "Where is the restroom?",
    accuracy: "97.3%",
    duration: "3.5s",
    timestamp: "10/03/2024 14:05:31",
    status: "Độ tin cậy thấp",
  },
  {
    id: "TRN-9843",
    user: "Võ Minh Tuấn",
    type: "Giọng nói sang ký hiệu",
    input: "Bệnh viện gần nhất ở đâu?",
    output: "Where is the nearest hospital?",
    accuracy: "99.1%",
    duration: "4.2s",
    timestamp: "10/03/2024 13:58:16",
    status: "Thành công",
  },
  {
    id: "TRN-9842",
    user: "Đặng Thị Lan",
    type: "Giọng nói sang ký hiệu",
    input: "Tạm biệt",
    output: "Goodbye",
    accuracy: "99.8%",
    duration: "1.5s",
    timestamp: "10/03/2024 13:47:22",
    status: "Thành công",
  },
];

export function Translations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTranslations = translationsData.filter((trans) => {
    const matchesSearch =
      trans.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trans.input.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trans.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || trans.type === filterType;
    const matchesStatus = filterStatus === "all" || trans.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
              Nhật ký dịch thuật
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Theo dõi tất cả hoạt động và hiệu suất dịch thuật
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
            style={{ backgroundColor: "#2563EB", color: "white" }}
          >
            <Download size={18} />
            Xuất nhật ký
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={18} style={{ color: "#2563EB" }} />
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Tổng dịch thuật hôm nay
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#1F2937" }}>
              8,942
            </p>
            <p className="text-xs mt-1" style={{ color: "#16A34A" }}>
              +8.2% so với hôm qua
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} style={{ color: "#1d4ed8" }} />
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Tỷ lệ thành công
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#1F2937" }}>
              99.2%
            </p>
            <p className="text-xs mt-1" style={{ color: "#16A34A" }}>
              +0.3% tuần này
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Giọng nói sang ký hiệu
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#1F2937" }}>
              5,234
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
          >
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Ký hiệu sang giọng nói
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#1F2937" }}>
              3,708
            </p>
          </div>
        </div>

        {/* Filters and Search */}
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
                placeholder="Tìm kiếm theo người dùng, bản dịch hoặc ID..."
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
            <div className="flex gap-3">
              <div className="flex items-center gap-2">
                <Filter size={18} style={{ color: "#6B7280" }} />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2.5 rounded-lg text-sm border"
                  style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
                >
                  <option value="all">Tất cả loại</option>
                  <option value="Giọng nói sang ký hiệu">Giọng nói sang ký hiệu</option>
                  <option value="Ký hiệu sang giọng nói">Ký hiệu sang giọng nói</option>
                </select>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm border"
                style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="thành công">Thành công</option>
                <option value="độ tin cậy thấp">Độ tin cậy thấp</option>
              </select>
            </div>
          </div>
        </div>

        {/* Translations Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    ID DỊCH THUẬT
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    NGƯỜI DÙNG
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    LOẠI
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    ĐẦU VÀO
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    ĐẦU RA
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    ĐỘ CHÍNH XÁC
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    THỜI LƯỢNG
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    THỜI GIAN
                  </th>
                  <th
                    className="text-left px-6 py-4 text-xs font-semibold"
                    style={{ color: "#6B7280" }}
                  >
                    TRẠNG THÁI
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTranslations.map((trans) => (
                  <tr
                    key={trans.id}
                    className="border-t hover:bg-gray-50"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                      {trans.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                      {trans.user}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor:
                            trans.type === "Giọng nói sang ký hiệu" ? "#EFF6FF" : "#DBEAFE",
                          color: trans.type === "Giọng nói sang ký hiệu" ? "#2563EB" : "#1d4ed8",
                        }}
                      >
                        {trans.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {trans.input}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {trans.output}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#1F2937" }}>
                      {trans.accuracy}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {trans.duration}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {trans.timestamp}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor:
                            trans.status === "Thành công" ? "#DCFCE7" : "#FEF3C7",
                          color: trans.status === "Thành công" ? "#16A34A" : "#F59E0B",
                        }}
                      >
                        {trans.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="px-6 py-4 border-t flex items-center justify-between"
            style={{ borderColor: "#e5e7eb" }}
          >
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Hiển thị {filteredTranslations.length} trong số {translationsData.length} bản dịch
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded-lg text-sm border"
                style={{ borderColor: "#e5e7eb", color: "#6B7280" }}
              >
                Trước
              </button>
              <button
                className="px-3 py-1.5 rounded-lg text-sm"
                style={{ backgroundColor: "#2563EB", color: "white" }}
              >
                1
              </button>
              <button
                className="px-3 py-1.5 rounded-lg text-sm border"
                style={{ borderColor: "#e5e7eb", color: "#6B7280" }}
              >
                2
              </button>
              <button
                className="px-3 py-1.5 rounded-lg text-sm border"
                style={{ borderColor: "#e5e7eb", color: "#6B7280" }}
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
