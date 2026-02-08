import { AppDataSource } from "../config/data-source.js";
import {
    DashboardPreference,
    DEFAULT_WIDGETS,
} from "../entities/DashboardPreference.js";
import type { DashboardLayout } from "../entities/DashboardPreference.js";

// Get user's dashboard preferences
export const getUserPreferences = async (
    userId: number
): Promise<DashboardLayout> => {
    const repo = AppDataSource().getRepository(DashboardPreference);

    const pref = await repo.findOne({ where: { userId } });

    if (!pref) {
        // Return default layout if no preferences saved
        return { widgets: DEFAULT_WIDGETS };
    }

    return pref.widgetLayout;
};

// Save user's dashboard preferences
export const saveUserPreferences = async (
    userId: number,
    layout: DashboardLayout
): Promise<DashboardPreference> => {
    const repo = AppDataSource().getRepository(DashboardPreference);

    let pref = await repo.findOne({ where: { userId } });

    if (!pref) {
        pref = repo.create({ userId, widgetLayout: layout });
    } else {
        pref.widgetLayout = layout;
    }

    return repo.save(pref);
};

// Reset user preferences to default
export const resetUserPreferences = async (
    userId: number
): Promise<DashboardLayout> => {
    const repo = AppDataSource().getRepository(DashboardPreference);

    const pref = await repo.findOne({ where: { userId } });

    if (pref) {
        pref.widgetLayout = { widgets: DEFAULT_WIDGETS };
        await repo.save(pref);
    }

    return { widgets: DEFAULT_WIDGETS };
};
