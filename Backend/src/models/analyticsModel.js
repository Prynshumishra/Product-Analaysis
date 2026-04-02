import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma.js";

const buildSharedConditions = ({ startDate, endDate, ageGroup, gender }) => {
  const conditions = [Prisma.sql`1=1`];

  if (startDate) {
    conditions.push(Prisma.sql`fc.timestamp >= ${startDate}`);
  }

  if (endDate) {
    conditions.push(Prisma.sql`fc.timestamp <= ${endDate}`);
  }

  if (gender && gender !== "all") {
    conditions.push(Prisma.sql`u.gender::text = ${gender}`);
  }

  if (ageGroup === "<18") {
    conditions.push(Prisma.sql`u.age < 18`);
  }

  if (ageGroup === "18-40") {
    conditions.push(Prisma.sql`u.age BETWEEN 18 AND 40`);
  }

  if (ageGroup === ">40") {
    conditions.push(Prisma.sql`u.age > 40`);
  }

  return conditions;
};

export const getFeatureTotals = async (filters) => {
  const conditions = buildSharedConditions(filters);

  const rows = await prisma.$queryRaw`
    SELECT
      fc.feature_name AS "featureName",
      COUNT(*)::int AS "clicks"
    FROM feature_clicks fc
    JOIN users u ON u.id = fc.user_id
    WHERE ${Prisma.join(conditions, " AND ")}
    GROUP BY fc.feature_name
    ORDER BY "clicks" DESC, "featureName" ASC
  `;

  return rows;
};

export const getTimeSeries = async (filters) => {
  const conditions = buildSharedConditions(filters);

  if (filters.featureName) {
    conditions.push(Prisma.sql`fc.feature_name = ${filters.featureName}`);
  }

  const timeBucketExpression =
    filters.interval === "hour"
      ? Prisma.sql`date_trunc('hour', fc.timestamp)`
      : Prisma.sql`date_trunc('day', fc.timestamp)`;

  const formatString = filters.interval === "hour" ? "YYYY-MM-DD HH24:00" : "YYYY-MM-DD";

  const rows = await prisma.$queryRaw`
    SELECT
      to_char(${timeBucketExpression}, ${formatString}) AS "bucket",
      COUNT(*)::int AS "clicks"
    FROM feature_clicks fc
    JOIN users u ON u.id = fc.user_id
    WHERE ${Prisma.join(conditions, " AND ")}
    GROUP BY ${timeBucketExpression}
    ORDER BY MIN(${timeBucketExpression}) ASC
  `;

  return rows;
};

export const getGenderDistribution = async (filters) => {
  const conditions = buildSharedConditions(filters);

  if (filters.featureName) {
    conditions.push(Prisma.sql`fc.feature_name = ${filters.featureName}`);
  }

  const rows = await prisma.$queryRaw`
    SELECT
      u.gender::text AS "gender",
      COUNT(*)::int AS "clicks"
    FROM feature_clicks fc
    JOIN users u ON u.id = fc.user_id
    WHERE ${Prisma.join(conditions, " AND ")}
    GROUP BY u.gender
    ORDER BY "clicks" DESC
  `;

  return rows;
};

export const getAgeDistribution = async (filters) => {
  const conditions = buildSharedConditions(filters);

  if (filters.featureName) {
    conditions.push(Prisma.sql`fc.feature_name = ${filters.featureName}`);
  }

  const rows = await prisma.$queryRaw`
    SELECT
      CASE
        WHEN u.age < 18 THEN '<18'
        WHEN u.age BETWEEN 18 AND 40 THEN '18-40'
        ELSE '>40'
      END AS "ageGroup",
      COUNT(*)::int AS "clicks"
    FROM feature_clicks fc
    JOIN users u ON u.id = fc.user_id
    WHERE ${Prisma.join(conditions, " AND ")}
    GROUP BY
      CASE
        WHEN u.age < 18 THEN '<18'
        WHEN u.age BETWEEN 18 AND 40 THEN '18-40'
        ELSE '>40'
      END
  `;

  const order = { '<18': 1, '18-40': 2, '>40': 3 };
  rows.sort((a, b) => order[a.ageGroup] - order[b.ageGroup]);

  return rows;
};