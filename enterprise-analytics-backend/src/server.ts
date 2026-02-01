import "dotenv/config";          // 🔑 MUST be first
import "reflect-metadata";

import app from "./app.js";
import { AppDataSource } from "./config/data-source.js";

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(async () => {
    console.log("📦 Database connected");

    const tz = await AppDataSource.query("SHOW timezone");
    console.log("DB timezone from app:", tz);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection failed", error);
  });

