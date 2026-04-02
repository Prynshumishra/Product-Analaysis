import { prisma } from "../utils/prisma.js";

export const findUserByUsername = (username) =>
  prisma.user.findUnique({
    where: { username }
  });

export const createUser = (data) =>
  prisma.user.create({
    data
  });

export const getUserById = (id) =>
  prisma.user.findUnique({
    where: { id }
  });