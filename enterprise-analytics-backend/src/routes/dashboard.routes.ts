import { Router } from "express";
import {
    getDashboardKPIs,
    getRevenueChart,
    getComparisonAnalytics,
    getRegionalAnalytics,
    getStatusBreakdown,
} from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = Router();

router.get("/kpis", authMiddleware, roleMiddleware(["admin", "manager", "viewer"]), getDashboardKPIs);
router.get("/revenue-trend", authMiddleware, roleMiddleware(["admin", "manager"]), getRevenueChart);
router.get("/comparison", authMiddleware, roleMiddleware(["admin", "manager"]), getComparisonAnalytics);
router.get("/regional", authMiddleware, roleMiddleware(["admin", "manager"]), getRegionalAnalytics);
router.get("/status-breakdown", authMiddleware, roleMiddleware(["admin", "manager"]), getStatusBreakdown);

export default router;
