"use client";

import { useTheme } from "@/app/utils/ThemeContext";
import { useUserRole } from "@/hooks/useUserRole";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "./SidebarLayout";

export default function Sidebar() {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebar();
  const { isHR, isAdmin, loading: roleLoading, roles } = useUserRole();
  console.log("Sidebar - isHR:", isHR, "isAdmin:", isAdmin, "roles:", roles);
  const bgSidebar =
    theme === "dark"
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const hoverBg = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const activeBg = theme === "dark" ? "bg-gray-700" : "bg-indigo-50";
  const activeText = theme === "dark" ? "text-indigo-400" : "text-indigo-600";

  const baseMenuItems = [
    { name: "Dashboard", path: "/" },
    { name: "Practice", path: "/chat" },
    { name: "My Profile", path: "/profile" },
    { name: "My Resumes", path: "/resumes" },
    { name: "History", path: "/history" },
    { name: "Settings", path: "/settings" },
  ];

  const recruitmentItems =
    !roleLoading && (isHR || isAdmin)
      ? [{ name: "Recruitment", path: "/recruitment" }]
      : [];

  const adminItems =
    !roleLoading && isAdmin
      ? [{ name: "User Management", path: "/admin/users" }]
      : [];

  const jobsItems = [{ name: "Browse Jobs", path: "/jobs" }];

  const menuItems = [
    ...baseMenuItems,
    ...recruitmentItems,
    ...adminItems,
    ...jobsItems,
  ];

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] ${bgSidebar} border-r transition-all duration-300 z-40 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute -right-3 top-6 w-6 h-6 rounded-full ${bgSidebar} border shadow-md flex items-center justify-center ${textSecondary} ${hoverBg} transition-colors`}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-300 ${
            collapsed ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <nav className="p-3 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? `${activeBg} ${activeText}`
                  : `${textSecondary} ${hoverBg}`
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.name : ""}
            >
              {!collapsed ? item.name : item.name.charAt(0)}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
