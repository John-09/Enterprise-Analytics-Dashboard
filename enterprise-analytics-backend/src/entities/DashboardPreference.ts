import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./User.js";

export interface WidgetConfig {
    id: string;
    visible: boolean;
    order: number;
}

export interface DashboardLayout {
    widgets: WidgetConfig[];
}

@Entity("dashboard_preferences")
export class DashboardPreference {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number;

    @Column({ type: "int", unique: true })
    userId!: number;

    @OneToOne(() => User)
    @JoinColumn({ name: "userId" })
    user!: User;

    @Column({ type: "jsonb", default: () => "'{}'" })
    widgetLayout!: DashboardLayout;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;
}

// Default widget configuration
export const DEFAULT_WIDGETS: WidgetConfig[] = [
    { id: "kpi-overview", visible: true, order: 0 },
    { id: "comparison", visible: true, order: 1 },
    { id: "revenue-chart", visible: true, order: 2 },
    { id: "regional", visible: true, order: 3 },
    { id: "top-customers", visible: true, order: 4 },
];
