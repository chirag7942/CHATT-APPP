
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// Route to get all users for the sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get messages with a specific user (renamed route to avoid conflict)
router.get("/chat/:id", protectRoute, getMessages);

// Send message to a specific user (renamed route to avoid conflict)
router.post("/chat/send/:id", protectRoute, sendMessage);

export default router;