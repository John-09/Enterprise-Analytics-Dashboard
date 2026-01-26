import type{ Request, Response } from "express";
import { getOrders } from "../services/order.service.js";

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
