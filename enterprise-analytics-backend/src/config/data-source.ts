import { DataSource } from "typeorm";

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   synchronize: true, // OK for demo project
//   logging: false,
//   entities: ["src/entities/**/*.ts"],
// });

export const AppDataSource = new DataSource({
  type: "postgres",
  // host: process.env.DB_HOST || "127.0.0.1",
  // port: Number(process.env.DB_PORT || 5433),
  // username: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  url: process.env.DATABASE_URL,
  synchronize: true, // demo only
  logging: false,
  entities: ["src/entities/**/*.ts"],
  extra: {
    options: "-c timezone=UTC",
  },
});

