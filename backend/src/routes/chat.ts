import express from "express";
import { getHistory } from "../controllers/chatController";

const router = express.Router();

// GET /api/v1/chat/history/:userId
router.get("/history/:userId", getHistory);

export default router;
