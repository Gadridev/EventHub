import type { RequestHandler } from "express";
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
  const input = createRegistrationSchema.parse(req.body);
  res.status(201).json({ data: await service.createRegistration(input) });
};

export const status: RequestHandler = async (req, res) => {
  const id = registrationIdSchema.parse(req.params.id);
  const input = registrationStatusSchema.parse(req.body);
  res.json({ data: await service.changeRegistrationStatus(id, input.status) });
};
