import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
    getUserPreferences,
    saveUserPreferences,
    resetUserPreferences,
} from "../services/preference.service.js";

// GET /preferences/dashboard - Get user's dashboard preferences
export const getDashboardPreferences = async (
    req: AuthRequest,
    res: Response
) => {
    const userId = req.user!.id;
    const layout = await getUserPreferences(userId);

    res.json(layout);
};

// PUT /preferences/dashboard - Save user's dashboard preferences
export const saveDashboardPreferences = async (
    req: AuthRequest,
    res: Response
) => {
    const userId = req.user!.id;
    const { widgets } = req.body;

    if (!widgets || !Array.isArray(widgets)) {
        res.status(400).json({ message: "Invalid widget layout" });
        return;
    }

    const pref = await saveUserPreferences(userId, { widgets });

    res.json({ success: true, layout: pref.widgetLayout });
};

// DELETE /preferences/dashboard - Reset to default
export const resetDashboardPreferences = async (
    req: AuthRequest,
    res: Response
) => {
    const userId = req.user!.id;
    const layout = await resetUserPreferences(userId);

    res.json({ success: true, layout });
};
