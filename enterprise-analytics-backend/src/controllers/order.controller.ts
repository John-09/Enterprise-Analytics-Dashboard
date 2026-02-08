import type{ Request, Response } from "express";
import { getOrders } from "../services/order.service.js";
import { AppDataSource } from "../config/data-source.js";
import { Order } from "../entities/Order.js";

export const listOrders = async (req: Request, res: Response) => {
  const { page, limit, status, search } = req.query;

  const result = await getOrders({
    page,
    limit,
    status,
    search,
  });

  res.json(result);
};


export const exportOrders = async (req:Request, res:Response) => {
  const { startDate, endDate, status, search } = req.query;

  const repo = AppDataSource().getRepository(Order);

  const qb = repo
    .createQueryBuilder("o")
    .leftJoinAndSelect("o.customer", "c")
    .orderBy("o.createdAt", "DESC");

  if (startDate && endDate) {
    qb.andWhere(
      "DATE(o.createdAt) BETWEEN :start AND :end",
      { start: startDate, end: endDate }
    );
  }

  if (status) {
    qb.andWhere("o.status = :status", { status });
  }

  if (search) {
    qb.andWhere("LOWER(c.name) LIKE LOWER(:search)", {
      search: `%${search}%`,
    });
  }

  const orders = await qb.getMany();

  if (!orders.length) {
    return res.status(204).send();
  }

  const rows = orders.map((o) => ({
    OrderID: o.id,
    Customer: o.customer?.name || "",
    Amount: o.amount,
    Status: o.status,
    Date: o.createdAt.toISOString(),
  }));

  const header = Object.keys(rows[0]).join(",");
  const csv = [
    header,
    ...rows.map((r) => Object.values(r).join(",")),
  ].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=orders.csv"
  );

  res.send(csv);
};


