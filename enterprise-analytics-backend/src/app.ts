import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";



const app = express();

app.use(cors());
app.use(express.json());



app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/orders", orderRoutes);

app.use(errorHandler);

export default app;
