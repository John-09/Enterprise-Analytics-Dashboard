import { AppDataSource } from "../config/data-source.js";
import { Order } from "../entities/Order.js";

// key performance indicator logic
export const getKPIs = async (startDate?: string, endDate?: string) => {
  const repo = AppDataSource().getRepository(Order);

  const qb = repo
    .createQueryBuilder("order")
    .select("COUNT(order.id)", "totalOrders")
    .addSelect("SUM(order.amount)", "totalRevenue")
    .addSelect("COUNT(DISTINCT order.customerId)", "activeCustomers");

  if (startDate && endDate) {
    qb.where(
      "order.createdAt >= :start AND order.createdAt < :end",
      {
        start: `${startDate}T00:00:00.000Z`,
        end: `${endDate}T23:59:59.999Z`,
      }
    );
  }

  const result = await qb.getRawOne();

  return {
    totalOrders: Number(result.totalOrders),
    totalRevenue: Number(result.totalRevenue) || 0,
    activeCustomers: Number(result.activeCustomers),
  };
};


//Trend Logic
export const getRevenueTrend = async (
  startDate?: string,
  endDate?: string
) => {
  const repo = AppDataSource().getRepository(Order);

  const qb = repo
    .createQueryBuilder("order")
    .select("DATE(order.createdAt)", "date")
    .addSelect("SUM(order.amount)", "revenue")
    .where("order.status = :status", { status: "completed" })
    .groupBy("DATE(order.createdAt)")
    .orderBy("DATE(order.createdAt)", "ASC");

  if (startDate && endDate) {
    qb.andWhere(
      "order.createdAt >= :start AND order.createdAt < :end",
      {
        start: `${startDate}T00:00:00.000Z`,
        end: `${endDate}T23:59:59.999Z`,
      }
    );
  }

  const data = await qb.getRawMany();

  return data.map((row) => ({
    date: row.date,
    revenue: Number(row.revenue),
  }));
};


