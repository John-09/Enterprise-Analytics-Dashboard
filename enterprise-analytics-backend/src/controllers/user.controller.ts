import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const repo = AppDataSource().getRepository(User);

  const existing = await repo.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ message: "User already exists" });
  }

  const tempPassword = "Welcome@123"; // phase 1
  const hashed = await bcrypt.hash(tempPassword, 10);

  const user = repo.create({
    name,
    email,
    role,
    password: hashed,
  });

  await repo.save(user);

  return res.status(201).json({
    message: "User created",
    tempPassword,
  });
};

export const listUsers = async (req, res) => {
  const users = await AppDataSource()
    .getRepository(User)
    .find({
      select: ["id", "name", "email", "role", "createdAt"],
    });

  res.json(users);
};
