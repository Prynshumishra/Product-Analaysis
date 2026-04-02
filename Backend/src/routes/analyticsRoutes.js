import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/analytics", requireAuth, getAnalytics);

export default router;