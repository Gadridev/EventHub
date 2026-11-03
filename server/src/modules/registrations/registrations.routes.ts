import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import * as controller from "./registrations.controller.js";

export const registrationsRouter = Router();

registrationsRouter.use(authenticate, authorize("admin", "staff"));
registrationsRouter.get("/", controller.list);
registrationsRouter.get("/:id", controller.details);
registrationsRouter.post("/", controller.create);
registrationsRouter.patch("/:id/status", controller.status);
