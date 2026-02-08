import { AppDataSource } from "../config/data-source.js";
import { Order, OrderStatus } from "../entities/Order.js";
import { Customer } from "../entities/Customer.js";

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


// Compare current period vs previous period
export const getKPIsComparison = async (
  currentStart: string,
  currentEnd: string,
  previousStart: string,
  previousEnd: string
) => {
  const current = await getKPIs(currentStart, currentEnd);
  const previous = await getKPIs(previousStart, previousEnd);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    current,
    previous,
    changes: {
      totalOrders: calculateChange(current.totalOrders, previous.totalOrders),
      totalRevenue: calculateChange(current.totalRevenue, previous.totalRevenue),
      activeCustomers: calculateChange(current.activeCustomers, previous.activeCustomers),
    },
  };
};


// Revenue breakdown by region
export const getRevenueByRegion = async (
  startDate?: string,
  endDate?: string
) => {
  const orderRepo = AppDataSource().getRepository(Order);

  const qb = orderRepo
    .createQueryBuilder("order")
    .innerJoin("order.customer", "customer")
    .select("customer.region", "region")
    .addSelect("COUNT(order.id)", "orderCount")
    .addSelect("COALESCE(SUM(order.amount), 0)", "revenue")
    .where("order.status = :status", { status: OrderStatus.COMPLETED })
    .groupBy("customer.region")
    .orderBy("COALESCE(SUM(order.amount), 0)", "DESC");

  if (startDate && endDate) {
    qb.andWhere("order.createdAt >= :start AND order.createdAt < :end", {
      start: `${startDate}T00:00:00.000Z`,
      end: `${endDate}T23:59:59.999Z`,
    });
  }

  const results = await qb.getRawMany();

  return results.map((r) => ({
    region: r.region,
    orderCount: Number(r.orderCount),
    revenue: Number(r.revenue),
  }));
};


// Order status breakdown (for pie chart)
export const getOrderStatusBreakdown = async (
  startDate?: string,
  endDate?: string
) => {
  const repo = AppDataSource().getRepository(Order);

  const qb = repo
    .createQueryBuilder("order")
    .select("order.status", "status")
    .addSelect("COUNT(order.id)", "count")
    .addSelect("COALESCE(SUM(order.amount), 0)", "amount")
    .groupBy("order.status");

  if (startDate && endDate) {
    qb.where("order.createdAt >= :start AND order.createdAt < :end", {
      start: `${startDate}T00:00:00.000Z`,
      end: `${endDate}T23:59:59.999Z`,
    });
  }

  const results = await qb.getRawMany();

  return results.map((r) => ({
    status: r.status,
    count: Number(r.count),
    amount: Number(r.amount),
  }));
};
