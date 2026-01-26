import type { Request, Response } from "express";
import { getKPIs,getRevenueTrend } from "../services/dashboard.service.js";

export const getDashboardKPIs = async (
  req: Request,
  res: Response
) => {
  const { startDate, endDate } = req.query;

  const data = await getKPIs(
    startDate as string,
    endDate as string
  );

  res.json(data);
};


export const getRevenueChart = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const data = await getRevenueTrend(
    startDate as string,
    endDate as string
  );

  res.json(data);
};

