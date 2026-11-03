import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { loginController, meController } from "./auth.controller.js";

export const authRouter = Router();
authRouter.post("/login", loginController);
authRouter.get("/me", authenticate, meController);
