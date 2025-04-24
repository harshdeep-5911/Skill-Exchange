import express from "express";
import { getMatches, getMatchesBySkill } from "../controllers/matchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Match all compatible users (general route)
router.get("/matches", protect, getMatches);

// Match users offering a specific skill (used in SkillExchange component)
router.get("/matches-by-skill", protect, getMatchesBySkill);

export default router;
