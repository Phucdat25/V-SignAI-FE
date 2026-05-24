import { AdminLayout } from "../../components/AdminLayout";
import { Search, Eye, Ban, Trash2, Download, Loader, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { createAdminUser, AdminCreateUserRequest } from "../../api/admin-users";
import {
  getAdminUsers,
  getAdminUserStatistics,
  updateAdminUserStatus,
  AdminUserResponse,
  AdminUserStatisticsResponse,
  AdminUsersPageResponse,
} from "../../api/admin-users";

export function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [users, setUsers] = useState<AdminUserResponse[]>([]);
  const [statistics, setStatistics] = useState<AdminUserStatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

   // Function fetch lại dữ liệu, dùng cho cả useEffect và sau khi tạo user
  async function refreshUsers() {
    setLoading(true);
    try {
      const statsData = await getAdminUserStatistics();
      setStatistics(statsData);

      const usersData = await getAdminUsers(currentPage, 10);
      setUsers(usersData.content);
      setTotalPages(usersData.totalPages);
      setTotalUsers(usersData.totalElements);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch users data";
      setError(errorMessage);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }


  // Fetch users and statistics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch statistics
        const statsData = await getAdminUserStatistics();
        setStatistics(statsData);

        // Fetch users
        const usersData = await getAdminUsers(currentPage, 10);
        setUsers(usersData.content);
        setTotalPages(usersData.totalPages);
        setTotalUsers(usersData.totalElements);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch users data";
        setError(errorMessage);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // Filter users based on search and filter criteria
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.id && String(user.id).includes(searchTerm));
    const matchesStatus = filterStatus === "all" || user.status.toLowerCase().includes(filterStatus);
    return matchesSearch && matchesStatus;
  });

  // Handle user status update
  const handleStatusUpdate = async (userId: number, newStatus: string) => {
    try {
      setActionLoading(userId);
      await updateAdminUserStatus(userId, newStatus);
      
      // Update local state
      setUsers(users.map(user =>
        user.id === userId ? { ...user, status: newStatus as "Hoạt động" | "Không hoạt động" | "Bị đình chỉ" } : user
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update user status";
      console.error("Error updating user status:", err);
      alert("Lỗi: " + errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Error Alert */}
        {error && (
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: "#FEE2E2", borderColor: "#FECACA", color: "#DC2626" }}
          >
            <p className="text-sm font-medium">Lỗi: {error}</p>
          </div>
        )}

        {/* Page Header */}
        {/* <div className="flex items-center justify-between">
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

        </div> */}
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
    onClick={() => setIsCreateUserModalOpen(true)}
  >
    <Plus size={18} />
    Tạo người dùng
  </button>
</div>
{/* Popup tạo user */}
{isCreateUserModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div
      className="w-[400px] rounded-xl bg-white p-6 shadow-xl"
      onClick={(e) => e.stopPropagation()} // Không đóng modal khi click vào form
    >
      <h3 className="text-lg font-semibold mb-4">Tạo người dùng mới</h3>

      <form
        onSubmit={async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const planCode = formData.get("planCode") as string;
    const role = formData.get("role") as string;
    const password = formData.get("password") as string;
    try {
      const request: AdminCreateUserRequest = { email, name, planCode, role, password };
      await createAdminUser(request);
      await refreshUsers(); // refetch danh sách
      setIsCreateUserModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Tạo người dùng thất bại";
      alert("Lỗi: " + message);
    }}}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" style={{ color: "#1F2937" }}>
              Tên người dùng
            </label>
            <input
              type="text"
              name="name"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
            />
          </div>

          <div>
            <label className="text-sm font-medium" style={{ color: "#1F2937" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
            />
          </div>

          <div>
  <label className="text-sm font-medium" style={{ color: "#1F2937" }}>
    Mật khẩu
  </label>
  <input
    type="password"
    name="password"
    required
    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
    style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
  />
</div>

          <div>
            <label className="text-sm font-medium" style={{ color: "#1F2937" }}>
              Gói
            </label>
            <select
              name="planCode"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
            >
              <option value="">Chọn gói</option>
              <option value="PRO_MONTH">Gói cao cấp tháng</option>
              <option value="PRO_YEAR">Gói cao cấp năm</option>
              <option value="FREE">Miễn phí</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium" style={{ color: "#1F2937" }}>
              Role
            </label>
            <select
              name="role"
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: "#e5e7eb", color: "#1F2937" }}
            >
              <option value="">Chọn role</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateUserModalOpen(false)}
              className="px-4 py-2 rounded-lg border text-sm"
              style={{ borderColor: "#e5e7eb", color: "#6B7280" }}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
            >
              Tạo
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
)}
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Tổng người dùng
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#1F2937" }}>
              {statistics?.totalUsers?.toLocaleString() || "-"}
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Người dùng cao cấp
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#2563EB" }}>
              {statistics?.premiumUsers?.toLocaleString() || "-"}
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Hoạt động hôm nay
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#16A34A" }}>
              {statistics?.activeToday?.toLocaleString() || "-"}
            </p>
          </div>
          {/* <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Bị đình chỉ
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: "#DC2626" }}>
              {statistics?.suspendedUsers?.toLocaleString() || "-"}
            </p>
          </div> */}
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size={32} className="animate-spin" style={{ color: "#2563EB" }} />
              </div>
            ) : (
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
                      ROLE
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                      TRẠNG THÁI
                    </th>
                    {/* <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                      THAM GIA
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                      HOẠT ĐỘNG GẦN NHẤT
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                      DỊCH THUẬT
                    </th> */}
                    <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                      HÀNH ĐỘNG
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
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
                              backgroundColor:
                                user.planCode === "PRO_YEAR"
                                  ? "#1E40AF"
                                  : user.planCode === "PRO_MONTH"
                                  ? "#3B82F6"
                                  : "#F3F4F6",
                              color:
                                user.planCode === "PRO_YEAR"
                                  ? "white"
                                  : user.planCode === "PRO_MONTH"
                                  ? "white"
                                  : "#6B7280",
                            }}
                          >
                            {user.planName === "Pro Yearly"
                              ? "Gói cao cấp năm"
                              : user.planName === "Pro Monthly"
                              ? "Gói cao cấp tháng"
                              : "Miễn phí"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: "#EFF6FF",
                              color: "#2563EB",
                            }}
                          >
                            {user.role}
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
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                              title="Xem"
                              disabled={actionLoading === user.id}
                            >
                              <Eye size={16} style={{ color: "#2563EB" }} />
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                              title="Đình chỉ"
                              disabled={actionLoading === user.id}
                              onClick={() => handleStatusUpdate(user.id, "Bị đình chỉ")}
                            >
                              {actionLoading === user.id ? (
                                <Loader size={16} className="animate-spin" style={{ color: "#F59E0B" }} />
                              ) : (
                                <Ban size={16} style={{ color: "#F59E0B" }} />
                              )}
                            </button>
                            <button
                              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                              title="Xóa"
                              disabled={actionLoading === user.id}
                            >
                              <Trash2 size={16} style={{ color: "#DC2626" }} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center" style={{ color: "#6B7280" }}>
                        Không tìm thấy người dùng
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div
            className="px-6 py-4 border-t flex items-center justify-between"
            style={{ borderColor: "#e5e7eb" }}
          >
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Hiển thị {filteredUsers.length} trong số {totalUsers} người dùng
            </p>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded-lg text-sm border disabled:opacity-50"
                style={{ borderColor: "#e5e7eb", color: "#6B7280" }}
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
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
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1 || loading}
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