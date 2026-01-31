import { Router } from "express";
import { listOrders } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", authMiddleware,roleMiddleware(["admin", "manager"]), listOrders);

export default router;
