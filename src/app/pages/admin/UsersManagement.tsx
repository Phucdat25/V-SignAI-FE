import { AdminLayout } from "../../components/AdminLayout";
import { Search, Eye, Ban, Trash2, Download, Filter } from "lucide-react";
import { useState } from "react";

const usersData = [
  {
    id: "USR-1248",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    plan: "Cao cấp",
    status: "Hoạt động",
    joined: "15 Tháng 1, 2024",
    lastActive: "2 phút trước",
    translations: 1247,
  },
  {
    id: "USR-1247",
    name: "Trần Thị Bình",
    email: "tranthibinh@email.com",
    plan: "Miễn phí",
    status: "Hoạt động",
    joined: "3 Tháng 2, 2024",
    lastActive: "15 phút trước",
    translations: 342,
  },
  {
    id: "USR-1246",
    name: "Lê Hoàng Minh",
    email: "lehoangminh@email.com",
    plan: "Cao cấp",
    status: "Hoạt động",
    joined: "22 Tháng 3, 2024",
    lastActive: "1 giờ trước",
    translations: 2156,
  },
  {
    id: "USR-1245",
    name: "Phạm Thu Hà",
    email: "phamthuha@email.com",
    plan: "Miễn phí",
    status: "Không hoạt động",
    joined: "10 Tháng 4, 2024",
    lastActive: "2 ngày trước",
    translations: 89,
  },
  {
    id: "USR-1244",
    name: "Võ Minh Tuấn",
    email: "vominhtuan@email.com",
    plan: "Cao cấp",
    status: "Hoạt động",
    joined: "5 Tháng 5, 2024",
    lastActive: "5 giờ trước",
    translations: 1842,
  },
  {
    id: "USR-1243",
    name: "Đặng Thị Lan",
    email: "dangthilan@email.com",
    plan: "Miễn phí",
    status: "Bị đình chỉ",
    joined: "18 Tháng 5, 2024",
    lastActive: "1 tuần trước",
    translations: 45,
  },
  {
    id: "USR-1242",
    name: "Hoàng Văn Đức",
    email: "hoangvanduc@email.com",
    plan: "Cao cấp",
    status: "Hoạt động",
    joined: "2 Tháng 6, 2024",
    lastActive: "30 phút trước",
    translations: 987,
  },
  {
    id: "USR-1241",
    name: "Ngô Thị Mai",
    email: "ngothimai@email.com",
    plan: "Miễn phí",
    status: "Hoạt động",
    joined: "12 Tháng 6, 2024",
    lastActive: "3 giờ trước",
    translations: 234,
  },
];

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === "all" || user.plan.toLowerCase().includes(filterPlan);
    const matchesStatus = filterStatus === "all" || user.status.toLowerCase().includes(filterStatus);
    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
              Quản lý người dùng
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Quản lý và giám sát tất cả người dùng V-Sign AI
            </p>
          </div>
          <button
            className="px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 hover:opacity-90 transition-all"
            style={{ backgroundColor: "#2563EB", color: "white" }}
          >
            <Download size={18} />
            Xuất dữ liệu
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Tổng người dùng
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#1F2937" }}>
              12,458
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Người dùng cao cấp
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#2563EB" }}>
              2,847
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Hoạt động hôm nay
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#16A34A" }}>
              8,234
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Bị đình chỉ
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#DC2626" }}>
              42
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
                placeholder="Tìm kiếm theo tên, email hoặc ID..."
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
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="px-4 py-2.5 rounded-lg text-sm border"
                  style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
                >
                  <option value="all">Tất cả gói</option>
                  <option value="miễn phí">Miễn phí</option>
                  <option value="cao cấp">Cao cấp</option>
                </select>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-lg text-sm border"
                style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="hoạt động">Hoạt động</option>
                <option value="không hoạt động">Không hoạt động</option>
                <option value="bị đình chỉ">Bị đình chỉ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    ID NGƯỜI DÙNG
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    TÊN
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    EMAIL
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    GÓI
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    TRẠNG THÁI
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    THAM GIA
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    HOẠT ĐỘNG GẦN NHẤT
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    DỊCH THUẬT
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    HÀNH ĐỘNG
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50" style={{ borderColor: "#e5e7eb" }}>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                      {user.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: user.plan === "Cao cấp" ? "#EFF6FF" : "#F3F4F6",
                          color: user.plan === "Cao cấp" ? "#2563EB" : "#6B7280",
                        }}
                      >
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor:
                            user.status === "Hoạt động"
                              ? "#DCFCE7"
                              : user.status === "Bị đình chỉ"
                              ? "#FEE2E2"
                              : "#F3F4F6",
                          color:
                            user.status === "Hoạt động"
                              ? "#16A34A"
                              : user.status === "Bị đình chỉ"
                              ? "#DC2626"
                              : "#6B7280",
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {user.joined}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {user.lastActive}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                      {user.translations.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Xem"
                        >
                          <Eye size={16} style={{ color: "#2563EB" }} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Đình chỉ"
                        >
                          <Ban size={16} style={{ color: "#F59E0B" }} />
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
              Hiển thị {filteredUsers.length} trong số {usersData.length} người dùng
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
                3
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