import { AppDataSource } from "../config/data-source.js";
import { Notification, NotificationType } from "../entities/Notification.js";
import { User, UserRole } from "../entities/User.js";

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

// Create notification for all users with specific role(s)
export const createNotificationForRole = async (
    roles: UserRole[],
    title: string,
    message: string,
    type: NotificationType = NotificationType.INFO
): Promise<number> => {
    const userRepo = AppDataSource().getRepository(User);
    const notificationRepo = AppDataSource().getRepository(Notification);

    // Find all users with the specified roles
    const users = await userRepo
        .createQueryBuilder("user")
        .where("user.role IN (:...roles)", { roles })
        .getMany();

    if (users.length === 0) return 0;

    // Create notifications for each user
    const notifications = users.map((user) =>
        notificationRepo.create({
            userId: user.id,
            title,
            message,
            type,
            isRead: false,
        })
    );

    await notificationRepo.save(notifications);
    return notifications.length;
};

// High-value order notification (called when order exceeds threshold)
export const notifyHighValueOrder = async (
    orderAmount: number,
    customerName: string,
    orderId: number
): Promise<number> => {
    const HIGH_VALUE_THRESHOLD = 500; // Orders above $500

    if (orderAmount < HIGH_VALUE_THRESHOLD) return 0;

    return createNotificationForRole(
        [UserRole.ADMIN, UserRole.MANAGER],
        "🎉 High-Value Order Received!",
        `New order #${orderId} from ${customerName} worth $${orderAmount.toFixed(2)}`,
        NotificationType.SUCCESS
    );
};

// Seed test notifications for a user
export const seedTestNotifications = async (userId: number): Promise<number> => {
    const testNotifications = [
        {
            title: "Welcome to the Dashboard!",
            message: "You can manage orders, customers, and analytics from here.",
            type: NotificationType.INFO,
        },
        {
            title: "🎉 New High-Value Order!",
            message: "Customer John Doe placed an order worth $1,250.00",
            type: NotificationType.SUCCESS,
        },
        {
            title: "⚠️ Low Inventory Alert",
            message: "Product SKU-001 is running low on stock (5 remaining)",
            type: NotificationType.WARNING,
        },
        {
            title: "Monthly Report Ready",
            message: "Your December 2025 sales report is now available for download.",
            type: NotificationType.INFO,
        },
        {
            title: "Payment Failed",
            message: "Order #4521 payment was declined. Please contact the customer.",
            type: NotificationType.ERROR,
        },
    ];

    const repo = AppDataSource().getRepository(Notification);
    const notifications = testNotifications.map((n) =>
        repo.create({ userId, ...n, isRead: false })
    );

    await repo.save(notifications);
    return notifications.length;
};
