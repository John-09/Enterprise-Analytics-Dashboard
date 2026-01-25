import {Router}  from "express";
import { getDashboardKPIs } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/kpis", authMiddleware, getDashboardKPIs);

export default router;
