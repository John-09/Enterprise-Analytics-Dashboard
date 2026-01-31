import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "../api/orders";

export const useOrders = (params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["orders", params.page, params.limit, params.status, params.search],
    queryFn: () => fetchOrders(params),
    keepPreviousData: true, // IMPORTANT
  });
};
