import { AppDataSource } from "../config/data-source.js";
import { Order } from "../entities/Order.js";

export const getOrders = async ({
  page = 1,
  limit = 10,
  status,
  search,
}: any) => {
  const repo = AppDataSource.getRepository(Order);

  const qb = repo
    .createQueryBuilder("order")
    .leftJoinAndSelect("order.customer", "customer")
    .orderBy("order.createdAt", "DESC")
    .skip((page - 1) * limit)
    .take(limit);

  if (status) {
    qb.andWhere("order.status = :status", { status });
  }

  if (search) {
    qb.andWhere("customer.name ILIKE :search", {
      search: `%${search}%`,
    });
  }

  const [data, total] = await qb.getManyAndCount();

  return {
    data,
    total,
    page: Number(page),
    limit: Number(limit),
  };
};
