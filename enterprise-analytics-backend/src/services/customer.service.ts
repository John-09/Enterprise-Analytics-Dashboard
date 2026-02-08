import { AppDataSource } from "../config/data-source.js";
import { Customer } from "../entities/Customer.js";
import { Order, OrderStatus } from "../entities/Order.js";

interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  region?: string;
}

interface CustomerWithStats extends Customer {
  totalOrders: number;
  totalRevenue: number;
}

// Get all customers with pagination and filters
export const getAllCustomers = async ({
  page = 1,
  limit = 10,
  search,
  region,
}: CustomerListParams) => {
  const repo = AppDataSource().getRepository(Customer);
  const orderRepo = AppDataSource().getRepository(Order);

  const qb = repo.createQueryBuilder("customer");

  if (search) {
    qb.where("customer.name ILIKE :search", { search: `%${search}%` });
  }

  if (region) {
    qb.andWhere("customer.region = :region", { region });
  }

  qb.orderBy("customer.createdAt", "DESC");

  const total = await qb.getCount();
  const customers = await qb
    .skip((page - 1) * limit)
    .take(limit)
    .getMany();

  // Get stats for each customer
  const customerIds = customers.map((c) => c.id);

  if (customerIds.length === 0) {
    return {
      data: [],
      pagination: { page, limit, total, totalPages: 0 },
    };
  }

  const stats = await orderRepo
    .createQueryBuilder("order")
    .select("order.customerId", "customerId")
    .addSelect("COUNT(order.id)", "totalOrders")
    .addSelect("COALESCE(SUM(order.amount), 0)", "totalRevenue")
    .where("order.customerId IN (:...ids)", { ids: customerIds })
    .groupBy("order.customerId")
    .getRawMany();

  const statsMap = new Map(
    stats.map((s) => [
      s.customerId,
      { totalOrders: Number(s.totalOrders), totalRevenue: Number(s.totalRevenue) },
    ])
  );

  const enrichedCustomers: CustomerWithStats[] = customers.map((c) => ({
    ...c,
    totalOrders: statsMap.get(c.id)?.totalOrders || 0,
    totalRevenue: statsMap.get(c.id)?.totalRevenue || 0,
  }));

  return {
    data: enrichedCustomers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single customer by ID with order history
export const getCustomerById = async (id: number) => {
  const repo = AppDataSource().getRepository(Customer);

  const customer = await repo.findOne({
    where: { id },
    relations: ["orders"],
  });

  if (!customer) {
    return null;
  }

  // Sort orders by date descending
  customer.orders = customer.orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return customer;
};

// Get customer analytics
export const getCustomerAnalytics = async (id: number) => {
  const orderRepo = AppDataSource().getRepository(Order);

  const stats = await orderRepo
    .createQueryBuilder("order")
    .select("COUNT(order.id)", "totalOrders")
    .addSelect("COALESCE(SUM(order.amount), 0)", "lifetimeValue")
    .addSelect("COALESCE(AVG(order.amount), 0)", "averageOrderValue")
    .addSelect("MIN(order.createdAt)", "firstOrderDate")
    .addSelect("MAX(order.createdAt)", "lastOrderDate")
    .where("order.customerId = :id", { id })
    .getRawOne();

  const completedOrders = await orderRepo.count({
    where: { customer: { id }, status: OrderStatus.COMPLETED },
  });

  return {
    totalOrders: Number(stats.totalOrders),
    lifetimeValue: Number(stats.lifetimeValue),
    averageOrderValue: Number(stats.averageOrderValue),
    firstOrderDate: stats.firstOrderDate,
    lastOrderDate: stats.lastOrderDate,
    completedOrders,
  };
};

// Get top customers by revenue
export const getTopCustomers = async (
  limit: number = 5,
  startDate?: string,
  endDate?: string
) => {
  const orderRepo = AppDataSource().getRepository(Order);

  const qb = orderRepo
    .createQueryBuilder("order")
    .innerJoin("order.customer", "customer")
    .select("customer.id", "id")
    .addSelect("customer.name", "name")
    .addSelect("customer.region", "region")
    .addSelect("COUNT(order.id)", "totalOrders")
    .addSelect("COALESCE(SUM(order.amount), 0)", "totalRevenue")
    .where("order.status = :status", { status: OrderStatus.COMPLETED })
    .groupBy("customer.id")
    .addGroupBy("customer.name")
    .addGroupBy("customer.region")
    .orderBy("COALESCE(SUM(order.amount), 0)", "DESC")
    .limit(limit);

  if (startDate && endDate) {
    qb.andWhere("order.createdAt >= :start AND order.createdAt < :end", {
      start: `${startDate}T00:00:00.000Z`,
      end: `${endDate}T23:59:59.999Z`,
    });
  }

  const results = await qb.getRawMany();

  return results.map((r) => ({
    id: r.id,
    name: r.name,
    region: r.region,
    totalOrders: Number(r.totalOrders),
    totalRevenue: Number(r.totalRevenue),
  }));
};

// Get unique regions for filter dropdown
export const getUniqueRegions = async () => {
  const repo = AppDataSource().getRepository(Customer);

  const results = await repo
    .createQueryBuilder("customer")
    .select("DISTINCT customer.region", "region")
    .orderBy("customer.region", "ASC")
    .getRawMany();

  return results.map((r) => r.region);
};
