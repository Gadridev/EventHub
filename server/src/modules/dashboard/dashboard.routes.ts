import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import * as controller from "./dashboard.controller.js";

export const dashboardRouter = Router();

dashboardRouter.use(authenticate, authorize("admin", "staff"));
dashboardRouter.get("/stats", controller.stats);
