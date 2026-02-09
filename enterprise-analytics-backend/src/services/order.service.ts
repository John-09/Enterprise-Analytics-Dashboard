import { AppDataSource } from "../config/data-source.js";
import { Order, OrderStatus } from "../entities/Order.js";
import { Customer } from "../entities/Customer.js";
import { notifyHighValueOrder } from "./notification.service.js";

export const getOrders = async ({
  page = 1,
  limit = 10,
  status,
  search,
}: any) => {
  const repo = AppDataSource().getRepository(Order);

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

// Create a new order
export const createOrder = async (
  customerId: number,
  amount: number,
  status: OrderStatus = OrderStatus.PENDING
): Promise<Order> => {
  const orderRepo = AppDataSource().getRepository(Order);
  const customerRepo = AppDataSource().getRepository(Customer);

  // Find the customer
  const customer = await customerRepo.findOne({ where: { id: customerId } });
  if (!customer) {
    throw new Error(`Customer with ID ${customerId} not found`);
  }

  // Create and save the order
  const order = orderRepo.create({
    customer,
    amount,
    status,
  });

  const savedOrder = await orderRepo.save(order);

  // Trigger notification for high-value orders (>$500)
  await notifyHighValueOrder(amount, customer.name, savedOrder.id);

  return savedOrder;
};
