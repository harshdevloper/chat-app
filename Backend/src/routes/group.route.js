// routes/group.route.js
import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { createGroup, getGroups, getGroupMessages } from "../controllers/group.controllers.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup); // Create a new group
router.get("/", protectRoute, getGroups); // Get all groups for the logged-in user
router.get("/:groupId/messages", protectRoute, getGroupMessages); // Get messages for a specific group

export default router;
