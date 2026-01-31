import {Router}  from "express";
import { getDashboardKPIs,getRevenueChart } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = Router();

router.get("/kpis", authMiddleware,roleMiddleware(["admin", "manager", "viewer"]), getDashboardKPIs);
router.get("/revenue-trend", authMiddleware,roleMiddleware(["admin", "manager"]), getRevenueChart);

export default router;
