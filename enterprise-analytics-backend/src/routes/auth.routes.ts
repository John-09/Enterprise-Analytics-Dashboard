import { Router } from "express";
import { login,changePassword } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);
router.post(
    "/change-password",
    authMiddleware,
    changePassword
  );
  

export default router;
