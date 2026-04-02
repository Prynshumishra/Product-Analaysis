import { z } from "zod";
import { TRACKABLE_FEATURES } from "../constants/trackingFeatures.js";

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(40),
  password: z.string().min(6).max(100),
  age: z.coerce.number().int().min(1).max(120),
  gender: z.enum(["Male", "Female", "Other"])
});

export const loginSchema = z.object({
  username: z.string().trim().min(3).max(40),
  password: z.string().min(6).max(100)
});

const trackableFeatureSchema = z.string().trim().refine(
  (value) => TRACKABLE_FEATURES.includes(value),
  {
    message: `feature_name must be one of: ${TRACKABLE_FEATURES.join(", ")}`
  }
);

export const trackSchema = z.object({
  feature_name: trackableFeatureSchema
});

export const parseAnalyticsQuery = (query) => {
  const schema = z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    ageGroup: z.enum(["all", "<18", "18-40", ">40"]).default("all"),
    gender: z.enum(["all", "Male", "Female", "Other"]).default("all"),
    featureName: z.string().trim().min(2).max(100).optional(),
    interval: z.enum(["auto", "day", "hour"]).default("auto")
  });

  return schema.parse(query);
};