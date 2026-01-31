import { useQuery } from "@tanstack/react-query";
import { fetchKPIs } from "../api/dashboard";

export const useKPIs = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ["kpis", startDate || "", endDate || ""],
    queryFn: () => fetchKPIs({ startDate, endDate }),
  });
};
