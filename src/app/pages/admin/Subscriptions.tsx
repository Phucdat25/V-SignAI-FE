import { AdminLayout } from "../../components/AdminLayout";
import { Edit, Users, DollarSign, TrendingUp, Calendar } from "lucide-react";

const subscriptionPlans = [
  {
    id: 1,
    name: "Miễn phí",
    price: "0₫",
    period: "Mãi mãi",
    activeUsers: 9611,
    revenue: "0₫",
    features: [
      "5 phút/ngày nhận diện giọng nói",
      "10 cụm từ nhanh",
      "Thư viện ký hiệu cơ bản",
    ],
    color: "#6B7280",
  },
  {
    id: 2,
    name: "Cao cấp tháng",
    price: "79,000₫",
    period: "Mỗi tháng",
    activeUsers: 2124,
    revenue: "167,796,000₫",
    features: [
      "Nhận diện giọng nói không giới hạn",
      "50+ cụm từ nhanh",
      "Thư viện ký hiệu đầy đủ",
      "Lưu toàn bộ lịch sử",
      "Xuất hội thoại",
      "Không quảng cáo",
    ],
    color: "#2563EB",
  },
  {
    id: 3,
    name: "Cao cấp năm",
    price: "799,000₫",
    period: "Mỗi năm",
    activeUsers: 723,
    revenue: "577,677,000₫",
    features: [
      "Tất cả tính năng gói Cao cấp",
      "Tiết kiệm hơn so với trả theo tháng",
      "Ưu tiên tốc độ AI",
      "Hỗ trợ sớm tính năng mới",
    ],
    color: "#1d4ed8",
  },
];

const recentSubscriptions = [
  {
    id: "SUB-8471",
    user: "Nguyễn Văn An",
    plan: "Cao cấp năm",
    amount: "799,000₫",
    status: "Hoạt động",
    startDate: "1 Tháng 3, 2024",
    nextBilling: "1 Tháng 3, 2025",
  },
  {
    id: "SUB-8470",
    user: "Trần Thị Bình",
    plan: "Cao cấp tháng",
    amount: "79,000₫",
    status: "Hoạt động",
    startDate: "10 Tháng 3, 2024",
    nextBilling: "10 Tháng 4, 2024",
  },
  {
    id: "SUB-8469",
    user: "Lê Hoàng Minh",
    plan: "Cao cấp năm",
    amount: "799,000₫",
    status: "Hoạt động",
    startDate: "15 Tháng 2, 2024",
    nextBilling: "15 Tháng 2, 2025",
  },
  {
    id: "SUB-8468",
    user: "Phạm Thu Hà",
    plan: "Cao cấp tháng",
    amount: "79,000₫",
    status: "Đã hủy",
    startDate: "5 Tháng 1, 2024",
    nextBilling: "-",
  },
  {
    id: "SUB-8467",
    user: "Võ Minh Tuấn",
    plan: "Cao cấp tháng",
    amount: "79,000₫",
    status: "Hoạt động",
    startDate: "8 Tháng 3, 2024",
    nextBilling: "8 Tháng 4, 2024",
  },
];

export function Subscriptions() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1F2937" }}>
            Quản lý gói đăng ký
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            Quản lý các gói đăng ký và theo dõi doanh thu
          </p>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        </div>

        {/* Subscription Plans */}
        <div>
          <h2 className="text-lg font-bold mb-4" style={{ color: "#1F2937" }}>
            Các gói đăng ký
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl p-6"
                style={{ backgroundColor: "white", border: "2px solid #e5e7eb" }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: "#1F2937" }}>
                      {plan.name}
                    </h3>
                    <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                      {plan.period}
                    </p>
                  </div>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    title="Chỉnh sửa gói"
                  >
                    <Edit size={18} style={{ color: plan.color }} />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="text-3xl font-bold" style={{ color: plan.color }}>
                    {plan.price}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
                      NGƯỜI DÙNG ĐANG HOẠT ĐỘNG
                    </p>
                    <p className="text-xl font-bold" style={{ color: "#1F2937" }}>
                      {plan.activeUsers.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
                      DOANH THU THÁNG
                    </p>
                    <p className="text-xl font-bold" style={{ color: "#1F2937" }}>
                      {plan.revenue}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: "#e5e7eb" }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: "#6B7280" }}>
                    TÍNH NĂNG
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div
                          className="w-1 h-1 rounded-full mt-2"
                          style={{ backgroundColor: plan.color }}
                        />
                        <span className="text-sm" style={{ color: "#1F2937" }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Subscriptions */}
        <div
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
        </div>
      </div>
    </AdminLayout>
  );
}