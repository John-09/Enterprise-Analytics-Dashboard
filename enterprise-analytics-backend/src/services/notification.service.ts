import { AppDataSource } from "../config/data-source.js";
import { Notification, NotificationType } from "../entities/Notification.js";

// Get user notifications
export const getUserNotifications = async (
    userId: number,
    unreadOnly: boolean = false,
    limit: number = 20
) => {
    const repo = AppDataSource().getRepository(Notification);

    const qb = repo
        .createQueryBuilder("notification")
        .where("notification.userId = :userId", { userId })
        .orderBy("notification.createdAt", "DESC")
        .take(limit);

    if (unreadOnly) {
        qb.andWhere("notification.isRead = :isRead", { isRead: false });
    }

    return qb.getMany();
};

// Get unread count
export const getUnreadCount = async (userId: number): Promise<number> => {
    const repo = AppDataSource().getRepository(Notification);

    return repo.count({
        where: { userId, isRead: false },
    });
};

// Mark single notification as read
export const markAsRead = async (
    notificationId: number,
    userId: number
): Promise<boolean> => {
    const repo = AppDataSource().getRepository(Notification);

    const result = await repo
        .createQueryBuilder()
        .update(Notification)
        .set({ isRead: true })
        .where("id = :id AND userId = :userId", { id: notificationId, userId })
        .execute();

    return result.affected !== undefined && result.affected > 0;
};

// Mark all notifications as read
export const markAllAsRead = async (userId: number): Promise<number> => {
    const repo = AppDataSource().getRepository(Notification);

    const result = await repo
        .createQueryBuilder()
        .update(Notification)
        .set({ isRead: true })
        .where("userId = :userId AND isRead = :isRead", { userId, isRead: false })
        .execute();

    return result.affected || 0;
};

// Create a notification
export const createNotification = async (
    userId: number,
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO
): Promise<Notification> => {
    const repo = AppDataSource().getRepository(Notification);

    const notification = repo.create({
        userId,
        title,
        message,
        type,
        isRead: false,
    });

    return repo.save(notification);
};

// Create notification for all users with specific role
export const createNotificationForRole = async (
    role: string,
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO
): Promise<number> => {
    // This would require a join with users table
    // Implementation depends on business requirements
    // For now, return 0
    return 0;
};
