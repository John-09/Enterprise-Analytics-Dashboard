import "dotenv/config";
import "reflect-metadata";

import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { Customer } from "../entities/Customer.js";
import { Order } from "../entities/Order.js";
import { hashPassword } from "./hash.js";

const seed = async () => {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const customerRepo = AppDataSource.getRepository(Customer);
  const orderRepo = AppDataSource.getRepository(Order);

  // Admin user
  const admin = userRepo.create({
    name: "Admin",
    email: "admin@example.com",
    password: await hashPassword("admin123"),
    role: "admin",
  });
  await userRepo.save(admin);

  // Customers
  const customers = customerRepo.create([
    { name: "Acme Corp", region: "US" },
    { name: "Globex", region: "EU" },
    { name: "Initech", region: "APAC" },
  ]);
  await customerRepo.save(customers);

  // Orders
  for (let i = 0; i < 30; i++) {
    const order = orderRepo.create({
      amount: Math.floor(Math.random() * 10000) + 100,
      status: i % 3 === 0 ? "completed" : "pending",
      customer: customers[i % customers.length],
      createdAt: new Date(Date.now() - i * 86400000),
    });
    await orderRepo.save(order);
  }

  console.log("✅ Seed data created");
  process.exit(0);
};

seed();
