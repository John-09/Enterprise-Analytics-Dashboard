import api from "./axios";

export interface Customer {
    id: number;
    name: string;
    region: string;
    createdAt: string;
    totalOrders?: number;
    totalRevenue?: number;
    orders?: Order[];
}

export interface Order {
    id: number;
    amount: number;
    status: "pending" | "completed" | "cancelled";
    createdAt: string;
}

export interface CustomerAnalytics {
    totalOrders: number;
    lifetimeValue: number;
    averageOrderValue: number;
    firstOrderDate: string | null;
    lastOrderDate: string | null;
    completedOrders: number;
}

export interface CustomerListResponse {
    data: Customer[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface CustomerListParams {
    page?: number;
    limit?: number;
    search?: string;
    region?: string;
}

export interface TopCustomer {
    id: number;
    name: string;
    region: string;
    totalOrders: number;
    totalRevenue: number;
}

// Get all customers with pagination
export const getCustomers = async (
    params: CustomerListParams
): Promise<CustomerListResponse> => {
    const { data } = await api.get("/customers", { params });
    return data;
};

// Get unique regions for filter
export const getRegions = async (): Promise<string[]> => {
    const { data } = await api.get("/customers/regions");
    return data;
};

// Get top customers by revenue
export const getTopCustomers = async (
    limit?: number,
    startDate?: string,
    endDate?: string
): Promise<TopCustomer[]> => {
    const { data } = await api.get("/customers/top", {
        params: { limit, startDate, endDate },
    });
    return data;
};

// Get single customer with orders
export const getCustomerById = async (id: number): Promise<Customer> => {
    const { data } = await api.get(`/customers/${id}`);
    return data;
};

// Get customer analytics
export const getCustomerAnalytics = async (
    id: number
): Promise<CustomerAnalytics> => {
    const { data } = await api.get(`/customers/${id}/analytics`);
    return data;
};
