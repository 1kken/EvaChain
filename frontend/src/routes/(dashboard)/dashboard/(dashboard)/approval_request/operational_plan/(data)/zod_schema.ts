import { z } from 'zod';

export const uuidSchema = z.object({
	id: z.string().uuid()
});

export type UuidSchemaInput = z.infer<typeof uuidSchema>;
export type UuidSchema = typeof uuidSchema;
