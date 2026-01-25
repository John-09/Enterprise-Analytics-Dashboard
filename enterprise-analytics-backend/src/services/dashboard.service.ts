import { AppDataSource } from "../config/data-source.js";
import { Order } from "../entities/Order.js";

export const getKPIs = async (startDate?: string, endDate?: string) => {
  const repo = AppDataSource.getRepository(Order);

  const qb = repo
    .createQueryBuilder("order")
    .select("COUNT(order.id)", "totalOrders")
    .addSelect("SUM(order.amount)", "totalRevenue")
    .addSelect(
      "COUNT(DISTINCT order.customerId)",
      "activeCustomers"
    );

  if (startDate && endDate) {
    qb.where("order.createdAt BETWEEN :start AND :end", {
      start: startDate,
      end: endDate,
    });
  }

  const result = await qb.getRawOne();

  return {
    totalOrders: Number(result.totalOrders),
    totalRevenue: Number(result.totalRevenue) || 0,
    activeCustomers: Number(result.activeCustomers),
  };
};
