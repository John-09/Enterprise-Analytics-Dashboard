import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    seedTestNotifications,
} from "../services/notification.service.js";
import { NotificationType } from "../entities/Notification.js";

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

// POST /notifications/send - Admin: Send notification to a specific user
export const sendNotification = async (req: AuthRequest, res: Response) => {
    const { userId, title, message, type } = req.body;

    if (!userId || !title || !message) {
        res.status(400).json({ message: "userId, title, and message are required" });
        return;
    }

    const validTypes = ["info", "success", "warning", "error"];
    const notificationType = validTypes.includes(type)
        ? (type as NotificationType)
        : NotificationType.INFO;

    const notification = await createNotification(
        Number(userId),
        title,
        message,
        notificationType
    );

    res.status(201).json({ success: true, notification });
};

// POST /notifications/seed - Seed test notifications for current user
export const seedNotifications = async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const count = await seedTestNotifications(userId);

    res.json({ success: true, seededCount: count });
};
