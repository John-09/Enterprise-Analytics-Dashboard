import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Customer } from "./Customer.js";

export enum OrderStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Index(["createdAt"])
@Index(["status"])
@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  amount!: number;

  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: "customerId" })
  customer!: Customer;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt!: Date;
}
