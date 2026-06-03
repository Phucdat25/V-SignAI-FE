import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { MessageSquare } from "lucide-react";
import { getAuthToken, getUserInfo, isProPlan } from "../api/auth";
import {
  formatRecentConversationLabel,
  getHistoryTypeColor,
  getRecentTranslationHistory,
  type HistoryDisplayItem,
} from "../api/translations";

interface RecentConversationsProps {
  title: string;
  variant?: "dashboard" | "conversation";
  /** Tăng giá trị này để fetch lại danh sách (vd. sau khi dịch xong) */
  refreshKey?: number;
}

export function RecentConversations({
  title,
  variant = "dashboard",
  refreshKey = 0,
}: RecentConversationsProps) {
  const navigate = useNavigate();
  const [items, setItems] = useState<HistoryDisplayItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSection, setShowSection] = useState(false);

  useEffect(() => {
    const user = getUserInfo();
    const canShow = isProPlan(user?.plan);
    setShowSection(canShow);

    if (!canShow || !getAuthToken()) {
      setItems([]);
      return;
    }

    const fetchRecent = async () => {
      try {
        setLoading(true);
        const recent = await getRecentTranslationHistory();
        setItems(recent);
      } catch (error) {
        console.error("RecentConversations - fetch error:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [refreshKey]);

  if (!showSection) {
    return null;
  }

  const isConversation = variant === "conversation";

  return (
    <div
      className={isConversation ? "rounded-3xl p-6 shadow-lg" : "rounded-2xl p-6 mt-6 shadow-sm"}
      style={{ backgroundColor: "white", border: "1px solid #e5e7eb" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          style={{
            fontSize: isConversation ? 18 : 16,
            fontWeight: 700,
            color: "#1F2937",
          }}
        >
          {title}
        </h3>
        {items.length > 0 && (
          <button
            onClick={() => navigate("/history")}
            style={{ fontSize: 13, color: "#2563EB", fontWeight: 600 }}
          >
            Xem tất cả →
          </button>
        )}
      </div>

      {loading ? (
        <p style={{ fontSize: 14, color: "#6B7280" }}>Đang tải...</p>
      ) : items.length === 0 ? (
        <div className={isConversation ? "text-center py-10" : "py-4"}>
          {isConversation && <MessageSquare size={40} color="#D1D5DB" className="mx-auto mb-2" />}
          <p style={{ fontSize: 14, color: "#9CA3AF", textAlign: isConversation ? "center" : "left" }}>
            Chưa có hội thoại nào. Bắt đầu giao tiếp ngay!
          </p>
        </div>
      ) : (
        <div className={isConversation ? "space-y-3 max-h-96 overflow-y-auto" : undefined}>
          {items.map((item) => {
            const typeColor = getHistoryTypeColor(item.type);
            const dateLabel = formatRecentConversationLabel(item.createdAt);

            if (isConversation) {
              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md"
                  style={{ backgroundColor: "#f8fafc", border: "1px solid #e5e7eb" }}
                  onClick={() => navigate("/history")}
                >
                  <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                    <p style={{ fontSize: 12, color: "#6B7280" }}>{dateLabel}</p>
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: typeColor + "22", color: typeColor }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p style={{ fontSize: 15, color: "#1F2937", lineHeight: 1.5 }} className="line-clamp-2">
                    {item.preview}
                  </p>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                style={{ borderColor: "#f3f4f6" }}
                onClick={() => navigate("/history")}
              >
                <div className="min-w-0 flex-1 pr-3">
                  <p style={{ fontSize: 13, color: "#6B7280" }}>{dateLabel}</p>
                  <p style={{ fontSize: 14, color: "#374151", marginTop: 2 }} className="line-clamp-1">
                    {item.preview}
                  </p>
                </div>
                <span style={{ fontSize: 12, color: "#2563EB", flexShrink: 0 }}>Xem →</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
