import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/AdminLayout";
import { Edit, Plus, Loader } from "lucide-react";
import {
  AdminSubscriptionPlanResponse,
  SubscriptionPlanRequest,
  createAdminSubscriptionPlan,
  getAdminSubscriptionPlans,
  updateAdminSubscriptionPlan,
} from "../../api/admin-subscriptions";

interface SubscriptionPlanFormValues extends SubscriptionPlanRequest {
  isActive: boolean;
}

const initialPlanFormState: SubscriptionPlanFormValues = {
  code: "",
  name: "",
  price: 0,
  currency: "VND",
  intervalUnit: "MONTH",
  intervalCount: 1,
  isActive: true,
};

export function Subscriptions() {
  const [plans, setPlans] = useState<AdminSubscriptionPlanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<SubscriptionPlanFormValues>(initialPlanFormState);
  const [selectedPlan, setSelectedPlan] = useState<AdminSubscriptionPlanResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAdminSubscriptionPlans();
        setPlans(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không thể tải danh sách gói");
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedPlan(null);
    setFormData(initialPlanFormState);
    setFormError(null);
    setSuccessMessage(null);
  };

  const handleOpenEdit = (plan: AdminSubscriptionPlanResponse) => {
    setFormMode("edit");
    setSelectedPlan(plan);
    setFormData({
      code: plan.code,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      intervalUnit: plan.intervalUnit,
      intervalCount: plan.intervalCount,
      isActive: plan.isActive,
    });
    setFormError(null);
    setSuccessMessage(null);
  };

  const handleFormChange = (
    field: keyof SubscriptionPlanFormValues,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFormError(null);
    setSuccessMessage(null);

    const payload: SubscriptionPlanRequest = {
      code: formData.code,
      name: formData.name,
      price: Number(formData.price),
      currency: formData.currency,
      intervalUnit: formData.intervalUnit,
      intervalCount: Number(formData.intervalCount),
      isActive: formData.isActive,
    };

    try {
      if (formMode === "create") {
        await createAdminSubscriptionPlan(payload);
        setSuccessMessage("Tạo gói đăng ký thành công.");
      } else if (selectedPlan) {
        await updateAdminSubscriptionPlan(selectedPlan.id, payload);
        setSuccessMessage("Cập nhật gói đăng ký thành công.");
      }

      const refreshedPlans = await getAdminSubscriptionPlans();
      setPlans(refreshedPlans);
      setSelectedPlan(null);
      setFormMode("create");
      setFormData(initialPlanFormState);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Có lỗi xảy ra khi gửi dữ liệu");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
            Quản lý gói đăng ký
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Quản lý các gói đăng ký
          </p>
        </div>

        {/* Revenue Stats */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} style={{ color: "#2563EB" }} />
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Doanh thu tháng
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#1F2937" }}>
              167,796,000₫
            </p>
            <p className="text-xs mt-1" style={{ color: "#16A34A" }}>
              +12.3% so với tháng trước
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={18} style={{ color: "#1d4ed8" }} />
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Doanh thu năm
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#1F2937" }}>
              577,677,000₫
            </p>
            <p className="text-xs mt-1" style={{ color: "#16A34A" }}>
              +18.7% so với năm trước
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <div className="flex items-center gap-2 mb-2">
              <Users size={18} style={{ color: "#F59E0B" }} />
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Người dùng cao cấp
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#1F2937" }}>
              2,847
            </p>
            <p className="text-xs mt-1" style={{ color: "#16A34A" }}>
              +8.5% tháng này
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} style={{ color: "#10B981" }} />
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Tỷ lệ chuyển đổi
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ color: "#1F2937" }}>
              22.8%
            </p>
            <p className="text-xs mt-1" style={{ color: "#16A34A" }}>
              +3.2% tháng này
            </p>
          </div>
        </div> */}

        {/* Subscription Plans */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                Các gói đăng ký
              </h2>
              <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                Hiển thị và quản lý các gói đăng ký hiện có.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "#2563EB" }}
            >
              <Plus size={16} />
              Tạo gói mới
            </button>
          </div>

          {successMessage && (
            <div className="rounded-2xl p-4" style={{ backgroundColor: "#ECFDF5", border: "1px solid #D1FAE5" }}>
              <p className="text-sm font-medium" style={{ color: "#166534" }}>
                {successMessage}
              </p>
            </div>
          )}

          {loading ? (
            <div className="h-64 flex items-center justify-center rounded-2xl" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
              <Loader className="animate-spin" size={28} style={{ color: "#2563EB" }} />
            </div>
          ) : error ? (
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
              <p className="text-sm font-medium" style={{ color: "#B91C1C" }}>
                {error}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl p-6"
                  style={{ backgroundColor: "white", border: "2px solid #e5e7eb" }}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-xl font-bold" style={{ color: "#1F2937" }}>
                        {plan.name}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                        {plan.code} · {plan.intervalCount} {plan.intervalUnit.toLowerCase()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(plan)}
                      className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Chỉnh sửa gói"
                    >
                      <Edit size={18} style={{ color: "#2563EB" }} />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-bold" style={{ color: "#2563EB" }}>
                      {plan.price.toLocaleString("vi-VN")} {plan.currency}
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
                        NGƯỜI DÙNG ĐANG HOẠT ĐỘNG
                      </p>
                      <p className="text-xl font-bold" style={{ color: "#1F2937" }}>
                        {plan.activeUserCount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
                        TRẠNG THÁI
                      </p>
                      <span
                        className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: plan.isActive ? "#DCFCE7" : "#FEE2E2",
                          color: plan.isActive ? "#166534" : "#B91C1C",
                        }}
                      >
                        {plan.isActive ? "Đang hoạt động" : "Không hoạt động"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl p-6 mt-6" style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold" style={{ color: "#1F2937" }}>
                  {formMode === "create" ? "Tạo gói mới" : "Chỉnh sửa gói"}
                </h3>
                <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                  {formMode === "create"
                    ? "Nhập thông tin để tạo gói mới"
                    : "Cập nhật thông tin gói hiện tại"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="text-sm font-semibold text-blue-600 hover:text-blue-800"
              >
                Đặt lại form
              </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Mã gói</span>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(event) => handleFormChange("code", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Tên gói</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => handleFormChange("name", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Giá</span>
                <input
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(event) => handleFormChange("price", event.target.valueAsNumber)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Đơn vị tiền tệ</span>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(event) => handleFormChange("currency", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Chu kỳ</span>
                <select
                  value={formData.intervalUnit}
                  onChange={(event) => handleFormChange("intervalUnit", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="DAY">Ngày</option>
                  <option value="WEEK">Tuần</option>
                  <option value="MONTH">Tháng</option>
                  <option value="YEAR">Năm</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Số chu kỳ</span>
                <input
                  type="number"
                  min={1}
                  value={formData.intervalCount}
                  onChange={(event) => handleFormChange("intervalCount", event.target.valueAsNumber)}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Kích hoạt</span>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(event) => handleFormChange("isActive", event.target.value === "active")}
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Không hoạt động</option>
                </select>
              </label>
            </div>

            {formError && (
              <p className="mt-4 text-sm text-red-600">{formError}</p>
            )}

            <div className="mt-4 flex flex-wrap gap-3 items-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? "Đang gửi..." : formMode === "create" ? "Tạo gói" : "Cập nhật gói"}
              </button>
              <button
                type="button"
                onClick={handleOpenCreate}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>

        {/* Recent Subscriptions */}
        {/* <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#e5e7eb" }}>
            <h3 className="text-lg font-bold" style={{ color: "#1F2937" }}>
              Gói đăng ký gần đây
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: "#f9fafb" }}>
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    ID GÓI ĐĂNG KÝ
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    NGƯỜI DÙNG
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    GÓI
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    SỐ TIỀN
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    TRẠNG THÁI
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    NGÀY BẮT ĐẦU
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    THANH TOÁN TIẾP THEO
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold" style={{ color: "#6B7280" }}>
                    HÀNH ĐỘNG
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentSubscriptions.map((sub) => (
                  <tr key={sub.id} className="border-t hover:bg-gray-50" style={{ borderColor: "#e5e7eb" }}>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                      {sub.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: "#1F2937" }}>
                      {sub.user}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor:
                            sub.plan === "Cao cấp năm"
                              ? "#DBEAFE"
                              : sub.plan === "Cao cấp tháng"
                              ? "#EFF6FF"
                              : "#F3F4F6",
                          color:
                            sub.plan === "Cao cấp năm"
                              ? "#1d4ed8"
                              : sub.plan === "Cao cấp tháng"
                              ? "#2563EB"
                              : "#6B7280",
                        }}
                      >
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: "#1F2937" }}>
                      {sub.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: sub.status === "Hoạt động" ? "#DCFCE7" : "#FEE2E2",
                          color: sub.status === "Hoạt động" ? "#16A34A" : "#DC2626",
                        }}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {sub.startDate}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "#6B7280" }}>
                      {sub.nextBilling}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-sm font-medium hover:underline"
                        style={{ color: "#2563EB" }}
                      >
                        Xem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </AdminLayout>
  );
}