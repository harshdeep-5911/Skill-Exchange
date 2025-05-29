import express from "express";
import { getMatches, getMatchesBySkill } from "../controllers/matchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/matches", protect, getMatches);

router.get("/matches-by-skill", protect, getMatchesBySkill);

export default router;
