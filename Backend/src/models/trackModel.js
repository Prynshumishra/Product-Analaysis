import { prisma } from "../utils/prisma.js";

export const createFeatureClick = ({ userId, featureName, timestamp = new Date() }) =>
  prisma.featureClick.create({
    data: {
      userId,
      featureName,
      timestamp
    }
  });