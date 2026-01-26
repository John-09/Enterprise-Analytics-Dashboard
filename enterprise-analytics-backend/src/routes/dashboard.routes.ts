import {Router}  from "express";
import { getDashboardKPIs,getRevenueChart } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/kpis", authMiddleware, getDashboardKPIs);
router.get("/revenue-trend", authMiddleware, getRevenueChart);

export default router;
