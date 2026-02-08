import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
} from "../services/notification.service.js";

// GET /notifications - Get current user's notifications
export const listNotifications = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const { unreadOnly, limit } = req.query;

    const notifications = await getUserNotifications(
        userId,
        unreadOnly === "true",
        limit ? Number(limit) : 20
    );

    res.json(notifications);
};

// GET /notifications/unread-count - Get unread count
export const getUnreadNotificationCount = async (
    req: AuthRequest,
    res: Response
) => {
    const userId = req.user!.id;
    const count = await getUnreadCount(userId);

    res.json({ count });
};

// PATCH /notifications/:id/read - Mark single notification as read
export const markNotificationAsRead = async (
    req: AuthRequest,
    res: Response
) => {
    const userId = req.user!.id;
    const { id } = req.params;

    const success = await markAsRead(Number(id), userId);

    if (!success) {
        res.status(404).json({ message: "Notification not found" });
        return;
    }

    res.json({ success: true });
};

// PATCH /notifications/read-all - Mark all notifications as read
export const markAllNotificationsAsRead = async (
    req: AuthRequest,
    res: Response
) => {
    const userId = req.user!.id;
    const count = await markAllAsRead(userId);

    res.json({ success: true, markedCount: count });
};
