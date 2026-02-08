import api from "./axios";

export interface KPIs {
  totalOrders: number;
  totalRevenue: number;
  activeCustomers: number;
}

export interface KPIComparison {
  current: KPIs;
  previous: KPIs;
  changes: {
    totalOrders: number;
    totalRevenue: number;
    activeCustomers: number;
  };
}

export interface RegionalData {
  region: string;
  orderCount: number;
  revenue: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
  amount: number;
}

export const fetchKPIs = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<KPIs> => {
  const res = await api.get("/dashboard/kpis", { params });
  return res.data;
};


export const fetchRevenueTrend = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  const res = await api.get("/dashboard/revenue-trend", { params });
  return res.data;
};


export const fetchKPIComparison = async (params: {
  currentStart: string;
  currentEnd: string;
  previousStart: string;
  previousEnd: string;
}): Promise<KPIComparison> => {
  const res = await api.get("/dashboard/comparison", { params });
  return res.data;
};


export const fetchRegionalData = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<RegionalData[]> => {
  const res = await api.get("/dashboard/regional", { params });
  return res.data;
};


export const fetchStatusBreakdown = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<StatusBreakdown[]> => {
  const res = await api.get("/dashboard/status-breakdown", { params });
  return res.data;
};