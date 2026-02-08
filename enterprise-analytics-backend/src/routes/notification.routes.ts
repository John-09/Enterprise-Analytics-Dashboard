import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    listNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../controllers/notification.controller.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /notifications - List notifications
router.get("/", listNotifications);

// GET /notifications/unread-count - Get unread count
router.get("/unread-count", getUnreadNotificationCount);

// PATCH /notifications/read-all - Mark all as read (must be before :id route)
router.patch("/read-all", markAllNotificationsAsRead);

// PATCH /notifications/:id/read - Mark single as read
router.patch("/:id/read", markNotificationAsRead);

export default router;
