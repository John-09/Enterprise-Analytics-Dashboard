// import { DataSource } from "typeorm";

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   // host: process.env.DB_HOST || "127.0.0.1",
//   // port: Number(process.env.DB_PORT || 5433),
//   // username: process.env.DB_USER,
//   // password: process.env.DB_PASSWORD,
//   // database: process.env.DB_NAME,
//   url: process.env.DATABASE_URL,
//   synchronize: true, // demo only
//   logging: false,
//   entities: ["src/entities/**/*.ts"],
//   extra: {
//     options: "-c timezone=UTC",
//   },
// });


import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User.js";
import { Customer } from "../entities/Customer.js";
import { Order } from "../entities/Order.js";
let dataSource: DataSource | null = null;

export const initializeDB = async () => {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  dataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true, // dev only
    logging: false,
    entities: [User, Customer, Order],
    extra: {
      options: "-c timezone=UTC",
    },
  });

  await dataSource.initialize();
  await dataSource.query("SET TIME ZONE 'UTC'");

  console.log("📦 Database connected");
  return dataSource;
};

export const AppDataSource = () => {
  if (!dataSource) {
    throw new Error("DataSource not initialized");
  }
  return dataSource;
};


