import type { Request, Response } from "express";
import {
  getKPIs,
  getRevenueTrend,
  getKPIsComparison,
  getRevenueByRegion,
  getOrderStatusBreakdown,
} from "../services/dashboard.service.js";

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


// GET /dashboard/comparison - Compare current vs previous period
export const getComparisonAnalytics = async (req: Request, res: Response) => {
  const { currentStart, currentEnd, previousStart, previousEnd } = req.query;

  if (!currentStart || !currentEnd || !previousStart || !previousEnd) {
    res.status(400).json({ message: "All date parameters are required" });
    return;
  }

  const data = await getKPIsComparison(
    currentStart as string,
    currentEnd as string,
    previousStart as string,
    previousEnd as string
  );

  res.json(data);
};


// GET /dashboard/regional - Revenue by region
export const getRegionalAnalytics = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const data = await getRevenueByRegion(
    startDate as string,
    endDate as string
  );

  res.json(data);
};


// GET /dashboard/status-breakdown - Order status distribution
export const getStatusBreakdown = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const data = await getOrderStatusBreakdown(
    startDate as string,
    endDate as string
  );

  res.json(data);
};
