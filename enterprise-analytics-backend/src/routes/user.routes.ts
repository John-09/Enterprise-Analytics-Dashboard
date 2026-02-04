import { Router } from "express";
import { createUser, listUsers } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  createUser
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  listUsers
);

export default router;
