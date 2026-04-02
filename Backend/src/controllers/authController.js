import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken } from "../utils/jwt.js";
import { loginSchema, registerSchema } from "../utils/validators.js";
import { createUser, findUserByUsername } from "../models/userModel.js";

const sanitizeUser = (user) => ({
  id: user.id,
  username: user.username,
  age: user.age,
  gender: user.gender
});

export const register = asyncHandler(async (req, res) => {
  const payload = registerSchema.parse(req.body);
  const existingUser = await findUserByUsername(payload.username);

  if (existingUser) {
    throw new AppError("Username already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);
  const user = await createUser({
    username: payload.username,
    password: hashedPassword,
    age: payload.age,
    gender: payload.gender
  });

  const token = signToken({ id: user.id, username: user.username });

  return res.status(201).json({
    token,
    user: sanitizeUser(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const payload = loginSchema.parse(req.body);
  const user = await findUserByUsername(payload.username);

  if (!user) {
    throw new AppError("Invalid username or password", 401);
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.password);

  if (!isValidPassword) {
    throw new AppError("Invalid username or password", 401);
  }

  const token = signToken({ id: user.id, username: user.username });

  return res.status(200).json({
    token,
    user: sanitizeUser(user)
  });
});