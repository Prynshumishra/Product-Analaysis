import { AppError } from "../utils/AppError.js";
import { verifyToken } from "../utils/jwt.js";
import { getUserById } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyToken(token);
  const user = await getUserById(payload.id);

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  req.user = {
    id: user.id,
    username: user.username,
    age: user.age,
    gender: user.gender
  };

  next();
});