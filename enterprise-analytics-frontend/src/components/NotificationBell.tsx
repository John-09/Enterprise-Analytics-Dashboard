import { Badge, Dropdown, List, Button, Empty, Spin, Typography } from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { useNotifications, useUnreadCount, useMarkAsRead, useMarkAllAsRead } from "@/hooks/useNotifications";
import type { Notification } from "@/api/notifications";

const { Text } = Typography;

const getTypeColor = (type: Notification["type"]) => {
  const colors = {
    info: "#1890ff",
    success: "#52c41a",
    warning: "#faad14",
    error: "#f5222d",
  };
  return colors[type] || colors.info;
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function NotificationBell() {
  const { data: notifications, isLoading } = useNotifications(false, 10);
  const { data: unreadData } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const unreadCount = unreadData?.count || 0;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification.id);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const dropdownContent = (
    <div
      className="bg-white rounded-lg shadow-xl border"
      style={{ width: 360, maxHeight: 450, overflow: "hidden" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
        <Text strong>Notifications</Text>
        {unreadCount > 0 && (
          <Button
            type="link"
            size="small"
            icon={<CheckOutlined />}
            onClick={handleMarkAllAsRead}
            loading={markAllAsRead.isPending}
          >
            Mark all read
          </Button>
        )}
      </div>

      {/* Content */}
      <div style={{ maxHeight: 350, overflow: "auto" }}>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spin />
          </div>
        ) : !notifications || notifications.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No notifications"
            className="py-8"
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`cursor-pointer hover:bg-gray-50 transition-colors px-4 ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
                style={{ padding: "12px 16px" }}
              >
                <div className="w-full">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-2 h-2 rounded-full mt-2 shrink-0"
                      style={{ backgroundColor: getTypeColor(notification.type) }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <Text
                          strong={!notification.isRead}
                          className="text-sm block truncate"
                        >
                          {notification.title}
                        </Text>
                        <Text type="secondary" className="text-xs shrink-0 ml-2">
                          {formatTime(notification.createdAt)}
                        </Text>
                      </div>
                      <Text type="secondary" className="text-xs block mt-1 line-clamp-2">
                        {notification.message}
                      </Text>
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={["click"]}
      placement="bottomRight"
    >
      <div className="cursor-pointer px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
        <Badge count={unreadCount} size="small" offset={[-2, 2]}>
          <BellOutlined className="text-xl text-gray-600" />
        </Badge>
      </div>
    </Dropdown>
  );
}
