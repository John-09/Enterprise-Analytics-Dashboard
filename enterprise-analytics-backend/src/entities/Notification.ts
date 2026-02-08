import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from "typeorm";
import { User } from "./User.js";

export enum NotificationType {
    INFO = "info",
    SUCCESS = "success",
    WARNING = "warning",
    ERROR = "error",
}

@Index(["userId", "isRead"])
@Entity("notifications")
export class Notification {
    @PrimaryGeneratedColumn({ type: "int" })
    id!: number;

    @Column({ type: "int" })
    userId!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userId" })
    user!: User;

    @Column({ type: "varchar", length: 150 })
    title!: string;

    @Column({ type: "text" })
    message!: string;

    @Column({
        type: "enum",
        enum: NotificationType,
        default: NotificationType.INFO,
    })
    type!: NotificationType;

    @Column({ type: "boolean", default: false })
    isRead!: boolean;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;
}
