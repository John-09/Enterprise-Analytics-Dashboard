import api from "./axios";

export const fetchOrders = async (params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) => {
  const res = await api.get("/orders", { params });
  return res.data;
};
