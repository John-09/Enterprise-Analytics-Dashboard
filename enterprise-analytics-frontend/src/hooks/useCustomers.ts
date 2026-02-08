import { useQuery } from "@tanstack/react-query";
import {
    getCustomers,
    getRegions,
    getTopCustomers,
    getCustomerById,
    getCustomerAnalytics,
} from "@/api/customers";
import type { CustomerListParams } from "@/api/customers";

// Hook for customer list with pagination and filters
export const useCustomers = (params: CustomerListParams) => {
    return useQuery({
        queryKey: ["customers", params],
        queryFn: () => getCustomers(params),
        staleTime: 30 * 1000, // 30 seconds
    });
};

// Hook for unique regions
export const useRegions = () => {
    return useQuery({
        queryKey: ["customer-regions"],
        queryFn: getRegions,
        staleTime: 5 * 60 * 1000, // 5 minutes (regions don't change often)
    });
};

// Hook for top customers
export const useTopCustomers = (
    limit?: number,
    startDate?: string,
    endDate?: string
) => {
    return useQuery({
        queryKey: ["top-customers", limit, startDate, endDate],
        queryFn: () => getTopCustomers(limit, startDate, endDate),
        staleTime: 60 * 1000, // 1 minute
    });
};

// Hook for single customer detail
export const useCustomer = (id: number | null) => {
    return useQuery({
        queryKey: ["customer", id],
        queryFn: () => getCustomerById(id!),
        enabled: id !== null,
        staleTime: 30 * 1000,
    });
};

// Hook for customer analytics
export const useCustomerAnalytics = (id: number | null) => {
    return useQuery({
        queryKey: ["customer-analytics", id],
        queryFn: () => getCustomerAnalytics(id!),
        enabled: id !== null,
        staleTime: 30 * 1000,
    });
};
