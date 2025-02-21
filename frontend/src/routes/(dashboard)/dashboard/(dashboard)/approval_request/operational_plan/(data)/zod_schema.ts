import { z } from 'zod';

export const uuidSchema = z.object({
	id: z.string().uuid()
});

export const revisionSchema = z.object({
	id: z.string().uuid(),
	op_creator_id: z.string().uuid(),
	message: z.string()
});

export type RevisionSchema = typeof revisionSchema;
export type RevisionSchemaInput = z.infer<typeof revisionSchema>;

export type UuidSchema = typeof uuidSchema;
export type UuidSchemaInput = z.infer<typeof uuidSchema>;
