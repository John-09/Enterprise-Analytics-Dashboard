import api from "./axios";

export interface Notification {
    id: number;
    userId: number;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    isRead: boolean;
    createdAt: string;
}

// Get user notifications
export const getNotifications = async (
    unreadOnly: boolean = false,
    limit: number = 20
): Promise<Notification[]> => {
    const { data } = await api.get("/notifications", {
        params: { unreadOnly, limit },
    });
    return data;
};

// Get unread count
export const getUnreadCount = async (): Promise<{ count: number }> => {
    const { data } = await api.get("/notifications/unread-count");
    return data;
};

// Mark single notification as read
export const markNotificationAsRead = async (
    id: number
): Promise<{ success: boolean }> => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<{
    success: boolean;
    markedCount: number;
}> => {
    const { data } = await api.patch("/notifications/read-all");
    return data;
};
