import api from "./axios";

export const fetchKPIs = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
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
  