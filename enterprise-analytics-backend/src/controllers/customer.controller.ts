import type { Request, Response } from "express";
import {
    getAllCustomers,
    getCustomerById,
    getCustomerAnalytics,
    getTopCustomers,
    getUniqueRegions,
} from "../services/customer.service.js";

// GET /customers - List all customers with pagination
export const listCustomers = async (req: Request, res: Response) => {
    const { page, limit, search, region } = req.query;

    const result = await getAllCustomers({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        search: search as string,
        region: region as string,
    });

    res.json(result);
};

// GET /customers/regions - Get unique regions for filter
export const listRegions = async (_req: Request, res: Response) => {
    const regions = await getUniqueRegions();
    res.json(regions);
};

// GET /customers/top - Get top customers by revenue
export const listTopCustomers = async (req: Request, res: Response) => {
    const { limit, startDate, endDate } = req.query;

    const result = await getTopCustomers(
        limit ? Number(limit) : 5,
        startDate as string,
        endDate as string
    );

    res.json(result);
};

// GET /customers/:id - Get single customer with orders
export const getCustomer = async (req: Request, res: Response) => {
    const { id } = req.params;

    const customer = await getCustomerById(Number(id));

    if (!customer) {
        res.status(404).json({ message: "Customer not found" });
        return;
    }

    res.json(customer);
};

// GET /customers/:id/analytics - Get customer analytics
export const getCustomerStats = async (req: Request, res: Response) => {
    const { id } = req.params;

    const analytics = await getCustomerAnalytics(Number(id));

    res.json(analytics);
};
