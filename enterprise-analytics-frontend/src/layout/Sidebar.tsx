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

export default function Sidebar({ collapsed }: { collapsed: boolean }) {
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
      style={{ background: "#ffffff" }}
      className="border-r border-gray-200 dark:border-slate-700"
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
