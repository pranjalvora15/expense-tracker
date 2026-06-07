import { Router } from "express";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/summary", requireAuth, asyncHandler(getDashboardSummary));
