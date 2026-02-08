import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import { comparePassword } from "../utils/hash.js";
import bcrypt from "bcryptjs";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userRepo = AppDataSource().getRepository(User);
  const user = await userRepo.findOne({ where: { email } });
  console.log("user", user);
  

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await comparePassword(password, user.password);
  console.log("isValid", isValid);
  
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
      mustChangePassword: user.mustChangePassword,
    },
  });
};


export const changePassword = async (req:Request, res:Response) => {
  const { newPassword } = req.body;
  const userId = req.user.id;

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({
      message: "Password must be at least 6 characters",
    });
  }

  const repo = AppDataSource().getRepository(User);
  const user = await repo.findOneBy({ id: userId });

  const hashed = await bcrypt.hash(newPassword, 10);

  user!.password = hashed;
  user!.mustChangePassword = false;

  await repo.save(user);

  res.json({ message: "Password updated successfully" });
};

