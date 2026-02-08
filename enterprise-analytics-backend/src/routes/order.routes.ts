import { Router } from "express";
import { exportOrders, listOrders } from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = Router();

router.get("/", authMiddleware,roleMiddleware(["admin", "manager"]), listOrders);
router.get(
    "/export",
    authMiddleware,
    roleMiddleware(["admin", "manager"]),
    exportOrders
  );
  

export default router;
