import { useQuery } from "@tanstack/react-query";
import {
    fetchKPIComparison,
    fetchRegionalData,
    fetchStatusBreakdown,
} from "@/api/dashboard";
import { getTopCustomers } from "@/api/customers";

// Hook for KPI comparison (current vs previous period)
export const useKPIComparison = (
    currentStart: string,
    currentEnd: string,
    previousStart: string,
    previousEnd: string
) => {
    return useQuery({
        queryKey: ["kpi-comparison", currentStart, currentEnd, previousStart, previousEnd],
        queryFn: () =>
            fetchKPIComparison({
                currentStart,
                currentEnd,
                previousStart,
                previousEnd,
            }),
        staleTime: 60 * 1000,
    });
};

// Hook for regional analytics
export const useRegionalAnalytics = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ["regional-analytics", startDate, endDate],
        queryFn: () => fetchRegionalData({ startDate, endDate }),
        staleTime: 60 * 1000,
    });
};

// Hook for order status breakdown
export const useStatusBreakdown = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ["status-breakdown", startDate, endDate],
        queryFn: () => fetchStatusBreakdown({ startDate, endDate }),
        staleTime: 60 * 1000,
    });
};

// Hook for top customers (uses existing customer API)
export const useDashboardTopCustomers = (
    limit: number = 5,
    startDate?: string,
    endDate?: string
) => {
    return useQuery({
        queryKey: ["dashboard-top-customers", limit, startDate, endDate],
        queryFn: () => getTopCustomers(limit, startDate, endDate),
        staleTime: 60 * 1000,
    });
};
