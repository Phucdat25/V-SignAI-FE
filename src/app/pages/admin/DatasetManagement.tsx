import { AdminLayout } from "../../components/AdminLayout";
import { Search, Plus, Edit, Trash2, CheckCircle, XCircle, Video } from "lucide-react";
import { useState } from "react";

const signDataset = [
  {
    id: "SIGN-1045",
    gesture: "Xin chào",
    meaning: "Xin chào / Lời chào",
    category: "Lời chào",
    videoUrl: "gesture-hello.mp4",
    status: "Hoạt động",
    uploadDate: "15/01/2024",
    accuracy: "99.5%",
  },
  {
    id: "SIGN-1044",
    gesture: "Cảm ơn",
    meaning: "Cảm ơn",
    category: "Lịch sự",
    videoUrl: "gesture-thankyou.mp4",
    status: "Hoạt động",
    uploadDate: "20/01/2024",
    accuracy: "98.8%",
  },
  {
    id: "SIGN-1043",
    gesture: "Tạm biệt",
    meaning: "Tạm biệt",
    category: "Lời chào",
    videoUrl: "gesture-goodbye.mp4",
    status: "Hoạt động",
    uploadDate: "03/02/2024",
    accuracy: "99.2%",
  },
  {
    id: "SIGN-1042",
    gesture: "Có",
    meaning: "Có",
    category: "Phản hồi",
    videoUrl: "gesture-yes.mp4",
    status: "Hoạt động",
    uploadDate: "10/02/2024",
    accuracy: "99.7%",
  },
  {
    id: "SIGN-1041",
    gesture: "Không",
    meaning: "Không",
    category: "Phản hồi",
    videoUrl: "gesture-no.mp4",
    status: "Hoạt động",
    uploadDate: "10/02/2024",
    accuracy: "99.4%",
  },
  {
    id: "SIGN-1040",
    gesture: "Giúp đỡ",
    meaning: "Giúp đỡ",
    category: "Yêu cầu",
    videoUrl: "gesture-help.mp4",
    status: "Đang kiểm tra",
    uploadDate: "05/03/2024",
    accuracy: "97.2%",
  },
  {
    id: "SIGN-1039",
    gesture: "Nước",
    meaning: "Nước",
    category: "Nhu yếu phẩm",
    videoUrl: "gesture-water.mp4",
    status: "Hoạt động",
    uploadDate: "12/03/2024",
    accuracy: "98.9%",
  },
  {
    id: "SIGN-1038",
    gesture: "Ăn",
    meaning: "Ăn / Thức ăn",
    category: "Nhu yếu phẩm",
    videoUrl: "gesture-eat.mp4",
    status: "Hoạt động",
    uploadDate: "18/03/2024",
    accuracy: "99.1%",
  },
  {
    id: "SIGN-1037",
    gesture: "Bệnh viện",
    meaning: "Bệnh viện",
    category: "Địa điểm",
    videoUrl: "gesture-hospital.mp4",
    status: "Không hoạt động",
    uploadDate: "02/04/2024",
    accuracy: "96.5%",
  },
  {
    id: "SIGN-1036",
    gesture: "Nhà vệ sinh",
    meaning: "Nhà vệ sinh / Toilet",
    category: "Địa điểm",
    videoUrl: "gesture-restroom.mp4",
    status: "Hoạt động",
    uploadDate: "15/04/2024",
    accuracy: "98.6%",
  },
];

export function DatasetManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredData = signDataset.filter((sign) => {
    const matchesSearch =
      sign.gesture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sign.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sign.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || sign.category === filterCategory;
    const matchesStatus = filterStatus === "all" || sign.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
              Dữ liệu ngôn ngữ ký hiệu
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Quản lý dữ liệu huấn luyện AI cho nhận diện ngôn ngữ ký hiệu
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
            style={{ backgroundColor: "#2563EB", color: "white" }}
          >
            <Plus size={18} />
            Thêm ký hiệu mới
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Tổng số ký hiệu
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#1F2937" }}>
              1,045
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Hoạt động
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#16A34A" }}>
              982
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Đang kiểm tra
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#F59E0B" }}>
              48
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Độ chính xác TB
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#2563EB" }}>
              99.2%
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
                placeholder="Tìm kiếm theo ký hiệu, ý nghĩa hoặc ID..."
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
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm border"
                style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
              >
                <option value="all">Tất cả danh mục</option>
                <option value="Lời chào">Lời chào</option>
                <option value="Lịch sự">Lịch sự</option>
                <option value="Phản hồi">Phản hồi</option>
                <option value="Yêu cầu">Yêu cầu</option>
                <option value="Nhu yếu phẩm">Nhu yếu phẩm</option>
                <option value="Địa điểm">Địa điểm</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm border"
                style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="hoạt động">Hoạt động</option>
                <option value="kiểm tra">Đang kiểm tra</option>
                <option value="không hoạt động">Không hoạt động</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dataset Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    ID KÝ HIỆU
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    KÝ HIỆU
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    Ý NGHĨA
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    DANH MỤC
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    XEM TRƯỚC VIDEO
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    TRẠNG THÁI
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    ĐỘ CHÍNH XÁC
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    NGÀY TẢI LÊN
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    HÀNH ĐỘNG
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((sign) => (
                  <tr key={sign.id} className="border-t hover:bg-gray-50" style={{ borderColor: "#e5e7eb" }}>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                      {sign.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#1F2937" }}>
                      {sign.gesture}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {sign.meaning}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: "#F3F4F6",
                          color: "#6B7280",
                        }}
                      >
                        {sign.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-2 text-sm hover:underline" style={{ color: "#2563EB" }}>
                        <Video size={16} />
                        {sign.videoUrl}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1"
                        style={{
                          backgroundColor:
                            sign.status === "Hoạt động"
                              ? "#DCFCE7"
                              : sign.status === "Đang kiểm tra"
                              ? "#FEF3C7"
                              : "#F3F4F6",
                          color:
                            sign.status === "Hoạt động"
                              ? "#16A34A"
                              : sign.status === "Đang kiểm tra"
                              ? "#F59E0B"
                              : "#6B7280",
                        }}
                      >
                        {sign.status === "Hoạt động" ? (
                          <CheckCircle size={12} />
                        ) : sign.status === "Không hoạt động" ? (
                          <XCircle size={12} />
                        ) : null}
                        {sign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#1F2937" }}>
                      {sign.accuracy}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {sign.uploadDate}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} style={{ color: "#2563EB" }} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} style={{ color: "#DC2626" }} />
                        </button>
                      </div>
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
              Hiển thị {filteredData.length} trong số {signDataset.length} ký hiệu
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