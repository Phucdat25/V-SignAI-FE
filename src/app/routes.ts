import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
async function handleResponse(response: Response) {
  const text = await response.text();

  if (!response.ok) {
    console.error(`Error: ${response.status}`, text);  // ← Thêm logging
    const errorMessage = text || response.statusText || "Lỗi kết nối API";
    throw new Error(errorMessage);
  }

  return text;
}import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Conversation } from "./pages/Conversation";
import { SignLibrary } from "./pages/SignLibrary";
import { History } from "./pages/History";
import { Upgrade } from "./pages/Upgrade";
import { Profile } from "./pages/Profile";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UsersManagement } from "./pages/admin/UsersManagement";
import { DatasetManagement } from "./pages/admin/DatasetManagement";
import { Subscriptions } from "./pages/admin/Subscriptions";
import { Translations } from "./pages/admin/Translations";
import { Analytics } from "./pages/admin/Analytics";
import { Settings } from "./pages/admin/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Landing },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "dashboard", Component: Dashboard },
      { path: "conversation", Component: Conversation },
      { path: "signs", Component: SignLibrary },
      { path: "history", Component: History },
      { path: "upgrade", Component: Upgrade },
      { path: "profile", Component: Profile },
      { path: "admin", Component: AdminDashboard },
      { path: "admin/users", Component: UsersManagement },
      { path: "admin/dataset", Component: DatasetManagement },
      { path: "admin/subscriptions", Component: Subscriptions },
      { path: "admin/translations", Component: Translations },
      { path: "admin/analytics", Component: Analytics },
      { path: "admin/settings", Component: Settings },
    ],
  },
]);