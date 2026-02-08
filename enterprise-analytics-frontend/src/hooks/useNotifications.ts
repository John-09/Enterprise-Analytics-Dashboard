import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getNotifications,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "@/api/notifications";

// Hook for notifications with polling
export const useNotifications = (unreadOnly: boolean = false, limit: number = 20) => {
    return useQuery({
        queryKey: ["notifications", unreadOnly, limit],
        queryFn: () => getNotifications(unreadOnly, limit),
        staleTime: 30 * 1000, // 30 seconds
        refetchInterval: 30 * 1000, // Poll every 30 seconds
        refetchOnWindowFocus: true,
    });
};

// Hook for unread count (for badge)
export const useUnreadCount = () => {
    return useQuery({
        queryKey: ["notifications-unread-count"],
        queryFn: getUnreadCount,
        staleTime: 30 * 1000,
        refetchInterval: 30 * 1000,
        refetchOnWindowFocus: true,
    });
};

// Hook for marking single notification as read
export const useMarkAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markNotificationAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
        },
    });
};

// Hook for marking all as read
export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: markAllNotificationsAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
        },
    });
};
