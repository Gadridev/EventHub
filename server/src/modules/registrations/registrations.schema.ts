import { z } from "zod";
import { RegistrationStatus } from "../../generated/prisma/client.js";

export const registrationIdSchema = z.uuid();

export const createRegistrationSchema = z.strictObject({
  eventId: z.uuid(),
  participantId: z.uuid(),
});

export const registrationStatusSchema = z.strictObject({
  status: z.enum(["confirmed", "cancelled"]),
});

const integerQuery = z.string()
  .regex(/^[0-9]+$/)
  .transform(Number)
  .pipe(z.number().int().positive());

export const registrationsQuerySchema = z.object({
  eventId: z.uuid().optional(),
  participantId: z.uuid().optional(),
  status: z.enum(RegistrationStatus).optional(),
  page: integerQuery.pipe(z.number().max(2_147_483)).default(1),
  limit: integerQuery.pipe(z.number().max(100)).default(10),
});

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>;
export type RegistrationsQuery = z.infer<typeof registrationsQuerySchema>;
export type RegistrationStatusInput = z.infer<typeof registrationStatusSchema>;
