import { Router } from "express";
import { trackFeature } from "../controllers/trackController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/track", requireAuth, trackFeature);

export default router;