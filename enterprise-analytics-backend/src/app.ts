// import express from "express";
// import cors from "cors";
// import authRoutes from "./routes/auth.routes.js";
// import dashboardRoutes from "./routes/dashboard.routes.js";
// import orderRoutes from "./routes/order.routes.js";
// import { errorHandler } from "./middleware/error.middleware.js";
// import userRoutes from "./routes/user.routes.js";



// const app = express();

// app.use(cors());
// app.use(express.json());



// app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/dashboard", dashboardRoutes);
// app.use("/orders", orderRoutes);

// app.use(errorHandler);

// export default app;


import express from "express";
import cors from "cors";
import { initializeDB } from "./config/data-source.js";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import preferenceRoutes from "./routes/preference.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",           // local frontend
  "https://enterprise-analytics-frontend.vercel.app" // deployed frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔥 Initialize DB once per cold start
await initializeDB();

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/orders", orderRoutes);
app.use("/customers", customerRoutes);
app.use("/notifications", notificationRoutes);
app.use("/preferences", preferenceRoutes);

app.use(errorHandler);

export default app;

