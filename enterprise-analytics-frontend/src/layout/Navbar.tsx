import { Layout, Dropdown, Avatar, Switch, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import { logout } from "../store/authSlice";
import { toggleTheme } from "../store/uiSlice";
import NotificationBell from "../components/NotificationBell";

const { Header } = Layout;

export default function Navbar({
  collapsed,
  onToggle,
  isMobile = false,
}: {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((s: RootState) => s.auth);
  const theme = useSelector((s: RootState) => s.ui.theme);

  return (
    <Header
      className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700"
      style={{ padding: isMobile ? "0 12px" : "0 16px" }}
    >
      {/* Left */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
      />

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <NotificationBell />

        {/* Theme toggle */}
        <Switch
          checked={theme === "dark"}
          onChange={() => dispatch(toggleTheme())}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          size={isMobile ? "small" : "default"}
        />

        {/* User dropdown */}
        <Dropdown
          menu={{
            items: [
              {
                key: "logout",
                icon: <LogoutOutlined />,
                label: "Logout",
                onClick: () => dispatch(logout()),
              },
            ],
          }}
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar icon={<UserOutlined />} size={isMobile ? "small" : "default"} />
            {!isMobile && (
              <div className="leading-tight">
                <div className="text-sm font-medium">Hi, {user?.name}</div>
                <div className="text-xs text-gray-500 capitalize">
                  {user?.role}
                </div>
              </div>
            )}
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
