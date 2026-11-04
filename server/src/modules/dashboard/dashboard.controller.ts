import type { RequestHandler } from "express";
import * as service from "./dashboard.service.js";

export const stats: RequestHandler = async (_req, res) => {
  res.json({ data: await service.getDashboardStats() });
};
