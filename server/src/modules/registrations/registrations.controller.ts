import type { RequestHandler } from "express";
import { HttpError } from "../../middleware/error-handler.js";
import * as service from "./registrations.service.js";
import {
  registrationIdSchema,
  createRegistrationSchema,
  registrationStatusSchema,
  registrationsQuerySchema,
} from "./registrations.schema.js";

export const list: RequestHandler = async (req, res) => {
  const query = registrationsQuerySchema.parse(req.query);
  res.json(await service.listRegistrations(query));
};

export const details: RequestHandler = async (req, res) => {
  const id = registrationIdSchema.parse(req.params.id);
  res.json({ data: await service.getRegistration(id) });
};

export const create: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new HttpError(401, "Unauthorized");
  }
  const input = createRegistrationSchema.parse(req.body);
  res.status(201).json({ data: await service.createRegistration(input, req.user) });
};

export const status: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new HttpError(401, "Unauthorized");
  }
  const id = registrationIdSchema.parse(req.params.id);
  const input = registrationStatusSchema.parse(req.body);
  res.json({ data: await service.changeRegistrationStatus(id, input.status, req.user) });
};
