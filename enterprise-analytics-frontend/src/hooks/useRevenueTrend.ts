import { useQuery } from "@tanstack/react-query";
import { fetchRevenueTrend } from "../api/dashboard";

export const useRevenueTrend = (
  startDate?: string,
  endDate?: string
) => {
  return useQuery({
    queryKey: ["revenue-trend", startDate, endDate],
    queryFn: () => fetchRevenueTrend({ startDate, endDate }),
  });
};
