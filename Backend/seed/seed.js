import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { TRACKABLE_FEATURES } from "../src/constants/trackingFeatures.js";

const prisma = new PrismaClient();

const genders = ["Male", "Female", "Other"];
const features = TRACKABLE_FEATURES;

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDateWithinLastDays = (days = 30) => {
  const now = Date.now();
  const start = now - days * 24 * 60 * 60 * 1000;
  const timestamp = randomInt(start, now);
  return new Date(timestamp);
};

const runSeed = async () => {
  console.log("Seeding database...");

  await prisma.featureClick.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const usersPayload = Array.from({ length: 24 }).map((_, index) => ({
    username: `user_${index + 1}_${randomInt(1000, 9999)}`,
    password: hashedPassword,
    age: randomInt(14, 65),
    gender: randomFrom(genders)
  }));

  await prisma.user.createMany({
    data: usersPayload
  });

  const users = await prisma.user.findMany({
    select: { id: true }
  });

  const clickEvents = Array.from({ length: 100 }).map(() => ({
    userId: randomFrom(users).id,
    featureName: randomFrom(features),
    timestamp: randomDateWithinLastDays(45)
  }));

  await prisma.featureClick.createMany({
    data: clickEvents
  });

  console.log(`Seed complete: ${users.length} users and ${clickEvents.length} feature clicks inserted.`);
};

runSeed()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });