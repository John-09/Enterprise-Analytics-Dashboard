import { Router } from "express";
import { exportOrders, listOrders, createOrderHandler } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = Router();

// GET /orders - List orders (admin/manager)
router.get("/", authMiddleware, roleMiddleware(["admin", "manager"]), listOrders);

// POST /orders - Create order (admin/manager)
router.post("/", authMiddleware, roleMiddleware(["admin", "manager"]), createOrderHandler);

// GET /orders/export - Export orders as CSV
router.get(
  "/export",
  authMiddleware,
  roleMiddleware(["admin", "manager"]),
  exportOrders
);

export default router;
