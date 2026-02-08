import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    getDashboardPreferences,
    saveDashboardPreferences,
    resetDashboardPreferences,
} from "../controllers/preference.controller.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /preferences/dashboard - Get preferences
router.get("/dashboard", getDashboardPreferences);

// PUT /preferences/dashboard - Save preferences
router.put("/dashboard", saveDashboardPreferences);

// DELETE /preferences/dashboard - Reset to default
router.delete("/dashboard", resetDashboardPreferences);

export default router;
