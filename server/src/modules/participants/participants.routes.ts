import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorize } from "../../middleware/authorize.js";
import * as controller from "./participants.controller.js";

export const participantsRouter = Router();

participantsRouter.use(authenticate, authorize("admin", "staff"));
participantsRouter.get("/", controller.list);
participantsRouter.get("/:id", controller.details);
participantsRouter.post("/", controller.create);
participantsRouter.patch("/:id", controller.update);
participantsRouter.delete("/:id", controller.remove);
