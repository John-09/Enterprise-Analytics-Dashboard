import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    listCustomers,
    listRegions,
    listTopCustomers,
    getCustomer,
    getCustomerStats,
} from "../controllers/customer.controller.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /customers - List all customers
router.get("/", listCustomers);

// GET /customers/regions - Get unique regions for filter dropdown
router.get("/regions", listRegions);

// GET /customers/top - Get top customers by revenue
router.get("/top", listTopCustomers);

// GET /customers/:id - Get single customer with orders
router.get("/:id", getCustomer);

// GET /customers/:id/analytics - Get customer analytics
router.get("/:id/analytics", getCustomerStats);

export default router;
