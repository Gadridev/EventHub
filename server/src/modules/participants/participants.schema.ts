import { z } from "zod";

export const participantIdSchema = z.uuid();

export const createParticipantSchema = z.strictObject({
  fullName: z.string().trim().min(1).max(255),
  email: z.string().trim().toLowerCase().max(255).pipe(z.email()),
  phone: z.string().trim().max(30).nullable().optional(),
});

export const updateParticipantSchema = createParticipantSchema.partial().refine(
  (input) => Object.keys(input).length > 0,
  "Provide at least one field",
);

const integerQuery = z.string()
  .regex(/^[0-9]+$/)
  .transform(Number)
  .pipe(z.number().int().positive());

export const participantsQuerySchema = z.object({
  search: z.string().trim().max(255).optional(),
  page: integerQuery.pipe(z.number().max(2_147_483)).default(1),
  limit: integerQuery.pipe(z.number().max(100)).default(10),
});

export type CreateParticipantInput = z.infer<typeof createParticipantSchema>;
export type UpdateParticipantInput = z.infer<typeof updateParticipantSchema>;
export type ParticipantsQuery = z.infer<typeof participantsQuerySchema>;
