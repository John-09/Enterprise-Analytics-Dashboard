import api from "./axios";

export interface WidgetConfig {
    id: string;
    visible: boolean;
    order: number;
}

export interface DashboardLayout {
    widgets: WidgetConfig[];
}

// Default configuration
export const DEFAULT_WIDGETS: WidgetConfig[] = [
    { id: "kpi-overview", visible: true, order: 0 },
    { id: "comparison", visible: true, order: 1 },
    { id: "revenue-chart", visible: true, order: 2 },
    { id: "regional", visible: true, order: 3 },
    { id: "top-customers", visible: true, order: 4 },
];

export const WIDGET_LABELS: Record<string, string> = {
    "kpi-overview": "KPI Overview",
    "comparison": "Period Comparison",
    "revenue-chart": "Revenue Trend",
    "regional": "Regional Analytics",
    "top-customers": "Top Customers",
};

// Get user's dashboard preferences
export const getDashboardPreferences = async (): Promise<DashboardLayout> => {
    const { data } = await api.get("/preferences/dashboard");
    return data;
};

// Save user's dashboard preferences
export const saveDashboardPreferences = async (
    widgets: WidgetConfig[]
): Promise<{ success: boolean; layout: DashboardLayout }> => {
    const { data } = await api.put("/preferences/dashboard", { widgets });
    return data;
};

// Reset to default
export const resetDashboardPreferences = async (): Promise<{
    success: boolean;
    layout: DashboardLayout;
}> => {
    const { data } = await api.delete("/preferences/dashboard");
    return data;
};
