import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import type { Order } from "./Order.js";

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "varchar", length: 100 })
  region!: string;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;

  @OneToMany(
    () => import("./Order.js").then(m => m.Order),
    (order) => order.customer
  )
  orders!: Order[];
}
