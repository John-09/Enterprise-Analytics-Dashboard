import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getDashboardPreferences,
    saveDashboardPreferences,
    resetDashboardPreferences,
    DEFAULT_WIDGETS,
} from "@/api/preferences";
import type { WidgetConfig } from "@/api/preferences";

// Hook for loading preferences
export const useDashboardPreferences = () => {
    return useQuery({
        queryKey: ["dashboard-preferences"],
        queryFn: getDashboardPreferences,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

// Hook for saving preferences
export const useSavePreferences = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: saveDashboardPreferences,
        onSuccess: (data) => {
            queryClient.setQueryData(["dashboard-preferences"], data.layout);
        },
    });
};

// Hook for resetting preferences
export const useResetPreferences = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: resetDashboardPreferences,
        onSuccess: (data) => {
            queryClient.setQueryData(["dashboard-preferences"], data.layout);
        },
    });
};

// Helper to get sorted visible widgets
export const getVisibleWidgets = (widgets?: WidgetConfig[]): WidgetConfig[] => {
    const items = widgets || DEFAULT_WIDGETS;
    return items
        .filter((w) => w.visible)
        .sort((a, b) => a.order - b.order);
};

// Helper to check if a widget is visible
export const isWidgetVisible = (
    widgetId: string,
    widgets?: WidgetConfig[]
): boolean => {
    const items = widgets || DEFAULT_WIDGETS;
    const widget = items.find((w) => w.id === widgetId);
    return widget?.visible ?? true;
};
