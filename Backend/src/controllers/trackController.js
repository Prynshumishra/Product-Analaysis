import { asyncHandler } from "../utils/asyncHandler.js";
import { trackSchema } from "../utils/validators.js";
import { createFeatureClick } from "../models/trackModel.js";

export const trackFeature = asyncHandler(async (req, res) => {
  const payload = trackSchema.parse(req.body);

  const clickEvent = await createFeatureClick({
    userId: req.user.id,
    featureName: payload.feature_name,
    timestamp: new Date()
  });

  return res.status(201).json({
    message: "Feature click tracked successfully",
    eventId: clickEvent.id
  });
});