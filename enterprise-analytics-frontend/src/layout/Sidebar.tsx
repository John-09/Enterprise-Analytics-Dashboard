import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  TableOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useRole } from "@/hooks/useRole";

const { Sider } = Layout;

export default function Sidebar({
  collapsed,
  isMobile = false,
}: {
  collapsed: boolean;
  isMobile?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useRole();

  const items: MenuProps["items"] = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/orders",
      icon: <TableOutlined />,
      label: "Orders",
    },
    // Customers visible only to admin/manager
    ...(role !== "viewer"
      ? [
          {
            key: "/customers",
            icon: <TeamOutlined />,
            label: "Customers",
          },
        ]
      : []),
    // Users visible only to admin
    ...(role === "admin"
      ? [
          {
            key: "/users",
            icon: <UserOutlined />,
            label: "Users",
          },
        ]
      : []),
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={220}
      collapsedWidth={isMobile ? 0 : 80}
      className="border-r border-gray-200 dark:border-slate-700"
      style={
        isMobile
          ? {
              position: "fixed",
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 50,
              transition: "all 0.2s ease",
            }
          : undefined
      }
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center text-lg font-semibold text-blue-600 dark:text-blue-400">
        {collapsed ? "EA" : "Enterprise"}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        className="border-none"
        onClick={(e) => navigate(e.key)}
        items={items}
      />
    </Sider>
  );
}
