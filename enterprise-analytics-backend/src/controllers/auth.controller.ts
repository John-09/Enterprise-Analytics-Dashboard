import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { comparePassword } from "../utils/hash.js";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userRepo = AppDataSource().getRepository(User);
  const user = await userRepo.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  });
};
