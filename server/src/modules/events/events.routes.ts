import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import * as controller from "./events.controller.js";

export const eventsRouter = Router();
eventsRouter.use(authenticate, authorize("admin", "staff"));
eventsRouter.get("/", controller.list);
eventsRouter.get("/:id", controller.details);
eventsRouter.post("/", controller.create);
eventsRouter.patch("/:id", controller.update);
eventsRouter.patch("/:id/status", controller.status);
eventsRouter.delete("/:id", controller.remove);
