import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { parseAnalyticsQuery } from "../utils/validators.js";
import { getFeatureTotals, getTimeSeries, getGenderDistribution, getAgeDistribution } from "../models/analyticsModel.js";

const resolveInterval = ({ interval, startDate, endDate }) => {
  if (interval && interval !== "auto") {
    return interval;
  }

  if (!startDate || !endDate) {
    return "day";
  }

  const diffInMs = Math.abs(endDate.getTime() - startDate.getTime());
  const diffInHours = diffInMs / (1000 * 60 * 60);

  return diffInHours <= 72 ? "hour" : "day";
};

const parseDate = (value, endOfDay = false) => {
  if (!value) {
    return null;
  }

  const normalized = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? `${value}${endOfDay ? "T23:59:59.999Z" : "T00:00:00.000Z"}`
    : value;

  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`Invalid date: ${value}`, 400);
  }

  return date;
};

export const getAnalytics = asyncHandler(async (req, res) => {
  const parsedQuery = parseAnalyticsQuery(req.query);
  const startDate = parseDate(parsedQuery.startDate, false);
  const endDate = parseDate(parsedQuery.endDate, true);

  if (startDate && endDate && startDate > endDate) {
    throw new AppError("startDate cannot be greater than endDate", 400);
  }

  const interval = resolveInterval({
    interval: parsedQuery.interval,
    startDate,
    endDate
  });

  const filters = {
    startDate,
    endDate,
    ageGroup: parsedQuery.ageGroup,
    gender: parsedQuery.gender,
    featureName: parsedQuery.featureName,
    interval
  };

  const [featureTotals, timeSeries, genderDistribution, ageDistribution] = await Promise.all([
    getFeatureTotals(filters),
    getTimeSeries(filters),
    getGenderDistribution(filters),
    getAgeDistribution(filters)
  ]);

  return res.status(200).json({
    filtersApplied: {
      startDate,
      endDate,
      ageGroup: parsedQuery.ageGroup,
      gender: parsedQuery.gender,
      featureName: parsedQuery.featureName || null,
      interval
    },
    featureTotals,
    timeSeries,
    genderDistribution,
    ageDistribution
  });
});