import "dotenv/config";          // 🔑 MUST be first
import "reflect-metadata";

import app from "./app.js";
import { initializeDB } from "./config/data-source.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initializeDB(); // ✅ called once only

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();


