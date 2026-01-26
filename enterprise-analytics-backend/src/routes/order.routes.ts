import { Router } from "express";
import { listOrders } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, listOrders);

export default router;
